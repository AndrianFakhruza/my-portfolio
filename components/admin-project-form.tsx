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
  ImageIcon,
  ImagePlus,
  FileText,
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
  categoryIds: string[];
  categoryId?: string;
  cover: string;
  gallery: GalleryItem[];
  tools: string;
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  status: string;
  order: number;
  projectType: string;
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
    categoryIds:
      initialData?.categoryIds && initialData.categoryIds.length > 0
        ? initialData.categoryIds
        : initialData?.categoryId
        ? [initialData.categoryId]
        : categories[0]?.id
        ? [categories[0].id]
        : [],
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    cover: initialData?.cover || "",
    gallery: initialData?.gallery || [],
    tools: initialData?.tools || "",
    liveUrl: initialData?.liveUrl || "",
    repoUrl: initialData?.repoUrl || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "published",
    order: initialData?.order ?? 0,
    projectType: initialData?.projectType || "default",
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

  // Fungsi upload file langsung ke Supabase Storage (bypasses batas 4.5MB Vercel)
  const uploadSingleFile = async (file: File): Promise<string> => {
    // 1. Minta Signed URL ke backend Next.js kita
    const signRes = await fetch("/api/upload", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    const signData = await signRes.json().catch(() => ({}));
    if (!signRes.ok) {
      if (signRes.status === 401) {
        throw new Error("Sesi login Anda telah kedaluwarsa. Silakan refresh dan masuk kembali.");
      }
      throw new Error(signData.error || `Gagal mempersiapkan upload untuk ${file.name}`);
    }

    // 2. Upload file byte langsung ke Supabase Storage (mendukung hingga 25MB+)
    const uploadRes = await fetch(signData.signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "image/jpeg",
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Gagal mengirim file ke storage (Status ${uploadRes.status})`);
    }

    return signData.publicUrl;
  };

  // Cover image file upload handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const inputElement = e.target;
    setUploadingCover(true);
    try {
      const publicUrl = await uploadSingleFile(file);
      setFormData((prev) => ({ ...prev, cover: publicUrl }));
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah gambar cover.");
    } finally {
      inputElement.value = "";
      setUploadingCover(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; filename: string } | null>(null);

  // Upload helper for multiple files (used by both input change & drag-and-drop)
  const uploadMultipleGalleryFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploadingGallery(true);
    setUploadProgress({ current: 0, total: files.length, filename: files[0].name });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length, filename: file.name });

        const publicUrl = await uploadSingleFile(file);

        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, { url: publicUrl, caption: "" }],
        }));
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat mengunggah gambar galeri.");
    } finally {
      setUploadingGallery(false);
      setUploadProgress(null);
    }
  };

  // Gallery file input handler
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const inputElement = e.target;
    await uploadMultipleGalleryFiles(inputElement.files!);
    inputElement.value = "";
  };

  // Drag and drop handlers for gallery
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await uploadMultipleGalleryFiles(e.dataTransfer.files);
    }
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
      if (formData.categoryIds.length === 0) {
        throw new Error("Pilih minimal satu kategori proyek");
      }

      if (formData.projectType === "gallery" && formData.gallery.length === 0) {
        throw new Error("Unggah minimal satu gambar karya desain");
      }

      // ── BILA TIPE GALLERY (DESAIN) & MEMBUAT BARU ──
      // Jika user mengunggah beberapa gambar sekaligus, pecah menjadi masing-masing 1 proyek mandiri
      if (formData.projectType === "gallery" && !isEditing) {
        const selectedCat = categories.find((c) => formData.categoryIds.includes(c.id));
        const catName = selectedCat ? selectedCat.name : "Desain";
        const baseTimestamp = Date.now();

        for (let i = 0; i < formData.gallery.length; i++) {
          const item = formData.gallery[i];
          const singleTitle = formData.title.trim()
            ? (formData.gallery.length > 1 ? `${formData.title.trim()} (${i + 1})` : formData.title.trim())
            : `Karya Desain ${catName} #${(baseTimestamp + i).toString().slice(-4)}`;

          const singleSlug = `desain-${(baseTimestamp + i).toString().slice(-6)}-${Math.random().toString(36).slice(2, 6)}`;
          const singleSummary = formData.summary.trim() || `Karya eksplorasi visual desain ${catName}.`;

          const payload = {
            ...formData,
            title: singleTitle,
            slug: singleSlug,
            summary: singleSummary,
            cover: item.url,
            gallery: [item],
            order: (formData.order ?? 0) + i,
          };

          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || `Gagal menyimpan gambar ke-${i + 1}`);
          }
        }

        router.push("/admin/projects");
        router.refresh();
        return;
      }

      // Untuk tipe gallery saat EDIT, otomatis set title, slug, summary, cover jika kosong
      let submitData = { ...formData };
      if (submitData.projectType === "gallery") {
        const selectedCat = categories.find((c) => formData.categoryIds.includes(c.id));
        const catName = selectedCat ? selectedCat.name : "Desain";
        if (!submitData.title.trim()) {
          submitData.title = `Karya Desain ${catName} #${Date.now().toString().slice(-4)}`;
        }
        if (!submitData.slug.trim()) {
          submitData.slug = `desain-${Date.now().toString().slice(-6)}`;
        }
        if (!submitData.summary.trim()) {
          submitData.summary = `Karya eksplorasi visual desain ${catName}.`;
        }
        if (submitData.gallery.length > 0) {
          submitData.cover = submitData.gallery[0].url;
        }
      }

      const url = isEditing
        ? `/api/projects/${initialData?.id}`
        : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
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
                {formData.projectType === "gallery" && !isEditing && formData.gallery.length > 1
                  ? `Simpan ${formData.gallery.length} Karya Desain`
                  : "Simpan Proyek"}
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

      {/* Pemilih Tipe Proyek */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
          Tipe Proyek <span className="text-accent-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Default: Studi Kasus */}
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, projectType: "default" }))}
            className={`relative flex items-start gap-4 p-4 border-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
              formData.projectType === "default"
                ? "border-accent-500 bg-accent-500/5 shadow-md shadow-accent-500/10"
                : "border-paper-200 dark:border-paper-800 bg-card-bg hover:border-paper-400 dark:hover:border-paper-600"
            }`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              formData.projectType === "default"
                ? "bg-accent-500 text-white"
                : "bg-paper-100 dark:bg-paper-900 text-paper-500 dark:text-paper-400"
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-sm font-bold ${
                formData.projectType === "default" ? "text-accent-500" : "text-paper-900 dark:text-paper-100"
              }`}>
                Proyek Studi Kasus
              </p>
              <p className="text-[11px] text-paper-500 dark:text-paper-400 mt-0.5 leading-relaxed">
                Proyek dengan konten markdown, link GitHub dan live demo
              </p>
            </div>
            {formData.projectType === "default" && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-accent-500 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">✓</span>
              </div>
            )}
          </button>

          {/* Gallery: Galeri Karya */}
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, projectType: "gallery" }))}
            className={`relative flex items-start gap-4 p-4 border-2 rounded-xl text-left transition-all duration-200 cursor-pointer ${
              formData.projectType === "gallery"
                ? "border-accent-500 bg-accent-500/5 shadow-md shadow-accent-500/10"
                : "border-paper-200 dark:border-paper-800 bg-card-bg hover:border-paper-400 dark:hover:border-paper-600"
            }`}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              formData.projectType === "gallery"
                ? "bg-accent-500 text-white"
                : "bg-paper-100 dark:bg-paper-900 text-paper-500 dark:text-paper-400"
            }`}>
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-sm font-bold ${
                formData.projectType === "gallery" ? "text-accent-500" : "text-paper-900 dark:text-paper-100"
              }`}>
                Galeri Karya Desain
              </p>
              <p className="text-[11px] text-paper-500 dark:text-paper-400 mt-0.5 leading-relaxed">
                Upload gambar desain, diklik langsung buka lightbox
              </p>
            </div>
            {formData.projectType === "gallery" && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-accent-500 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">✓</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Primary Details) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Slug (Hanya untuk Proyek Web) */}
          {formData.projectType !== "gallery" && (
            <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                  Judul Proyek <span className="text-accent-500">*</span>
                </label>
                <input
                  type="text"
                  required={formData.projectType !== "gallery"}
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
                  required={formData.projectType !== "gallery"}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu portofolio..."
                  className="w-full px-4 py-2.5 text-sm bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 text-paper-900 dark:text-paper-100"
                />
              </div>
            </div>
          )}

          {/* Case Study Content (Markdown) */}
          {formData.projectType !== "gallery" && (
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
          )}

          {/* Gallery Manager */}
          <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 dark:border-paper-800 pb-3">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300">
                  {formData.projectType === "gallery"
                    ? `Unggah Gambar Desain (${formData.gallery.length} Foto)`
                    : `Galeri Gambar (${formData.gallery.length} Foto)`}
                </h3>
                <p className="text-[11px] text-paper-500 dark:text-paper-400 mt-0.5">
                  Mendukung format JPG, PNG, WebP, SVG, AVIF, GIF (Maks. 4MB per foto)
                </p>
                {formData.projectType === "gallery" && (
                  <p className="text-[11px] text-accent-600 dark:text-accent-400 font-semibold mt-1">
                    💡 Setiap gambar yang diunggah akan otomatis disimpan sebagai 1 card karya desain tersendiri di web.
                  </p>
                )}
              </div>
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

            {/* Drag & Drop Multi-Image Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 overflow-hidden ${
                isDragging
                  ? "border-accent-500 bg-accent-500/10 scale-[1.01]"
                  : "border-paper-300 dark:border-paper-800 bg-paper-50/50 dark:bg-paper-950/40 hover:border-paper-400"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                disabled={uploadingGallery}
                onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />

              {uploadingGallery && uploadProgress ? (
                /* Loading & Progress State */
                <div className="flex flex-col items-center justify-center gap-3 py-2">
                  <div className="relative flex items-center justify-center">
                    <Loader2 className="w-9 h-9 animate-spin text-accent-500" />
                  </div>
                  <div className="space-y-1 max-w-xs mx-auto">
                    <p className="text-xs font-bold text-paper-900 dark:text-paper-100 flex items-center justify-center gap-2 font-mono">
                      <span>Mengunggah foto {uploadProgress.current} dari {uploadProgress.total}...</span>
                    </p>
                    <p className="text-[11px] text-paper-500 dark:text-paper-400 truncate max-w-[260px] mx-auto">
                      {uploadProgress.filename}
                    </p>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full max-w-xs bg-paper-200 dark:bg-paper-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-accent-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${Math.round((uploadProgress.current / uploadProgress.total) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-accent-500 font-semibold">
                    {Math.round((uploadProgress.current / uploadProgress.total) * 100)}% selesai
                  </span>
                </div>
              ) : (
                /* Default Dropzone State */
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-paper-100 dark:bg-paper-900 flex items-center justify-center text-paper-600 dark:text-paper-300">
                    <ImagePlus className="w-5 h-5 text-accent-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-paper-800 dark:text-paper-200">
                      Tarik dan lepaskan (drop) foto-foto ke sini, atau <span className="text-accent-500 underline">pilih sekaligus</span>
                    </p>
                    <p className="text-[11px] font-mono text-paper-500 dark:text-paper-400 mt-1">
                      Format: JPG, PNG, WebP, SVG, AVIF, GIF • Maksimal 4MB per file
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Thumbnail Gambar Galeri */}
            <div className="space-y-3">
              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {formData.gallery.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3] rounded-lg border border-paper-200 dark:border-paper-800 overflow-hidden bg-paper-100 dark:bg-paper-900 shadow-sm"
                    >
                      <Image
                        src={item.url}
                        alt={`Galeri item ${idx + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {/* Gradient overlay on hover with delete action */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(idx)}
                          className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                          title="Hapus foto ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-paper-500 text-center py-4">
                  Belum ada gambar dalam galeri.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Metadata, Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Category */}
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                  Kategori Proyek <span className="text-accent-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-paper-400">
                  {formData.categoryIds.length} dipilih
                </span>
              </div>
              <div className="flex flex-wrap gap-2 p-3 border border-paper-200 dark:border-paper-800 bg-paper-50/60 dark:bg-paper-900/60 rounded-lg">
                {categories.map((cat) => {
                  const isSelected = formData.categoryIds.includes(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setFormData((prev) => {
                          const exists = prev.categoryIds.includes(cat.id);
                          const nextIds = exists
                            ? prev.categoryIds.filter((id) => id !== cat.id)
                            : [...prev.categoryIds, cat.id];
                          return {
                            ...prev,
                            categoryIds: nextIds,
                            categoryId: nextIds[0] || "",
                          };
                        });
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-accent-500 text-white shadow-sm ring-1 ring-accent-500"
                          : "bg-card-bg text-paper-700 dark:text-paper-300 border border-paper-200 dark:border-paper-800 hover:border-accent-500/50"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({cat.type})</span>
                      {isSelected && <span className="text-xs font-bold ml-0.5">✓</span>}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-paper-500 dark:text-paper-400">
                Klik pada kategori untuk memilih atau membatalkan pilihan (bisa pilih lebih dari satu).
              </p>
            </div>

            {formData.projectType !== "gallery" && (
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-paper-600 dark:text-paper-400">
                  Urutan Tampil (Opsional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Math.max(0, Number(e.target.value) || 0) })}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-paper-50 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-900 dark:text-paper-100"
                />
                <p className="text-[11px] text-paper-500 dark:text-paper-400 leading-normal">
                  Beri <span className="font-semibold text-accent-500">0</span> untuk otomatis (proyek terbaru tampil paling awal). Isi angka <span className="font-semibold text-accent-500">1</span> jika ingin diprioritaskan di nomor satu paling atas.
                </p>
              </div>
            )}
          </div>

          {/* Cover Image (Hanya untuk Proyek Web) */}
          {formData.projectType !== "gallery" && (
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
                <p className="text-[11px] font-mono text-paper-500 dark:text-paper-400">
                  Format: JPG, PNG, WebP, SVG, AVIF, GIF (Maks. 4MB)
                </p>
              </div>
            </div>
          )}

          {/* Metadata: Tools, Links (Hanya untuk Proyek Web) */}
          {formData.projectType !== "gallery" && (
            <div className="p-6 border border-paper-200 dark:border-paper-800 bg-card-bg space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-paper-700 dark:text-paper-300 pb-2 border-b border-paper-200 dark:border-paper-800">
                Spesifikasi Karya
              </h3>

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
          )}
        </div>
      </div>
    </form>
  );
}

