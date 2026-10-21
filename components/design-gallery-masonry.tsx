"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface DesignProjectItem {
  id: string;
  title?: string;
  slug?: string;
  cover?: string;
  gallery?: string; // JSON string of [{url, caption}]
  category?: Category | null;
  categories?: Category[];
  status?: string;
  createdAt?: string | Date;
}

interface DesignGalleryMasonryProps {
  projects: DesignProjectItem[];
  emptyMessage?: string;
  collapsible?: boolean;
  columns?: 4 | 5 | 6;
}

export function DesignGalleryMasonry({
  projects,
  emptyMessage = "Belum ada karya desain yang diunggah.",
  collapsible = false,
  columns = 5,
}: DesignGalleryMasonryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Lightbox state
  const [activeItem, setActiveItem] = useState<{
    images: { url: string; caption?: string }[];
    index: number;
  } | null>(null);

  const handleOpenImage = (imageUrl: string, title?: string) => {
    setActiveItem({
      images: [{ url: imageUrl, caption: title }],
      index: 0,
    });
  };

  const handleCloseLightbox = useCallback(() => {
    setActiveItem(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (!activeItem) return;
    setActiveItem((prev) => {
      if (!prev) return null;
      const nextIndex = prev.index > 0 ? prev.index - 1 : prev.images.length - 1;
      return { ...prev, index: nextIndex };
    });
  }, [activeItem]);

  const handleNext = useCallback(() => {
    if (!activeItem) return;
    setActiveItem((prev) => {
      if (!prev) return null;
      const nextIndex = prev.index < prev.images.length - 1 ? prev.index + 1 : 0;
      return { ...prev, index: nextIndex };
    });
  }, [activeItem]);

  // Flat list of design cards: jika ada multiple images dalam 1 data, otomatis pecah menjadi card mandiri
  const designCards = useMemo(() => {
    const list: Array<{
      key: string;
      imageUrl: string;
      title: string;
      category?: any;
    }> = [];

    projects.forEach((project) => {
      let parsedGallery: { url: string; caption?: string }[] = [];
      if (project.gallery) {
        try {
          const p = JSON.parse(project.gallery);
          if (Array.isArray(p)) parsedGallery = p;
        } catch {
          parsedGallery = [];
        }
      }

      const categoriesList =
        project.categories && project.categories.length > 0
          ? project.categories
          : project.category
          ? [project.category]
          : [];
      const firstCat = categoriesList[0];

      if (parsedGallery.length > 1) {
        parsedGallery.forEach((img, idx) => {
          list.push({
            key: `${project.id}-${idx}`,
            imageUrl: img.url,
            title: project.title ? `${project.title} (${idx + 1})` : "Karya Desain",
            category: firstCat,
          });
        });
      } else {
        const displayImage =
          project.cover ||
          (parsedGallery.length > 0 ? parsedGallery[0].url : "/placeholder-project.jpg");
        list.push({
          key: project.id,
          imageUrl: displayImage,
          title: project.title || "Karya Desain",
          category: firstCat,
        });
      }
    });

    return list;
  }, [projects]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [activeItem, handleCloseLightbox, handlePrev, handleNext]);

  if (!projects || projects.length === 0 || designCards.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-paper-300 dark:border-paper-800 bg-paper-50/50 dark:bg-paper-900/20 space-y-2">
        <p className="text-sm text-paper-500 dark:text-paper-400 font-medium">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const shouldCollapse = collapsible && !isExpanded && designCards.length > 5;

  const columnClass = {
    4: "columns-2 sm:columns-3 md:columns-4 lg:columns-4 xl:columns-4",
    5: "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-5",
    6: "columns-2 sm:columns-3 md:columns-4 lg:columns-6 xl:columns-6",
  }[columns];

  return (
    <>
      {/* ── Masonry Container (Collapsible dengan Fade & Kolom Dinamis) ── */}
      <div
        ref={containerRef}
        className={cn(
          "relative transition-all duration-700 ease-in-out",
          shouldCollapse ? "max-h-[580px] sm:max-h-[640px] overflow-hidden" : ""
        )}
      >
        {/* ── Pinterest-Style Columns Masonry ── */}
        <div className={cn(columnClass, "gap-3.5 sm:gap-4 space-y-3.5 sm:space-y-4 [column-fill:_balance]")}>
          {designCards.map((card) => {
            return (
              <div
                key={card.key}
                onClick={() => handleOpenImage(card.imageUrl, card.title)}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-paper-100 dark:bg-paper-900 border border-paper-200/80 dark:border-paper-800/80 shadow-soft hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Natural Responsive Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-auto block object-cover group-hover:scale-[1.025] transition-transform duration-500 rounded-2xl"
                  loading="lazy"
                />

                {/* Subtle Ambient Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                {/* Floating Category Pill (Top-Left) */}
                {card.category && (
                  <div className="absolute top-3 left-3 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
                      {card.category.name}
                    </span>
                  </div>
                )}

                {/* Center Maximize Icon (Hover) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <span className="w-10 h-10 rounded-full bg-white/95 dark:bg-paper-900/95 text-paper-950 dark:text-paper-50 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-200">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Batasan Fade Gradient Bawah & Tombol Panah "Lihat Lainnya" ── */}
        {shouldCollapse && (
          <div className="absolute inset-x-0 bottom-0 h-48 sm:h-56 bg-gradient-to-t from-paper-50 dark:from-paper-950 via-paper-50/90 dark:via-paper-950/90 to-transparent flex flex-col items-center justify-end pb-4 z-20 pointer-events-none">
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="pointer-events-auto group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-paper-900 hover:bg-black dark:bg-white dark:hover:bg-paper-100 text-white dark:text-paper-950 text-xs font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Lihat Lainnya</span>
              <span className="w-6 h-6 rounded-full bg-white/15 dark:bg-black/10 flex items-center justify-center transition-transform group-hover:translate-y-0.5">
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        )}
      </div>

      {/* ── Tombol Tampilkan Lebih Sedikit (Saat Expanded) ── */}
      {collapsible && isExpanded && designCards.length > 5 && (
        <div className="flex justify-center pt-8 pb-4">
          <button
            type="button"
            onClick={() => {
              setIsExpanded(false);
              containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-paper-200 dark:border-paper-800 bg-white/80 dark:bg-paper-900/80 hover:bg-paper-100 dark:hover:bg-paper-800 text-paper-700 dark:text-paper-300 text-xs font-medium shadow-sm hover:border-accent-500 hover:text-accent-500 transition-all cursor-pointer"
          >
            <span>Tampilkan Lebih Sedikit</span>
            <ChevronUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      )}

      {/* ── Fullscreen Lightbox Modal ── */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md select-none"
          onClick={handleCloseLightbox}
        >
          {/* Top Bar with Counter & Close */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto">
              {activeItem.images.length > 1 && (
                <span className="text-xs font-mono font-bold text-white/80 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                  {activeItem.index + 1} / {activeItem.images.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleCloseLightbox}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
              aria-label="Tutup pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prev Navigation */}
          {activeItem.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-50 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Navigation */}
          {activeItem.images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-50 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              aria-label="Foto berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Main Display Image */}
          <div
            className="relative max-w-6xl max-h-[88vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.images[activeItem.index].url}
              alt={`Karya desain ${activeItem.index + 1}`}
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all"
            />
            {activeItem.images[activeItem.index].caption && (
              <p className="mt-3 text-xs sm:text-sm font-medium text-white/80 text-center font-mono max-w-xl">
                {activeItem.images[activeItem.index].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

