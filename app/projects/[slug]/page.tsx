import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Layers } from "lucide-react";
import prisma from "@/lib/prisma";
import { extractHeadings, formatDate, calculateReadingTime } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/table-of-contents";
import { ProjectCard } from "@/components/project-card";

interface ProjectDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!project) return { title: "Proyek Tidak Ditemukan" };

  return {
    title: `${project.title} · Studi Kasus`,
    description: project.summary,
    openGraph: {
      title: `${project.title} · Studi Kasus Andrian`,
      description: project.summary,
      images: [project.cover],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!project) notFound();

  let galleryItems: { url: string; caption?: string }[] = [];
  try {
    if (project.gallery) galleryItems = JSON.parse(project.gallery);
  } catch {
    galleryItems = [];
  }

  const relatedProjects = await prisma.project.findMany({
    where: { status: "published", id: { not: project.id } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const toolsList = project.tools ? project.tools.split(",").map((t) => t.trim()) : [];
  const headings = extractHeadings(project.content || "");

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 sm:px-8">
        {/* Compact Back nav */}
        <div className="pt-24 sm:pt-28 pb-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-paper-500 hover:text-accent-500 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Koleksi Karya</span>
          </Link>
        </div>

        {/* Compact Header */}
        <header className="space-y-2.5 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {project.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-500/10 text-accent-500 border border-accent-500/20">
                <Layers className="w-3 h-3" />
                {project.category.name}
              </span>
            )}
            {project.createdAt && (
              <span className="text-[11px] text-paper-400 font-medium">
                · {formatDate(project.createdAt)}
              </span>
            )}
            {project.content && (
              <span className="text-[11px] text-paper-400 font-medium">
                · {calculateReadingTime(project.content)} baca
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-paper-950 dark:text-paper-50 leading-snug">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-paper-600 dark:text-paper-300 leading-relaxed font-normal max-w-3xl">
            {project.summary}
          </p>
        </header>

        {/* Compact Quick Spec & Action Bar */}
        <div className="py-2.5 px-4 rounded-xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft flex flex-wrap items-center justify-between gap-3 text-xs mb-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {project.role && (
              <div>
                <span className="text-paper-400 font-medium">Peran: </span>
                <span className="font-semibold text-paper-800 dark:text-paper-200">{project.role}</span>
              </div>
            )}
            {toolsList.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-paper-400 font-medium">Alat: </span>
                {toolsList.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-paper-100 dark:bg-paper-800/80 border border-paper-200/70 dark:border-paper-700/60 text-paper-700 dark:text-paper-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>

          {(project.liveUrl || project.repoUrl) && (
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent-500 text-white hover:bg-accent-600 shadow-sm transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-paper-100 dark:bg-paper-800 border border-paper-200 dark:border-paper-700 text-paper-700 dark:text-paper-300 hover:text-accent-500 transition-colors"
                >
                  <Github className="w-3 h-3" />
                  <span>Kode</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Compact Hero Cover Image */}
        <div className="relative aspect-[21/9] sm:aspect-[2/1] w-full overflow-hidden rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 shadow-card mb-7">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
          />
        </div>

        {/* Main Content (Medium-style Focused Layout with Sticky Subbab TOC) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Reading Column */}
          <article className="lg:col-span-8 min-w-0">
            {/* Mobile TOC Accordion */}
            {headings.length > 0 && (
              <div className="lg:hidden mb-5">
                <TableOfContents
                  headings={headings}
                  liveUrl={project.liveUrl}
                  repoUrl={project.repoUrl}
                  variant="mobile"
                />
              </div>
            )}

            <MarkdownRenderer content={project.content} />
          </article>

          {/* Sticky Sidebar: Table of Contents / Subbab (Desktop) */}
          {headings.length > 0 && (
            <div className="hidden lg:block lg:col-span-4 sticky top-28">
              <TableOfContents
                headings={headings}
                liveUrl={project.liveUrl}
                repoUrl={project.repoUrl}
                variant="desktop"
              />
            </div>
          )}
        </div>

        {/* Gallery Section */}
        {galleryItems.length > 0 && (
          <section className="pt-6 sm:pt-8 pb-3 border-t border-paper-200/80 dark:border-paper-800/80 mt-8">
            <div className="mb-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-500">
                Eksplorasi Visual
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                Galeri Antarmuka &amp; Detail
              </h2>
            </div>
            <LightboxGallery items={galleryItems} />
          </section>
        )}

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="pt-6 sm:pt-8 pb-14 border-t border-paper-200/80 dark:border-paper-800/80 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-paper-950 dark:text-paper-50">
                Karya Terkait Lainnya
              </h2>
              <Link
                href="/projects"
                className="text-xs font-semibold text-accent-500 hover:text-accent-600 transition-colors"
              >
                Lihat semua karya →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} layout="compact" />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
