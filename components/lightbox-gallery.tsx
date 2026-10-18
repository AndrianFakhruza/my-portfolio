"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown, ChevronUp, Images } from "lucide-react";

interface GalleryItem {
  url: string;
  caption?: string;
}

interface LightboxGalleryProps {
  items: GalleryItem[];
}

export function LightboxGallery({ items }: LightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const isOpen = selectedIndex !== null;

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : items.length - 1));
  }, [selectedIndex, items.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < items.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, items.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleClose, handlePrev, handleNext]);

  if (!items || items.length === 0) return null;

  // Tampilkan max 3 item jika belum di-expand dan item lebih dari 2
  const hasMoreThanTwo = items.length > 2;
  const displayedItems = (!isExpanded && hasMoreThanTwo) ? items.slice(0, 3) : items;
  const remainingCount = items.length - 2;

  return (
    <div className="space-y-4">
      {/* Masonry / Pinterest Style Dynamic Flow Layout */}
      <div className="columns-1 sm:columns-2 gap-4 sm:gap-6 [column-fill:_balance]">
        {displayedItems.map((item, index) => {
          const isThirdFadeItem = !isExpanded && hasMoreThanTwo && index === 2;

          return (
            <div
              key={index}
              className="break-inside-avoid mb-4 sm:mb-6"
            >
              <figure
                className={`group relative cursor-pointer rounded-2xl border border-paper-200/90 dark:border-paper-800/90 bg-white dark:bg-[#1f1f23] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                  isThirdFadeItem ? "max-h-[340px] pointer-events-none sm:pointer-events-auto" : ""
                }`}
                onClick={() => {
                  if (isThirdFadeItem) {
                    setIsExpanded(true);
                  } else {
                    setSelectedIndex(index);
                  }
                }}
              >
                {/* Natural aspect ratio image with full responsive height */}
                <div className="relative w-full overflow-hidden bg-paper-100 dark:bg-paper-900/50">
                  <Image
                    src={item.url}
                    alt={item.caption || `Galeri karya ${index + 1}`}
                    width={1200}
                    height={1600}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={index < 2}
                  />

                  {/* Hover Overlay preview icon */}
                  {!isThirdFadeItem && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
                      <span className="p-2.5 rounded-full bg-white/95 dark:bg-paper-900/95 text-paper-900 dark:text-paper-100 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 duration-200 shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  {/* Gradient Fade & Button Overlay untuk item ke-3 */}
                  {isThirdFadeItem && (
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#18181B] dark:via-[#18181B]/85 dark:to-transparent flex flex-col items-center justify-end p-6 z-10 pointer-events-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(true);
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-accent-500/25 hover:shadow-accent-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                      >
                        <Images className="w-4 h-4" />
                        <span>Lihat Semua ({items.length} Foto)</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Optional Caption under card */}
                {item.caption && !isThirdFadeItem && (
                  <figcaption className="p-3 text-xs font-mono text-paper-600 dark:text-paper-400 border-t border-paper-100 dark:border-paper-800/60 bg-paper-50/50 dark:bg-paper-900/40">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            </div>
          );
        })}
      </div>

      {/* Button Toggle Sembunyikan jika sudah di-expand */}
      {isExpanded && hasMoreThanTwo && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-paper-600 dark:text-paper-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Ciutkan galeri</span>
          </button>
        </div>
      )}

      {/* Lightbox Modal / Popup Fullscreen */}
      {isOpen && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md"
          onClick={handleClose}
        >
          {/* Top toolbar */}
          <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            <span className="text-xs font-mono text-paper-400">
              {selectedIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 text-white hover:text-accent-500 transition-colors bg-white/10 rounded-full cursor-pointer"
              aria-label="Tutup pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Controls */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-accent-500 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 cursor-pointer"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-accent-500 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 cursor-pointer"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image & Caption */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[80vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={items[selectedIndex].url}
                alt={items[selectedIndex].caption || "Pratinjau galeri"}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
            {items[selectedIndex].caption && (
              <p className="mt-4 text-center text-sm font-mono text-paper-300 max-w-2xl px-4">
                {items[selectedIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
