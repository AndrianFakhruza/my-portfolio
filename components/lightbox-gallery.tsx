"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryItem {
  url: string;
  caption?: string;
}

interface LightboxGalleryProps {
  items: GalleryItem[];
}

export function LightboxGallery({ items }: LightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  return (
    <div>
      {/* Gallery Grid - Compact 3-column */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {items.map((item, index) => (
          <figure
            key={index}
            className="group relative cursor-pointer rounded-xl border border-paper-200/80 dark:border-paper-800/80 bg-paper-100 dark:bg-paper-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setSelectedIndex(index)}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={item.url}
                alt={item.caption || `Galeri item ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                <span className="p-2 rounded-full bg-white/95 dark:bg-paper-900/95 text-paper-900 dark:text-paper-100 opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 duration-200 shadow-sm">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </figure>
        ))}
      </div>

      {/* Lightbox Modal */}
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
              className="p-2 text-white hover:text-accent-500 transition-colors bg-white/10 rounded-full"
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
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-accent-500 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:text-accent-500 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image & Caption */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={items[selectedIndex].url}
                alt={items[selectedIndex].caption || "Pratinjau galeri"}
                fill
                className="object-contain"
                priority
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

