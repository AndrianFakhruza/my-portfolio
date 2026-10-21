"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit3, Loader2, Save, X } from "lucide-react";
import { DeleteCategoryButton } from "./admin-delete-buttons";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count?: {
    projects: number;
  };
}

export function AdminCategoriesView({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("desain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setType("desain");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setType(cat.type);
    setError(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan kategori");

      if (data.category) {
        if (editingCategory) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === data.category.id ? { ...c, ...data.category } : c
            )
          );
        } else {
          setCategories((prev) => [
            ...prev,
            { ...data.category, _count: { projects: 0 } },
          ]);
        }
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-500 font-semibold">
            Klasifikasi Karya
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50 mt-1">
            Kelola Kategori Dinamis
          </h1>
          <p className="text-xs font-mono text-paper-500 mt-1">
            Kategori ini langsung digunakan sebagai tab filter pada halaman /projects.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Kategori
        </button>
      </div>

      {/* Table */}
      <div className="border border-paper-200 dark:border-paper-800 bg-card-bg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-paper-100/70 dark:bg-paper-900/60 font-mono text-paper-500 uppercase tracking-wider border-b border-paper-200 dark:border-paper-800">
            <tr>
              <th className="py-3 px-4">Nama Kategori</th>
              <th className="py-3 px-4">Slug Filter</th>
              <th className="py-3 px-4">Jumlah Proyek</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100 dark:divide-paper-900">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-paper-50/50 dark:hover:bg-paper-900/30 transition-colors">
                <td className="py-3 px-4 font-semibold text-paper-900 dark:text-paper-100 text-sm">
                  {cat.name}
                </td>
                <td className="py-3 px-4 font-mono text-paper-500">
                  {cat.slug}
                </td>
                <td className="py-3 px-4 font-mono text-paper-600 dark:text-paper-400">
                  {cat._count?.projects ?? 0} proyek terhubung
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-paper-700 dark:text-paper-300 hover:text-accent-500 transition-colors cursor-pointer"
                      title="Edit Kategori"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <DeleteCategoryButton
                      id={cat.id}
                      name={cat.name}
                      projectCount={cat._count?.projects ?? 0}
                      onDeleted={(deletedId) =>
                        setCategories((prev) => prev.filter((c) => c.id !== deletedId))
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md border border-paper-200 dark:border-paper-800 bg-card-bg p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-paper-200 dark:border-paper-800">
              <h2 className="font-display text-lg font-bold text-paper-950 dark:text-paper-50">
                {editingCategory ? "Ubah Kategori" : "Tambah Kategori Baru"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-paper-500 hover:text-paper-900 dark:hover:text-paper-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 border border-rose-500/40 bg-rose-500/10 text-xs font-mono text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                  Nama Kategori <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="mis. Mobile Application"
                  className="w-full px-4 py-2.5 text-sm bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
                />
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-paper-500 pt-0.5">
                  <span className="text-paper-400">Slug filter otomatis:</span>
                  <span className="text-accent-500 font-semibold">{slug || "..."}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono uppercase text-paper-600 hover:text-paper-900 dark:text-paper-400 dark:hover:text-paper-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

