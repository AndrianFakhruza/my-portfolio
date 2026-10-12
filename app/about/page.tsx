import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowUpRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import prisma from "@/lib/prisma";
import { TECH_ROW_1, TECH_ROW_2 } from "@/components/tech-stack-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang Andrian Fakhruza",
  description:
    "Profil profesional dan rekam akademis Andrian Fakhruza — Sarjana Terapan Teknik Informatika Politeknik Negeri Lhokseumawe dengan keahlian Web Development, UI/UX Design, dan Data Science.",
};

export default async function AboutPage() {
  const [profile, educations] = await Promise.all([
    prisma.aboutProfile.findFirst(),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
  ]);

  // Fallback defaults if DB is temporarily empty
  const displayEducations =
    educations.length > 0
      ? educations
      : [
          {
            id: "edu-1",
            institution: "Politeknik Negeri Lhokseumawe",
            degree: "Teknik Informatika",
            period: "2022 - SEKARANG",
            score: "IPK: 3.67 / 4.00",
            description: "",
          },
          {
            id: "edu-2",
            institution: "SMA Negeri Modal Bangsa Arun",
            degree: "MIPA / Sekolah Unggulan",
            period: "2019 - 2022",
            score: "Nilai Akhir: 93.62",
            description: "",
          },
        ];

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-20 sm:pt-24 pb-16 sm:pb-20">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 space-y-12 sm:space-y-16">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[450px] h-[300px] bg-amber-500/8 dark:bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* ─── Hero Section ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-10 sm:pb-12 border-b border-paper-200/80 dark:border-paper-800/80">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Profil Profesional &amp; Portofolio</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-[1.1]">
                {profile?.name ?? "Andrian Fakhruza"}
              </h1>

              <p className="text-base sm:text-lg text-paper-700 dark:text-paper-200 leading-relaxed font-normal">
                {profile?.bio1 ??
                  "Saya merupakan mahasiswa Teknik Informatika di Politeknik Negeri Lhokseumawe dengan ketertarikan mendalam pada Web Development, UI/UX Design, Data Science, dan Machine Learning."}
              </p>

              {profile?.bio2 && (
                <p className="text-sm sm:text-base text-paper-600 dark:text-paper-400 leading-relaxed">
                  {profile.bio2}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {profile?.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    download="CV-Andrian-Fakhruza.pdf"
                    className="btn-modern-primary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5"
                  >
                    <Download className="w-4 h-4" />
                    Unduh Curriculum Vitae
                  </a>
                )}
                <Link
                  href="/contact"
                  className="btn-modern-secondary text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5"
                >
                  <span>Hubungi Saya</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full max-w-[280px] sm:max-w-xs mx-auto overflow-hidden rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 shadow-card">
                <Image
                  src="/profile.jpg"
                  alt={`${profile?.name ?? "Andrian Fakhruza"} - Web Developer & UI Designer`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-paper-950/90 backdrop-blur-md border border-paper-200/60 dark:border-paper-800 shadow-md flex items-center justify-center text-center">
                    <span className="text-xs font-semibold text-paper-800 dark:text-paper-200">
                      📍 {profile?.location ?? "Lhokseumawe, Aceh"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── DUA KOLOM: ACADEMIC PATH (Kiri) & LOGO TEKNOLOGI (Kanan) ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* ── KOLOM KIRI: ACADEMIC PATH ── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Header Title with Line */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest uppercase text-paper-400 dark:text-paper-500 font-mono">
                  ACADEMIC PATH
                </span>
                <span className="h-[1.5px] w-12 bg-paper-300 dark:bg-paper-700 inline-block" />
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-7 space-y-9">
                {/* Connecting Vertical Line */}
                <div className="absolute left-[6px] top-3 bottom-3 w-[1.5px] bg-paper-200 dark:bg-paper-800" />

                {displayEducations.map((edu, idx) => (
                  <div key={edu.id || idx} className="relative group">
                    {/* Hollow Circle Node */}
                    <span className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-paper-900 dark:border-paper-100 bg-white dark:bg-[#18181B] group-hover:border-amber-500 transition-colors" />

                    <div className="space-y-1.5">
                      {/* Period */}
                      <p className="text-xs font-semibold text-paper-500 dark:text-paper-400 uppercase tracking-wider">
                        {edu.period}
                      </p>

                      {/* Institution Name */}
                      <h3 className="font-display text-lg sm:text-xl font-bold text-paper-950 dark:text-paper-50 leading-snug">
                        {edu.institution}
                      </h3>

                      {/* Major / Degree */}
                      <p className="text-sm font-medium text-paper-600 dark:text-paper-400">
                        {edu.degree}
                      </p>

                      {/* Score Badge */}
                      {edu.score && (
                        <div className="pt-1.5">
                          <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-paper-100 dark:bg-paper-800/90 text-paper-900 dark:text-paper-100 border border-paper-200/60 dark:border-paper-700/60 shadow-xs">
                            {edu.score}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── KOLOM KANAN: LOGO TEKNOLOGI & ALAT (EXACT SCREENSHOT STYLE) ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Title with Line */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest uppercase text-paper-400 dark:text-paper-500 font-mono">
                  TEKNOLOGI &amp; ALAT
                </span>
                <span className="h-[1.5px] w-12 bg-paper-300 dark:bg-paper-700 inline-block" />
              </div>

              {/* Exact 2 Rows of Clean Floating Logos with Smooth Hover & Animated Tooltip */}
              <div className="space-y-8 pt-4">
                {/* Baris 1: TypeScript, JavaScript, HTML, CSS, Tailwind CSS, PHP */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-7 md:gap-8">
                  {TECH_ROW_1.map((tech) => (
                    <div
                      key={tech.name}
                      className="relative group flex items-center justify-center cursor-pointer"
                      aria-label={tech.name}
                    >
                      {/* Logo with Smooth Float/Lift Animation */}
                      <div className="transition-all duration-300 ease-out group-hover:scale-115 group-hover:-translate-y-1.5 filter group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
                        {tech.icon}
                      </div>

                      {/* Smooth Animated Tooltip Name */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-paper-950/95 dark:bg-paper-800/95 text-white dark:text-paper-100 text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-xl border border-paper-700/50 dark:border-paper-600/60 pointer-events-none opacity-0 scale-95 translate-y-1.5 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-30">
                        {tech.name}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-paper-950/95 dark:bg-paper-800/95 border-r border-b border-paper-700/50 dark:border-paper-600/60" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Baris 2: Python, Java, MySQL, PostgreSQL, Figma, Jupyter */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-7 md:gap-8">
                  {TECH_ROW_2.map((tech) => (
                    <div
                      key={tech.name}
                      className="relative group flex items-center justify-center cursor-pointer"
                      aria-label={tech.name}
                    >
                      {/* Logo with Smooth Float/Lift Animation */}
                      <div className="transition-all duration-300 ease-out group-hover:scale-115 group-hover:-translate-y-1.5 filter group-hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
                        {tech.icon}
                      </div>

                      {/* Smooth Animated Tooltip Name */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-paper-950/95 dark:bg-paper-800/95 text-white dark:text-paper-100 text-[11px] font-semibold tracking-wide whitespace-nowrap shadow-xl border border-paper-700/50 dark:border-paper-600/60 pointer-events-none opacity-0 scale-95 translate-y-1.5 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 ease-out z-30">
                        {tech.name}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-paper-950/95 dark:bg-paper-800/95 border-r border-b border-paper-700/50 dark:border-paper-600/60" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
