import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

interface ArticleDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: `${post.title} · Catatan Andrian`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} · Andrian`,
      description: post.excerpt,
      images: [post.cover],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) notFound();

  const tagsList = post.tags ? post.tags.split(",").map((t) => t.trim()) : [];

  const relatedPosts = await prisma.post.findMany({
    where: { status: "published", id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-24 sm:pt-28">
        {/* Back */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-paper-100 dark:bg-paper-900 text-paper-600 dark:text-paper-400 border border-paper-200 dark:border-paper-800 hover:border-accent-500 hover:text-accent-500 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Daftar Artikel
          </Link>
        </div>

        <article className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
          {/* Header */}
          <header className="space-y-6 pb-10 border-b border-paper-200/80 dark:border-paper-800/80">
            {/* Meta Pills */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-paper-100 dark:bg-paper-900 border border-paper-200/60 dark:border-paper-800 text-paper-600 dark:text-paper-400">
                <Calendar className="w-3.5 h-3.5 text-accent-500" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-paper-500 dark:text-paper-400">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-[1.15]">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-paper-600 dark:text-paper-300 leading-relaxed font-light">
              {post.excerpt}
            </p>

            {/* Author Row */}
            <div className="flex items-center gap-3.5 pt-4">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-accent-500/30 shadow-md">
                <Image
                  src="/profile.jpg"
                  alt="Andrian Fakhruza"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-paper-900 dark:text-paper-100">Andrian Fakhruza</p>
                <p className="text-xs text-paper-500 dark:text-paper-400 font-medium">Web Developer &amp; UI Designer</p>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover && (
            <div className="my-10 relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 shadow-card">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="py-8">
            <MarkdownRenderer content={post.content} />
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto px-5 sm:px-8 py-16 border-t border-paper-200/80 dark:border-paper-800/80">
            <h2 className="font-display text-2xl font-bold tracking-tight text-paper-950 dark:text-paper-50 mb-8">
              Artikel Terkait Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
