"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

interface MediaItem {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export function AdminMediaView() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.media) {
        setMediaList(data.media);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);

        await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
      }
      await fetchMedia();
    } catch (err) {
      alert("Error saat unggah media");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Hapus file "${fileName}" dari server?`)) return;

    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (e) {
      alert("Gagal menghapus file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-500 font-semibold">
            Aset Digital
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50 mt-1">
            Pustaka Media & Gambar
          </h1>
          <p className="text-xs font-mono text-paper-500 mt-1">
            Unggah aset gambar untuk digunakan pada proyek atau artikel blog.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold transition-colors cursor-pointer">
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Mengunggah...
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              Unggah File Baru
            </>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-paper-500 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-accent-500" />
          Memuat pustaka media...
        </div>
      ) : mediaList.length === 0 ? (
        <div className="p-16 border border-dashed border-paper-300 dark:border-paper-800 text-center space-y-4">
          <ImageIcon className="w-10 h-10 text-paper-400 mx-auto" />
          <p className="text-sm font-mono text-paper-500">
            Belum ada file media yang diunggah ke server.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-paper-900 text-white dark:bg-paper-100 dark:text-paper-900 cursor-pointer">
            <Upload className="w-3 h-3" />
            Pilih file gambar
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mediaList.map((item) => (
            <div
              key={item.name}
              className="group border border-paper-200 dark:border-paper-800 bg-card-bg overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-paper-100 dark:bg-paper-900">
                <Image
                  src={item.url}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white text-paper-900 rounded-full hover:bg-accent-500 hover:text-white transition-colors"
                    title="Buka ukuran penuh"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.name)}
                    className="p-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                    title="Hapus media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="text-[11px] font-mono text-paper-700 dark:text-paper-300 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-paper-400">
                  <span>{formatFileSize(item.size)}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(item.url)}
                    className="inline-flex items-center gap-1 text-accent-500 hover:underline cursor-pointer"
                    title="Salin path URL gambar"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

