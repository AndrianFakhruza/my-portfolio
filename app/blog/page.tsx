import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BlogView } from "@/components/blog-view";
import { PenLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Artikel & Catatan Desain",
  description:
    "Refleksi, esai, dan panduan praktis seputar desain produk digital, rekayasa frontend, tipografi, dan arsitektur web oleh Andrian.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 w-full">
        <div className="max-w-3xl space-y-4 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-500/10 text-accent-500 border border-accent-500/20">
            <PenLine className="w-3.5 h-3.5" />
            Esai &amp; Catatan
          </span>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-[1.08]">
            Pemikiran tentang Desain &amp; Web
          </h1>
          <p className="text-base sm:text-lg text-paper-600 dark:text-paper-400 leading-relaxed">
            Tulisan berkala mengenai filosofi desain antarmuka, keputusan teknis frontend, performa web, dan dinamika industri digital.
          </p>
        </div>

        <BlogView initialPosts={posts} />
      </main>
      <Footer />
    </>
  );
}
