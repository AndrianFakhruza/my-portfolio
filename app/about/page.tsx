import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ArrowUpRight,
  CheckCircle2,
  Users2,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang Andrian Fakhruza",
  description:
    "Profil profesional dan rekam akademis Andrian Fakhruza — Sarjana Terapan Teknik Informatika Politeknik Negeri Lhokseumawe dengan keahlian Web Development, UI/UX Design, dan Data Science.",
};

export default async function AboutPage() {
  const [profile, experiences, capabilities, educations, organizations] = await Promise.all([
    prisma.aboutProfile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.capability.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.organization.findMany({ orderBy: { order: "asc" } }),
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

  const displayOrganizations =
    organizations.length > 0
      ? organizations
      : [
          {
            id: "org-1",
            role: "Ketua Bagian Perlengkapan dan Dekorasi",
            organization: "Pormatik (Pekan Olahraga & Seni Mahasiswa Informatika)",
            period: "2023",
            description:
              "• Merencanakan dan mengatur segala kebutuhan perlengkapan dan dekorasi untuk acara, termasuk pemilihan tema dan pengadaan peralatan.\n• Mengelola anggaran yang dialokasikan untuk perlengkapan dan dekorasi.\n• Memimpin dan mengkoordinasi tim dalam persiapan dan pelaksanaan dekorasi serta perlengkapan acara.",
          },
          {
            id: "org-2",
            role: "Ketua Palang Merah Remaja",
            organization: "SMA Negeri Modal Bangsa Arun",
            period: "2021 – 2022",
            description:
              "• Memimpin dan mengelola organisasi PMR, termasuk pembagian tugas dan pelatihan anggota.\n• Mengawasi pelaksanaan kegiatan dan memberikan pertolongan saat diperlukan di berbagai acara sekolah.\n• Menginisiasi latihan bersama dengan sekolah lain untuk bertukar pengalaman dan mempererat hubungan antar sekolah.",
          },
          {
            id: "org-3",
            role: "Anggota Divisi DigiHub",
            organization: "Komunitas Mahasiswa IT (Komit) PNL",
            period: "2024 – Sekarang",
            description:
              "• Bertanggung jawab dalam menyusun caption kreatif dan informatif untuk setiap konten yang dipublikasikan di media sosial komunitas.\n• Aktif terlibat dalam seluruh kegiatan Komit, baik sebagai peserta maupun tim pelaksana.",
          },
        ];

  const defaultHardSkills = [
    "Python",
    "Figma",
    "Editing Video",
    "Content Creation",
    "Microsoft Office",
    "Next.js & React",
    "TypeScript & JavaScript",
    "Tailwind CSS",
  ];

  const defaultSoftSkills = [
    "Manajemen Waktu",
    "Kemampuan Berkomunikasi",
    "Disiplin dan Bertanggung Jawab",
    "Kemampuan Berkolaborasi",
    "Kemampuan Berorganisasi",
    "Problem Solving",
  ];

  // Separate capabilities into hard and soft if available
  const hardCap = capabilities.find(
    (c) =>
      c.title.toLowerCase().includes("hard") ||
      c.title.toLowerCase().includes("alat") ||
      c.title.toLowerCase().includes("teknis")
  );
  const softCap = capabilities.find(
    (c) =>
      c.title.toLowerCase().includes("soft") ||
      c.title.toLowerCase().includes("kolaborasi")
  );

  const hardSkillsList = hardCap
    ? hardCap.skills.split("\n").map((s) => s.trim()).filter(Boolean)
    : defaultHardSkills;

  const softSkillsList = softCap
    ? softCap.skills.split("\n").map((s) => s.trim()).filter(Boolean)
    : defaultSoftSkills;

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-20 sm:pt-24 pb-12 sm:pb-16">
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

          {/* ─── TWO COLUMN: ACADEMIC PATH (Kiri) & KETERAMPILAN (Kanan) ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* ── KOLOM KIRI: ACADEMIC PATH (TIMELINE STYLE) ── */}
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

            {/* ── KOLOM KANAN: KETERAMPILAN (HARD & SOFT SKILLS) ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Title with Line */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-widest uppercase text-paper-400 dark:text-paper-500 font-mono">
                  KETERAMPILAN
                </span>
                <span className="h-[1.5px] w-12 bg-paper-300 dark:bg-paper-700 inline-block" />
              </div>

              <div className="space-y-6">
                {/* 1. Hard Skills & Alat Teknis */}
                <div className="p-5 sm:p-6 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-white dark:bg-[#18181B] shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-paper-100 dark:border-paper-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-paper-950 dark:text-paper-50">
                        Hard Skills &amp; Alat Teknis
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-paper-400">
                      {hardSkillsList.length} Skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {hardSkillsList.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-paper-50 dark:bg-paper-900/60 text-paper-800 dark:text-paper-200 border border-paper-200/70 dark:border-paper-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Soft Skills & Kolaborasi */}
                <div className="p-5 sm:p-6 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-white dark:bg-[#18181B] shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between pb-3 border-b border-paper-100 dark:border-paper-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-display text-sm sm:text-base font-bold text-paper-950 dark:text-paper-50">
                        Soft Skills &amp; Kolaborasi
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-paper-400">
                      {softSkillsList.length} Skills
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {softSkillsList.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-paper-50 dark:bg-paper-900/60 text-paper-800 dark:text-paper-200 border border-paper-200/70 dark:border-paper-800 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── PENGALAMAN ORGANISASI ─── */}
          <section className="space-y-6 pt-6 border-t border-paper-200/80 dark:border-paper-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Users2 className="w-4 h-4" />
                  <span>Leadership &amp; Collaboration</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                  Pengalaman Organisasi
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-paper-500 dark:text-paper-400 max-w-md">
                Keterlibatan aktif dalam kepanitiaan, kepemimpinan tim, manajemen acara, dan inisiatif komunitas.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayOrganizations.map((org, idx) => {
                const bulletPoints = org.description
                  ? org.description
                      .split("\n")
                      .map((l) => l.replace(/^•\s*/, "").trim())
                      .filter(Boolean)
                  : [];

                return (
                  <div
                    key={org.id || idx}
                    className="p-5 sm:p-6 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-white dark:bg-[#18181B] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                          {org.period}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-base font-bold text-paper-950 dark:text-paper-50 leading-snug">
                          {org.role}
                        </h3>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                          {org.organization}
                        </p>
                      </div>

                      <ul className="space-y-2 pt-1 border-t border-paper-100 dark:border-paper-800/80">
                        {bulletPoints.map((point, pIdx) => (
                          <li
                            key={pIdx}
                            className="flex items-start gap-2 text-xs text-paper-600 dark:text-paper-400 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ─── PENGALAMAN KERJA / PROYEK (Jika ada) ─── */}
          {experiences.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-paper-200/80 dark:border-paper-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Professional Track</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                    Pengalaman Profesional &amp; Proyek
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 sm:p-6 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-white dark:bg-[#18181B] shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-bold text-paper-950 dark:text-paper-50">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                          {exp.company}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-paper-100 dark:bg-paper-800 text-paper-600 dark:text-paper-400 border border-paper-200 dark:border-paper-700 shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs text-paper-600 dark:text-paper-400 leading-relaxed">
                      {exp.description}
                    </p>
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
