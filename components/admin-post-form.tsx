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
  Edit3,
  Eye,
  Clock,
} from "lucide-react";
import { slugify, calculateReadingTime } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string;
  status: string;
  readingTime: string;
  publishedAt?: string;
}

interface AdminPostFormProps {
  initialData?: PostData;
  isEditing?: boolean;
}

export function AdminPostForm({ initialData, isEditing = false }: AdminPostFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    cover: initialData?.cover || "",
    tags: initialData?.tags || "",
    status: initialData?.status || "published",
    readingTime: initialData?.readingTime || "5 min",
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !isEditing ? slugify(val) : prev.slug,
    }));
  };

  const handleContentChange = (val: string) => {
    const estTime = calculateReadingTime(val);
    setFormData((prev) => ({
      ...prev,
      content: val,
      readingTime: estTime,
    }));
  };

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
      if (!res.ok) throw new Error(resData.error || "Gagal mengunggah gambar");

      setFormData((prev) => ({ ...prev, cover: resData.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isEditing
        ? `/api/posts/${initialData?.id}`
        : "/api/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan artikel");

      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 border border-paper-200 dark:border-paper-800 hover:border-accent-500 text-paper-600 dark:text-paper-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-paper-950 dark:text-paper-50">
              {isEditing ? "Perbarui Artikel Blog" : "Tulis Artikel Baru"}
            </h1>
            <p className="text-xs font-mono text-paper-500">
              Editor artikel dengan pratinjau Markdown dan kalkulasi waktu baca otomatis
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
                Simpan Artikel
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Content) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Judul Artikel <span className="text-accent-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="mis. Mengapa Portofolio Desainer Tidak Boleh..."
                className="w-full px-4 py-2.5 text-sm bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Slug URL
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="mis. portofolio-tanpa-template-ai"
                className="w-full px-4 py-2 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                Ringkasan Singkat (Excerpt) <span className="text-accent-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Ringkasan 2-3 kalimat untuk kartu preview artikel..."
                className="w-full px-4 py-2.5 text-sm bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>
          </div>

          {/* Markdown Content with tabs */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-800 pb-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                  Naskah Artikel (Markdown)
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-paper-400">
                  <Clock className="w-3 h-3" />
                  Waktu baca: {formData.readingTime}
                </span>
              </div>

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
                  Editor
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
                rows={16}
                required
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Tulis artikel dengan format Markdown lengkap..."
                className="w-full font-mono text-xs px-4 py-3 bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 text-paper-900 dark:text-paper-100 resize-y"
              />
            ) : (
              <div className="min-h-[350px] p-6 border border-paper-200 dark:border-paper-800 bg-paper-50 dark:bg-paper-950">
                <MarkdownRenderer content={formData.content || "_Belum ada isi naskah._"} />
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Meta & Cover) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300 pb-2 border-b border-paper-200 dark:border-paper-800">
              Pengaturan Rilis
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Status Publikasi
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              >
                <option value="published">Publik (Terbit Langsung)</option>
                <option value="draft">Draf (Disimpan Internal)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                Tagar / Topik (pisahkan koma)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="mis. Desain, Opini, CSS, UX"
                className="w-full px-3 py-2 text-xs bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300 pb-2 border-b border-paper-200 dark:border-paper-800">
              Gambar Sampul (Cover)
            </h3>

            {formData.cover && (
              <div className="relative aspect-[16/10] w-full border border-paper-200 dark:border-paper-800 bg-paper-100 overflow-hidden">
                <Image src={formData.cover} alt="Sampul" fill className="object-cover" />
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
                {uploadingCover ? "Mengunggah..." : "Unggah Sampul"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

