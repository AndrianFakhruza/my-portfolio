"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteProjectButton({
  id,
  title,
  onDeleted,
}: {
  id: string;
  title: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus proyek "${title}" secara permanen?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menghapus proyek");
      if (onDeleted) {
        onDeleted();
      }
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus proyek.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
      title="Hapus Proyek"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Hapus artikel "${title}" secara permanen?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menghapus artikel");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus artikel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
      title="Hapus Artikel"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

export function DeleteCategoryButton({
  id,
  name,
  projectCount = 0,
  onDeleted,
}: {
  id: string;
  name: string;
  projectCount?: number;
  onDeleted?: (id: string) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmMessage =
      projectCount > 0
        ? `Kategori "${name}" memiliki ${projectCount} proyek terhubung. Jika kategori ini dihapus, proyek di dalamnya juga akan ikut terhapus secara permanen. Lanjutkan menghapus?`
        : `Hapus kategori "${name}" secara permanen?`;

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghapus kategori");
      }
      onDeleted?.(id);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus kategori.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
      title="Hapus Kategori"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

export function DeleteMessageButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Hapus pesan ini secara permanen?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal menghapus pesan");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
      title="Hapus Pesan"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}

