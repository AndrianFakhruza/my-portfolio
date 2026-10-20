"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Sparkles, Github, Globe, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

function formatExternalUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover: string;
    tools?: string;
    gallery?: string; // JSON string of [{url, caption}]
    liveUrl?: string | null;
    repoUrl?: string | null;
    projectType?: string; // "default" | "gallery"
    category?: {
      name: string;
      slug: string;
    };
    categories?: {
      name: string;
      slug: string;
    }[];
    featured?: boolean;
  };
  layout?: "asymmetric" | "standard" | "compact";
  index?: number;
}

// Lightbox component untuk card gallery
function GalleryLightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: { url: string; caption: string }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prev = () => setCurrentIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setCurrentIndex((i) => (i + 1) % items.length);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Tutup lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {items.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-mono bg-black/40 px-3 py-1 rounded-full">
          {currentIndex + 1} / {items.length}
        </div>
      )}

      {/* Image */}
      <div className="relative max-w-5xl max-h-[85vh] w-full h-full mx-4 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={items[currentIndex].url}
            alt={items[currentIndex].caption || `Gambar ${currentIndex + 1}`}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-contain"
            priority
          />
        </div>
        {items[currentIndex].caption && (
          <div className="absolute bottom-0 left-0 right-0 text-center text-white/80 text-xs font-mono py-2 bg-gradient-to-t from-black/60 to-transparent">
            {items[currentIndex].caption}
          </div>
        )}
      </div>

      {/* Navigation */}
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Gambar berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}

export function ProjectCard({ project, layout = "standard", index = 0 }: ProjectCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const toolsList = project.tools ? project.tools.split(",").map((t) => t.trim()).slice(0, 3) : [];
  const categoriesList =
    project.categories && project.categories.length > 0
      ? project.categories
      : project.category
      ? [project.category]
      : [];

  const isGallery = project.projectType === "gallery";

  // Parse gallery JSON
  let galleryItems: { url: string; caption: string }[] = [];
  if (project.gallery) {
    try {
      galleryItems = JSON.parse(project.gallery);
    } catch {
      galleryItems = [];
    }
  }

  // Category display: hanya 1 + badge +N
  const firstCategory = categoriesList[0];
  const extraCategoriesCount = categoriesList.length - 1;

  const repoHref = formatExternalUrl(project.repoUrl);
  const liveHref = formatExternalUrl(project.liveUrl);

  if (layout === "compact") {
    // ---- GALLERY COMPACT CARD ----
    if (isGallery) {
      return (
        <>
          {lightboxIndex !== null && galleryItems.length > 0 && (
            <GalleryLightbox
              items={galleryItems}
              initialIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
          <article
            className="group relative flex flex-col justify-between rounded-xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => galleryItems.length > 0 && setLightboxIndex(0)}
          >
            <div>
              {/* Media Preview Box */}
              <div className="relative block aspect-[16/9] w-full overflow-hidden bg-paper-100 dark:bg-paper-900">
                <Image
                  src={project.cover || "/placeholder-project.jpg"}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Hover overlay untuk gallery */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/90 text-paper-900 shadow-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                {/* Floating Category Pills */}
                {firstCategory && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 max-w-[85%]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                      {firstCategory.name}
                    </span>
                    {extraCategoriesCount > 0 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                        +{extraCategoriesCount}
                      </span>
                    )}
                  </div>
                )}

                {/* Gallery count badge */}
                {galleryItems.length > 1 && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono bg-black/60 backdrop-blur-sm text-white border border-white/15">
                      <Maximize2 className="w-2.5 h-2.5" />
                      {galleryItems.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-3 sm:p-3.5 space-y-1">
                <h3 className="font-display text-sm sm:text-base font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                {project.summary && (
                  <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Compact Footer */}
            <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-0 flex items-center justify-end text-[11px] border-t border-paper-100 dark:border-paper-900/60 mt-1 pt-2.5">
              <span className="inline-flex items-center gap-1 font-semibold text-accent-500">
                <Maximize2 className="w-3 h-3" />
                <span>Lihat Galeri</span>
              </span>
            </div>
          </article>
        </>
      );
    }

    // ---- DEFAULT COMPACT CARD ----
    return (
      <article className="group relative flex flex-col justify-between rounded-xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div>
          {/* Media Preview Box - Compact 16:9 */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-100 dark:bg-paper-900">
            <Link
              href={`/projects/${project.slug}`}
              className="absolute inset-0 block w-full h-full"
              aria-label={project.title}
            >
              <Image
                src={project.cover || "/placeholder-project.jpg"}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
            </Link>

            {/* Floating Category Pills */}
            {firstCategory && (
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 max-w-[70%] pointer-events-none">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                  {firstCategory.name}
                </span>
                {extraCategoriesCount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                    +{extraCategoriesCount}
                  </span>
                )}
              </div>
            )}

            {/* GitHub & Live URL Buttons - top right */}
            {(repoHref || liveHref) && (
              <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                {repoHref && (
                  <a
                    href={repoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-md bg-black/70 hover:bg-accent-500 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                    title="Buka Repositori GitHub"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {liveHref && (
                  <a
                    href={liveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-md bg-black/70 hover:bg-accent-500 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                    title="Buka Live Demo"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Content Body - Compact */}
          <div className="p-3 sm:p-3.5 space-y-1">
            <h3 className="font-display text-sm sm:text-base font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors line-clamp-1">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-0 flex items-center justify-end text-[11px] border-t border-paper-100 dark:border-paper-900/60 mt-1 pt-2.5">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>Detail</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </article>
    );
  }

  // ---- STANDARD LAYOUT ----
  if (isGallery) {
    return (
      <>
        {lightboxIndex !== null && galleryItems.length > 0 && (
          <GalleryLightbox
            items={galleryItems}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
        <article
          className="group relative flex flex-col justify-between rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400 overflow-hidden cursor-pointer"
          onClick={() => galleryItems.length > 0 && setLightboxIndex(0)}
        >
          <div>
            {/* Media Preview Box */}
            <div className="relative block aspect-[4/3] w-full overflow-hidden bg-paper-100 dark:bg-paper-900">
              <Image
                src={project.cover || "/placeholder-project.jpg"}
                alt={project.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />

              {/* Floating Category Pills */}
              {firstCategory && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 max-w-[70%]">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                    {firstCategory.name}
                  </span>
                  {extraCategoriesCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                      +{extraCategoriesCount}
                    </span>
                  )}
                </div>
              )}

              {/* Hover overlay (maximize icon) */}
              <div className="absolute bottom-3 right-3 z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-paper-900 dark:bg-paper-800 dark:text-paper-100 border border-paper-200 dark:border-paper-700 shadow-md">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Gallery count */}
              {galleryItems.length > 1 && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-sm text-white border border-white/15">
                    <Maximize2 className="w-3 h-3" />
                    {galleryItems.length}
                  </span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 space-y-2">
              <h3 className="font-display text-lg font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors line-clamp-1">
                {project.title}
              </h3>
              {project.summary && (
                <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              )}
            </div>
          </div>

          {/* Meta Footer */}
          {toolsList.length > 0 && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex flex-wrap items-center gap-1.5 text-xs border-t border-paper-100 dark:border-paper-900/60 mt-1 pt-3">
              {toolsList.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-paper-100 dark:bg-paper-900 text-paper-500 dark:text-paper-400 border border-paper-200/50 dark:border-paper-800/50"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}
        </article>
      </>
    );
  }

  // ---- DEFAULT STANDARD CARD ----
  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400 overflow-hidden">
      <div>
        {/* Media Preview Box */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-100 dark:bg-paper-900">
          <Link
            href={`/projects/${project.slug}`}
            className="absolute inset-0 block w-full h-full"
            aria-label={project.title}
          >
            <Image
              src={project.cover || "/placeholder-project.jpg"}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />
          </Link>

          {/* Floating Category Pills on top left */}
          {firstCategory && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 max-w-[70%] pointer-events-none">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                {firstCategory.name}
              </span>
              {extraCategoriesCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                  +{extraCategoriesCount}
                </span>
              )}
            </div>
          )}

          {/* GitHub & Live URL Buttons - top right */}
          {(repoHref || liveHref) && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
              {repoHref && (
                <a
                  href={repoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md bg-black/70 hover:bg-accent-500 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                  title="Buka Repositori GitHub"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {liveHref && (
                <a
                  href={liveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-md bg-black/70 hover:bg-accent-500 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
                  title="Buka Live Demo"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Hover Arrow */}
          <div className="absolute bottom-3 right-3 z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-paper-900 dark:bg-paper-800 dark:text-paper-100 border border-paper-200 dark:border-paper-700 shadow-md">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-display text-lg font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors line-clamp-1">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>
          <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Meta Footer */}
      {toolsList.length > 0 && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex flex-wrap items-center gap-1.5 text-xs border-t border-paper-100 dark:border-paper-900/60 mt-1 pt-3">
          {toolsList.map((tool) => (
            <span
              key={tool}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-paper-100 dark:bg-paper-900 text-paper-500 dark:text-paper-400 border border-paper-200/50 dark:border-paper-800/50"
            >
              {tool}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
