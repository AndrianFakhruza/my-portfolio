import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectsView } from "@/components/projects-view";

export const metadata: Metadata = {
  title: "Arsip Portofolio & Proyek",
  description:
    "Katalog lengkap hasil kerja desain antarmuka, aplikasi web modern, riset pengguna, dan rancangan sistem digital oleh Andrian.",
};

export const revalidate = 60;

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: { status: "published" },
      include: { category: true },
      orderBy: { order: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 w-full">
        {/* Page Header - Compact */}
        <div className="max-w-3xl space-y-2.5 mb-6">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-tight">
            Desain Produk &amp; Rekayasa Web
          </h1>
          <p className="text-sm sm:text-base text-paper-600 dark:text-paper-400 leading-relaxed font-normal">
            Koleksi studi kasus terpilih yang mendokumentasikan proses dari identifikasi masalah, eksplorasi visual, hingga implementasi kode siap produksi.
          </p>
        </div>

        {/* Interactive Filter & Grid */}
        <ProjectsView initialProjects={projects} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
