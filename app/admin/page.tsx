import Link from "next/link";
import {
  FolderKanban,
  FileText,
  Tags,
  Mail,
  Plus,
  ArrowRight,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    projectCount,
    draftProjectCount,
    postCount,
    categoryCount,
    unreadMessageCount,
    recentProjects,
    recentMessages,
  ] = await Promise.all([
    prisma.project.count({ where: { status: "published" } }),
    prisma.project.count({ where: { status: "draft" } }),
    prisma.post.count(),
    prisma.category.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.project.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const metrics = [
    {
      label: "Proyek Publikasi",
      value: projectCount,
      sub: `${draftProjectCount} draft`,
      icon: FolderKanban,
      color: "amber",
    },
    {
      label: "Artikel Blog",
      value: postCount,
      sub: "Live & aktif",
      icon: FileText,
      color: "zinc",
    },
    {
      label: "Kategori",
      value: categoryCount,
      sub: "Tersedia untuk filter",
      icon: Tags,
      color: "amber",
    },
    {
      label: "Pesan Belum Dibaca",
      value: unreadMessageCount,
      sub: unreadMessageCount > 0 ? "Perlu respons" : "Semua dibaca",
      icon: Mail,
      color: unreadMessageCount > 0 ? "rose" : "zinc",
    },
  ];

  const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
    amber: {
      bg: "bg-amber-500/10",
      icon: "text-[#F59E0B]",
      badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
    zinc: {
      bg: "bg-paper-100 dark:bg-paper-800",
      icon: "text-paper-700 dark:text-paper-300",
      badge: "bg-paper-200 dark:bg-paper-700 text-paper-800 dark:text-paper-200",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-500/10",
      icon: "text-rose-600 dark:text-rose-400",
      badge: "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-widest mb-1">
            Selamat datang kembali
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-900 dark:text-paper-50">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Proyek Baru
          </Link>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white dark:bg-paper-800 border border-paper-200 dark:border-paper-700 text-paper-700 dark:text-paper-300 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
          >
            <Plus className="w-4 h-4" />
            Artikel Baru
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const c = colorMap[m.color] || colorMap.zinc;
          return (
            <div
              key={m.label}
              className="p-5 rounded-2xl bg-white dark:bg-[#18181B] border border-paper-200/80 dark:border-paper-800/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-paper-300 dark:text-paper-600" />
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold font-display text-paper-900 dark:text-paper-50 tracking-tight">
                  {m.value}
                </p>
                <p className="text-xs text-paper-500 dark:text-paper-400 mt-0.5">{m.label}</p>
              </div>
              <div className={`mt-3 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.badge}`}>
                {m.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column: Recent Projects & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Projects */}
        <div className="lg:col-span-7 bg-white dark:bg-[#18181B] rounded-2xl border border-paper-200/80 dark:border-paper-800/80 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-paper-100 dark:border-paper-800">
            <h2 className="font-semibold text-paper-800 dark:text-paper-200 text-sm">
              Proyek Terbaru
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-semibold text-[#F59E0B] hover:text-amber-600 flex items-center gap-1"
            >
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-paper-100 dark:divide-paper-800">
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-paper-50 dark:hover:bg-paper-800/40 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-paper-800 dark:text-paper-200 truncate">
                      {p.title}
                    </span>
                  </div>
                  <div className="text-xs text-paper-400 flex items-center gap-2 mt-0.5">
                    <span>{p.category?.name}</span>
                    <span>·</span>
                    <span className={p.status === "published" ? "text-amber-600 dark:text-[#F59E0B] font-medium" : "text-paper-400"}>
                      {p.status === "published" ? "Publik" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-paper-200 dark:border-paper-700 text-paper-600 dark:text-paper-400 hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-paper-400 hover:text-[#F59E0B] hover:bg-amber-500/10 transition-all"
                    title="Lihat di situs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-5 bg-white dark:bg-[#18181B] rounded-2xl border border-paper-200/80 dark:border-paper-800/80 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-paper-100 dark:border-paper-800">
            <h2 className="font-semibold text-paper-800 dark:text-paper-200 text-sm">
              Pesan Masuk
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-[#F59E0B] hover:text-amber-600 flex items-center gap-1"
            >
              Kotak pesan <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-paper-100 dark:divide-paper-800">
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="w-8 h-8 text-paper-300 dark:text-paper-600 mx-auto mb-2" />
                <p className="text-xs text-paper-400">Belum ada pesan masuk.</p>
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="px-5 py-3.5 hover:bg-paper-50 dark:hover:bg-paper-800/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-[#18181B] flex items-center justify-center text-[10px] font-black flex-shrink-0">
                        {msg.name[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-xs text-paper-800 dark:text-paper-200">
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-paper-400">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 ml-8">
                    {msg.body}
                  </p>
                  <div className="ml-8 mt-1.5">
                    <Link
                      href="/admin/messages"
                      className="text-[11px] font-semibold text-[#F59E0B] hover:text-amber-600"
                    >
                      Baca selengkapnya →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
