import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers } from "lucide-react";
import prisma from "@/lib/prisma";
import { extractHeadings, formatDate, calculateReadingTime } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LightboxGallery } from "@/components/lightbox-gallery";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { TableOfContents } from "@/components/table-of-contents";

export const dynamic = "force-dynamic";

interface ProjectDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { categories: true },
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
    include: { categories: true },
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
    include: { categories: true },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const toolsList = project.tools ? project.tools.split(",").map((t) => t.trim()) : [];
  const headings = extractHeadings(project.content || "");

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-5xl mx-auto px-5 sm:px-8">
        {/* Compact Back nav + Live / GitHub Action Links */}
        <div className="pt-24 sm:pt-28 pb-3 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-paper-500 hover:text-accent-500 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Koleksi Karya</span>
          </Link>

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

        {/* Compact Header */}
        <header className="space-y-2.5 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {(project.categories || []).map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-500/10 text-accent-500 border border-accent-500/20"
              >
                <Layers className="w-3 h-3" />
                {cat.name}
              </span>
            ))}
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

          {toolsList.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
              <span className="text-paper-400 font-medium">Alat:</span>
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
        </header>

        {/* Compact Hero Cover Image - Balanced Aspect Ratio */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[380px] sm:max-h-[420px] w-full overflow-hidden rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 shadow-card mb-8">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-top"
          />
        </div>

        {/* Main Content Layout */}
        {headings.length > 0 ? (
          /* Two-Column Layout with TOC Sidebar when headings exist */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Main Reading Column */}
            <article className="lg:col-span-8 min-w-0">
              <div className="lg:hidden mb-5">
                <TableOfContents
                  headings={headings}
                  liveUrl={project.liveUrl}
                  repoUrl={project.repoUrl}
                  variant="mobile"
                />
              </div>

              <MarkdownRenderer content={project.content} />
            </article>

            {/* Sticky Sidebar: Table of Contents / Subbab (Desktop) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-28">
              <TableOfContents
                headings={headings}
                liveUrl={project.liveUrl}
                repoUrl={project.repoUrl}
                variant="desktop"
              />
            </div>
          </div>
        ) : (
          /* Focused Full-Width Reading Layout when there are no headings */
          <article className="w-full min-w-0">
            <MarkdownRenderer content={project.content} />
          </article>
        )}

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

        {/* Related Projects Section - Sleek Compact Layout */}
        {relatedProjects.length > 0 && (
          <section className="pt-8 pb-14 border-t border-paper-200/80 dark:border-paper-800/80 mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent-500 font-semibold block mb-0.5">
                  Eksplorasi Lain
                </span>
                <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-paper-950 dark:text-paper-50">
                  Karya Terkait Lainnya
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-xs font-semibold text-paper-500 hover:text-accent-500 transition-colors flex items-center gap-1 group"
              >
                <span>Lihat semua karya</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedProjects.map((p) => {
                const categoryName = p.categories?.[0]?.name || "Proyek";
                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg hover:border-accent-500/40 hover:bg-paper-50/60 dark:hover:bg-paper-900/40 transition-all duration-200 shadow-xs"
                  >
                    {/* Compact Mini Thumbnail */}
                    <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-paper-100 dark:bg-paper-800 shrink-0 border border-paper-200/60 dark:border-paper-700/60">
                      <Image
                        src={p.cover || "/placeholder-project.jpg"}
                        alt={p.title}
                        fill
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Project Info */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-accent-500 font-semibold block truncate">
                        {categoryName}
                      </span>
                      <h4 className="font-display text-xs sm:text-sm font-bold text-paper-900 dark:text-paper-100 truncate group-hover:text-accent-500 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-paper-500 dark:text-paper-400 line-clamp-1 font-normal leading-normal">
                        {p.summary}
                      </p>
                    </div>

                    {/* Subtle Arrow */}
                    <div className="p-1 rounded-md text-paper-400 group-hover:text-accent-500 group-hover:translate-x-0.5 transition-all shrink-0">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
