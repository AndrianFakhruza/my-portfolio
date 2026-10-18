"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GripVertical, Edit3, ExternalLink, Loader2, Check, AlertCircle, Sparkles } from "lucide-react";
import { DeleteProjectButton } from "./admin-delete-buttons";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface AdminProjectItem {
  id: string;
  title: string;
  slug: string;
  order: number;
  cover: string;
  status: string;
  categories?: Category[];
  category?: Category | null;
}

interface AdminProjectsTableProps {
  initialProjects: AdminProjectItem[];
}

export function AdminProjectsTable({ initialProjects }: AdminProjectsTableProps) {
  const [projects, setProjects] = useState<AdminProjectItem[]>(initialProjects);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state if server re-renders initialProjects
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder array
    const updated = [...projects];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Re-assign 1-based order automatically (1 at top, 2 second, etc.)
    const reordered = updated.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setProjects(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Persist new order to server
    await saveNewOrder(reordered);
  };

  const saveNewOrder = async (items: AdminProjectItem[]) => {
    setSaveStatus("saving");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    try {
      const payload = {
        items: items.map((p, idx) => ({
          id: p.id,
          order: idx + 1,
        })),
      };

      const res = await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal menyimpan urutan baru");
      }

      setSaveStatus("saved");
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
      saveTimeoutRef.current = setTimeout(() => {
        setSaveStatus("idle");
      }, 3500);
    }
  };

  const handleDeleteSuccess = (id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      return next.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  return (
    <div className="space-y-3">
      {/* Table Helper / Auto-Save Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2 text-paper-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-600 dark:text-accent-400 font-mono text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            Drag &amp; Drop Aktif
          </span>
          <span className="text-paper-500 dark:text-paper-400">
            Tahan ikon grip atau baris proyek lalu geser ke atas/bawah untuk mengubah urutan tampilan.
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 min-h-[24px]">
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1.5 text-accent-600 dark:text-accent-400 font-mono text-[11px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Menyimpan urutan baru...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
              <Check className="w-3.5 h-3.5" />
              Urutan berhasil disimpan!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-mono text-[11px] font-bold">
              <AlertCircle className="w-3.5 h-3.5" />
              Gagal menyimpan perubahan urutan
            </span>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="border border-paper-200 dark:border-paper-800 bg-card-bg overflow-x-auto rounded-xl shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-paper-100/70 dark:bg-paper-900/60 font-mono text-paper-500 uppercase tracking-wider border-b border-paper-200 dark:border-paper-800">
            <tr>
              <th className="py-3 px-4 w-28 text-center">Urutan</th>
              <th className="py-3 px-4 w-20">Cover</th>
              <th className="py-3 px-4">Judul &amp; Slug</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100 dark:divide-paper-900">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-paper-400">
                  Belum ada proyek tersimpan.
                </td>
              </tr>
            ) : (
              projects.map((p, idx) => {
                const isDragging = draggedIndex === idx;
                const isOver = dragOverIndex === idx && draggedIndex !== idx;

                return (
                  <tr
                    key={p.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, idx)}
                    className={`group transition-all duration-150 select-none cursor-grab active:cursor-grabbing ${
                      isDragging
                        ? "opacity-30 bg-accent-500/10 scale-[0.99]"
                        : "hover:bg-paper-50/70 dark:hover:bg-paper-900/40"
                    } ${
                      isOver
                        ? "border-t-2 border-accent-500 bg-accent-500/5 shadow-inner"
                        : ""
                    }`}
                  >
                    {/* Urutan & Drag Handle Column */}
                    <td className="py-3 px-4 font-mono text-paper-500">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="p-1 rounded text-paper-400 group-hover:text-accent-500 group-hover:bg-accent-500/10 transition-colors"
                          title="Tahan dan geser untuk memindahkan urutan"
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-paper-100 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-paper-700 dark:text-paper-300 min-w-[32px] text-center shadow-xs">
                          #{idx + 1}
                        </span>
                      </div>
                    </td>

                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-14 h-10 bg-paper-100 border border-paper-200 dark:border-paper-800 overflow-hidden rounded-md shadow-xs">
                        <Image
                          src={p.cover || "/placeholder-project.jpg"}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Judul & Slug */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-paper-900 dark:text-paper-100 text-sm">
                        {p.title}
                      </div>
                      <div className="font-mono text-[11px] text-paper-400">
                        /{p.slug}
                      </div>
                    </td>

                    {/* Kategori Multi-Pill */}
                    <td className="py-3 px-4 font-mono text-paper-600 dark:text-paper-400">
                      <div className="flex flex-wrap gap-1">
                        {(p.categories && p.categories.length > 0
                          ? p.categories
                          : p.category
                          ? [p.category]
                          : []
                        ).map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2 py-0.5 rounded bg-paper-100 dark:bg-paper-900 border border-paper-200 dark:border-paper-800 text-[11px]"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-paper-400 hover:text-accent-500 transition-colors"
                          title="Lihat Pratinjau Publik"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="p-1.5 text-paper-700 dark:text-paper-300 hover:text-accent-500 transition-colors"
                          title="Edit Proyek"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <DeleteProjectButton
                          id={p.id}
                          title={p.title}
                          onDeleted={() => handleDeleteSuccess(p.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

