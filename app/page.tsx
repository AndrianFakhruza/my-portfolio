import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { DesignGalleryMasonry } from "@/components/design-gallery-masonry";
import { sortProjects } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rawProjects = await prisma.project.findMany({
    where: { status: "published" },
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const allProjects = sortProjects(rawProjects);
  const webProjects = allProjects.filter((p) => p.projectType !== "gallery");
  const designProjects = allProjects.filter((p) => p.projectType === "gallery");

  const featuredWebProjects = webProjects.slice(0, 3);
  const featuredDesignProjects = designProjects.slice(0, 8);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative pt-24 sm:pt-28 pb-12 sm:pb-16 max-w-7xl mx-auto px-5 sm:px-8">
          {/* Ambient blur glow in background */}
          <div className="absolute top-16 left-1/3 -translate-x-1/2 w-[600px] h-[300px] bg-accent-500/10 dark:bg-accent-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Intro & Headline */}
            <div className="lg:col-span-7 space-y-5">
              {/* Role Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-paper-900/80 border border-paper-200/80 dark:border-paper-800/80 shadow-soft backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-accent-500" />
                <span className="text-xs font-semibold text-paper-700 dark:text-paper-300 tracking-wide">
                  Web Developer &amp; UI Designer
                </span>
              </div>

              {/* Headline - Adjusted size */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-[1.18]">
                Membangun website modern, antarmuka responsif, dan solusi{" "}
                <span className="relative inline-block text-accent-500">
                  teknologi
                  <span className="absolute left-0 bottom-1 w-full h-[5px] bg-accent-500/20 -z-10 rounded-full" />
                </span>
                .
              </h1>

              {/* Subheading - Adjusted size */}
              <p className="text-sm sm:text-base text-paper-600 dark:text-paper-300 leading-relaxed font-normal">
                Saya <strong>Andrian Fakhruza</strong>, lulusan Teknik Informatika dari Politeknik Negeri Lhokseumawe dengan ketertarikan dan pengalaman di bidang Web Development, UI Design, Data Science, dan Machine Learning. Membangun website serta antarmuka modern, responsif, dan mudah digunakan.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/projects"
                  className="btn-modern-accent"
                >
                  <span>Jelajahi Karya Pilihan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="btn-modern-secondary"
                >
                  <span>Mulai Diskusi Proyek</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Metrics Bar */}
              <div className="pt-5 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-paper-200/80 dark:border-paper-800/80">
                <div>
                  <div className="font-display text-sm sm:text-base font-bold text-paper-900 dark:text-paper-100">
                    Politeknik Negeri Lhokseumawe
                  </div>
                  <div className="text-xs text-paper-500 font-medium mt-0.5">
                    Teknik Informatika
                  </div>
                </div>
                <div>
                  <div className="font-display text-sm sm:text-base font-bold text-paper-900 dark:text-paper-100">
                    Web &amp; UI Design
                  </div>
                  <div className="text-xs text-paper-500 font-medium mt-0.5">
                    Modern &amp; Responsif
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="font-display text-sm sm:text-base font-bold text-accent-500">
                    Data &amp; ML
                  </div>
                  <div className="text-xs text-paper-500 font-medium mt-0.5">
                    Data Science &amp; Machine Learning
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Profile Photo Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] rounded-3xl overflow-hidden border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <Image
                  src="/profile.png"
                  alt="Andrian Fakhruza - Web Developer & UI Designer"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 w-max max-w-[90%] px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-md border border-paper-200/80 dark:border-paper-800/80 shadow-md flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500 shrink-0" />
                  <span className="font-semibold text-paper-950 dark:text-paper-50 tracking-tight">
                    Andrian Fakhruza
                  </span>
                  <span className="text-paper-300 dark:text-paper-700">·</span>
                  <span className="text-paper-600 dark:text-paper-400 font-medium text-[11px]">
                    Lhokseumawe, Aceh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: PROYEK WEBSITE (3 CARDS) */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-paper-200/80 dark:border-paper-800/80">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-accent-500 font-semibold">
                Studi Kasus &amp; Rekayasa Web
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                Proyek Website Pilihan
              </h2>
            </div>
            <Link
              href="/projects?tab=web"
              className="inline-flex items-center gap-2 text-sm font-semibold text-paper-700 dark:text-paper-300 hover:text-accent-500 transition-colors group"
            >
              <span>Lihat Semua Proyek Web ({webProjects.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWebProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                layout="compact"
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: KARYA DESAIN (PINTEREST MASONRY) */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-5 sm:px-8 border-t border-paper-200/60 dark:border-paper-800/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-paper-200/80 dark:border-paper-800/80">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-accent-500 font-semibold">
                Galeri Visual &amp; Eksplorasi
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                Karya Desain Grafis &amp; UI
              </h2>
            </div>
            <Link
              href="/projects?tab=design"
              className="inline-flex items-center gap-2 text-sm font-semibold text-paper-700 dark:text-paper-300 hover:text-accent-500 transition-colors group"
            >
              <span>Lihat Semua Karya Desain ({designProjects.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8">
            <DesignGalleryMasonry
              projects={featuredDesignProjects}
              emptyMessage="Belum ada karya desain yang dipublikasikan."
              columns={6}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
