import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang Andrian Fakhruza",
  description:
    "Profil profesional Andrian Fakhruza, lulusan Teknik Informatika Politeknik Negeri Lhokseumawe dengan fokus pada Web Development dan UI Design.",
};

export default async function AboutPage() {
  const [profile, experiences, capabilities] = await Promise.all([
    prisma.aboutProfile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.capability.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-24 sm:pt-28 pb-12 sm:pb-16">
        {/* Ambient Hero */}
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-accent-500/8 dark:bg-accent-500/12 blur-[100px] rounded-full pointer-events-none -z-10" />

          {/* Header & Intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pb-12 sm:pb-16 border-b border-paper-200/80 dark:border-paper-800/80">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-[1.1]">
                {profile?.name ?? "Andrian Fakhruza"}
              </h1>

              <p className="text-lg text-paper-700 dark:text-paper-200 leading-relaxed font-normal">
                {profile?.bio1 ?? "Saya merupakan lulusan Teknik Informatika dari Politeknik Negeri Lhokseumawe dengan ketertarikan dan pengalaman di bidang teknologi, khususnya Web Development dan UI Design."}
              </p>

              {profile?.bio2 && (
                <p className="text-base text-paper-600 dark:text-paper-400 leading-relaxed">
                  {profile.bio2}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                {profile?.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    download="CV-Andrian-Fakhruza.pdf"
                    className="btn-modern-primary"
                  >
                    <Download className="w-4 h-4" />
                    Unduh Curriculum Vitae
                  </a>
                )}
                <Link href="/contact" className="btn-modern-secondary">
                  <span>Hubungi Saya</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 shadow-card">
                <Image
                  src="/profile.jpg"
                  alt={`${profile?.name ?? "Andrian Fakhruza"} - Web Developer & UI Designer`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                {/* Floating location badge */}
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <div className="px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-paper-950/90 backdrop-blur-md border border-paper-200/50 dark:border-paper-800 shadow-lg flex items-center justify-center text-center">
                    <span className="text-xs font-semibold text-paper-800 dark:text-paper-200">
                      {profile?.location ?? "Lhokseumawe, Aceh"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Timeline */}
          {experiences.length > 0 && (
            <section className="py-12 sm:py-16 border-b border-paper-200/80 dark:border-paper-800/80">
              <div className="max-w-2xl space-y-3 mb-8">
                <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                  Pengalaman Profesional
                </h2>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="group p-6 sm:p-7 rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-paper-950 dark:text-paper-50">
                          {exp.role}
                        </h3>
                        <p className="text-sm font-semibold text-accent-500 mt-0.5">{exp.company}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-paper-100 dark:bg-paper-900 text-paper-600 dark:text-paper-400 border border-paper-200 dark:border-paper-800 shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-paper-600 dark:text-paper-400 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Matrix — Bento Cards */}
          {capabilities.length > 0 && (
            <section className="py-12 sm:py-16">
              <div className="max-w-2xl space-y-3 mb-8">
                <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                  Kapabilitas &amp; Penguasaan Alat
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {capabilities.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-6 sm:p-7 rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft hover:shadow-card transition-all space-y-4"
                  >
                    <h3 className="font-display text-base sm:text-lg font-bold text-paper-950 dark:text-paper-50 pb-3 border-b border-paper-100 dark:border-paper-900">
                      {cap.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {cap.skills.split("\n").filter(Boolean).map((skill, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2.5 text-sm text-paper-700 dark:text-paper-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
