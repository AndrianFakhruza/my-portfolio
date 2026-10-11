import Link from "next/link";
import Image from "next/image";
import { Plus, Edit3, ExternalLink, Calendar, Clock } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "@/components/admin-delete-buttons";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200 dark:border-paper-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-accent-500 font-semibold">
            Publikasi & Konten
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50 mt-1">
            Daftar Artikel Blog
          </h1>
          <p className="text-xs font-mono text-paper-500 mt-1">
            Total {posts.length} artikel tersimpan dalam database.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-accent-500 hover:bg-accent-600 text-white font-bold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tulis Artikel Baru
        </Link>
      </div>

      {/* Table */}
      <div className="border border-paper-200 dark:border-paper-800 bg-card-bg overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-paper-100/70 dark:bg-paper-900/60 font-mono text-paper-500 uppercase tracking-wider border-b border-paper-200 dark:border-paper-800">
            <tr>
              <th className="py-3 px-4 w-20">Sampul</th>
              <th className="py-3 px-4">Judul & Cuplikan</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Waktu Baca</th>
              <th className="py-3 px-4">Tanggal Rilis</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100 dark:divide-paper-900">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-paper-50/50 dark:hover:bg-paper-900/30 transition-colors">
                <td className="py-3 px-4">
                  <div className="relative w-14 h-10 bg-paper-100 border border-paper-200 dark:border-paper-800 overflow-hidden">
                    <Image src={post.cover || "/placeholder-post.jpg"} alt={post.title} fill className="object-cover" />
                  </div>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <div className="font-semibold text-paper-900 dark:text-paper-100 text-sm truncate">
                    {post.title}
                  </div>
                  <div className="text-xs text-paper-500 line-clamp-1 mt-0.5">
                    {post.excerpt}
                  </div>
                </td>
                <td className="py-3 px-4 font-mono">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      post.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-paper-600 dark:text-paper-400">
                  {post.readingTime}
                </td>
                <td className="py-3 px-4 font-mono text-paper-500">
                  {formatDate(post.publishedAt)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1.5 text-paper-400 hover:text-accent-500 transition-colors"
                      title="Lihat Pratinjau Publik"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-1.5 text-paper-700 dark:text-paper-300 hover:text-accent-500 transition-colors"
                      title="Edit Artikel"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <DeletePostButton id={post.id} title={post.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

