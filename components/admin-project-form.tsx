"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  Edit3,
} from "lucide-react";
import { slugify } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

interface Category {
  id: string;
  name: string;
  slug: string;
  type?: string;
}

interface GalleryItem {
  url: string;
  caption: string;
}

interface ProjectData {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: string;
  tags: string;
  cover: string;
  gallery: GalleryItem[];
  role: string;
  tools: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  status: string;
  order: number;
}

interface AdminProjectFormProps {
  initialData?: ProjectData;
  categories: Category[];
  isEditing?: boolean;
}

export function AdminProjectForm({
  initialData,
  categories,
  isEditing = false,
}: AdminProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    tags: initialData?.tags || "",
    cover: initialData?.cover || "",
    gallery: initialData?.gallery || [],
    role: initialData?.role || "",
    tools: initialData?.tools || "",
    liveUrl: initialData?.liveUrl || "",
    repoUrl: initialData?.repoUrl || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "published",
    order: initialData?.order ?? 0,
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-slug on title change
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugify(val),
    }));
  };

  // Cover image file upload handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal mengunggah");

      setFormData((prev) => ({ ...prev, cover: resData.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  // Gallery image file upload handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        const resData = await res.json();
        if (res.ok) {
          setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, { url: resData.url, caption: "" }],
          }));
        }
      }
    } catch (err: any) {
      alert("Error saat unggah gambar galeri");
    } finally {
      setUploadingGallery(false);
    }
  };

  const updateGalleryCaption = (index: number, caption: string) => {
    setFormData((prev) => {
      const nextGallery = [...prev.gallery];
      nextGallery[index].caption = caption;
      return { ...prev, gallery: nextGallery };
    });
  };

  const removeGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/projects/${initialData?.id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan proyek");

      router.push("/admin/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 border border-paper-200 dark:border-paper-800 hover:border-accent-500 text-paper-600 dark:text-paper-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-paper-950 dark:text-paper-50">
              {isEditing ? "Perbarui Proyek" : "Tambah Proyek Baru"}
            </h1>
            <p className="text-xs font-mono text-paper-500">
              Isi data detail proyek dan studi kasus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Simpan Proyek
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-rose-500/40 bg-rose-500/10 text-xs font-mono text-rose-600">
          {error}
        </div>
      )}

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Primary Details) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Judul Proyek <span className="text-accent-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="mis. Nusantara Capital Dashboard"
                className="w-full px-4 py-2.5 text-sm bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 text-paper-900 dark:text-paper-100"
              />
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-paper-500 pt-0.5">
                <span className="text-paper-400">URL publik:</span>
                <span className="text-accent-500 font-semibold">/projects/{formData.slug || "..."}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Ringkasan Singkat (Summary) <span className="text-accent-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Ringkasan 1-2 kalimat untuk kartu portofolio..."
                className="w-full px-4 py-2.5 text-sm bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 text-paper-900 dark:text-paper-100"
              />
            </div>
          </div>

          {/* Case Study Content (Markdown) */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-800 pb-3">
              <label className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Naskah Studi Kasus (Markdown)
              </label>
              <div className="flex items-center gap-1 border border-paper-200 dark:border-paper-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1 text-xs font-mono flex items-center gap-1 ${
                    activeTab === "edit"
                      ? "bg-accent-500 text-white"
                      : "text-paper-600 dark:text-paper-400"
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 text-xs font-mono flex items-center gap-1 ${
                    activeTab === "preview"
                      ? "bg-accent-500 text-white"
                      : "text-paper-600 dark:text-paper-400"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Pratinjau
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <textarea
                rows={14}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Tulis latar belakang masalah, pendekatan desain, dan hasil terukur menggunakan Markdown..."
                className="w-full font-mono text-xs px-4 py-3 bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 text-paper-900 dark:text-paper-100 resize-y"
              />
            ) : (
              <div className="min-h-[300px] p-4 border border-paper-200 dark:border-paper-800 bg-paper-50 dark:bg-paper-950">
                <MarkdownRenderer content={formData.content || "_Belum ada konten studi kasus._"} />
              </div>
            )}
          </div>

          {/* Gallery Manager */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-800 pb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Galeri Gambar ({formData.gallery.length} Foto)
              </h3>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-paper-100 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-800 dark:text-paper-200 hover:border-accent-500 transition-colors">
                <Upload className="w-3 h-3" />
                {uploadingGallery ? "Mengunggah..." : "Tambah Foto"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-4">
              {formData.gallery.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 border border-paper-200 dark:border-paper-800 bg-paper-50 dark:bg-paper-900"
                >
                  <div className="relative w-20 h-14 shrink-0 bg-paper-200 dark:border-paper-800 overflow-hidden">
                    <Image src={item.url} alt="Galeri" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    value={item.caption}
                    onChange={(e) => updateGalleryCaption(idx, e.target.value)}
                    placeholder="Keterangan foto (opsional)..."
                    className="flex-1 px-3 py-1.5 text-xs bg-card-bg border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-600"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.gallery.length === 0 && (
                <p className="text-xs font-mono text-paper-500 text-center py-4">
                  Belum ada gambar dalam galeri.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Metadata, Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Featured */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300 pb-2 border-b border-paper-200 dark:border-paper-800">
              Publikasi & Visibilitas
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Status Rilis
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              >
                <option value="published">Publik (Published)</option>
                <option value="draft">Draf (Draft)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Kategori Proyek <span className="text-accent-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-xs font-mono text-paper-700 dark:text-paper-300">
                Tandai Sebagai Unggulan
              </label>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-accent-500"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Urutan Tampil (Nomor)
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-3 py-1.5 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300 pb-2 border-b border-paper-200 dark:border-paper-800">
              Cover Proyek
            </h3>

            {formData.cover && (
              <div className="relative aspect-[16/10] w-full border border-paper-200 dark:border-paper-800 bg-paper-100 overflow-hidden">
                <Image src={formData.cover} alt="Cover" fill className="object-cover" />
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                value={formData.cover}
                onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                placeholder="URL Gambar Cover atau Unggah..."
                className="w-full px-3 py-2 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
              <label className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider border border-paper-200 dark:border-paper-800 hover:border-accent-500 cursor-pointer bg-paper-100 dark:bg-paper-900 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploadingCover ? "Mengunggah..." : "Unggah Gambar"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Metadata: Role, Tools, Links */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300 pb-2 border-b border-paper-200 dark:border-paper-800">
              Spesifikasi Karya
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Peran (Role)
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="mis. Lead Product Designer & Dev"
                className="w-full px-3 py-2 text-xs bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Alat / Tools (pisahkan koma)
              </label>
              <input
                type="text"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                placeholder="mis. Next.js, Figma, Tailwind, TypeScript"
                className="w-full px-3 py-2 text-xs bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Tagar / Tags (pisahkan koma)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="mis. Fintech, Dashboard, SaaS"
                className="w-full px-3 py-2 text-xs bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Tautan Live Demo (URL)
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Tautan Repositori GitHub (URL)
              </label>
              <input
                type="url"
                value={formData.repoUrl}
                onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 text-xs bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

