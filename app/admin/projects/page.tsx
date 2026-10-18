import Link from "next/link";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { sortProjects } from "@/lib/utils";
import { AdminProjectsTable } from "@/components/admin-projects-table";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const rawProjects = await prisma.project.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });

  const projects = sortProjects(rawProjects);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-500 font-semibold">
            Manajemen Konten
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50 mt-1">
            Daftar Proyek Portofolio
          </h1>
          <p className="text-xs font-mono text-paper-500 mt-1">
            Total {projects.length} proyek tersimpan dalam database.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Proyek Baru
        </Link>
      </div>

      {/* Interactive Draggable Projects Table */}
      <AdminProjectsTable initialProjects={projects} />
    </div>
  );
}

