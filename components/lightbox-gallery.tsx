"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2, ChevronDown, ChevronUp } from "lucide-react";

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
  const [needsCollapsing, setNeedsCollapsing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isOpen = selectedIndex !== null;

  // Batas tinggi default galeri (misal 650px) sebelum ditekan "lihat lebih banyak"
  const COLLAPSED_HEIGHT = 650;

  useEffect(() => {
    if (containerRef.current) {
      // Cek apakah konten melebihi batas tinggi
      if (containerRef.current.scrollHeight > COLLAPSED_HEIGHT + 80) {
        setNeedsCollapsing(true);
      } else {
        setNeedsCollapsing(false);
      }
    }
  }, [items]);

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

  const showFade = needsCollapsing && !isExpanded;

  return (
    <div className="relative">
      {/* Container dengan batasan tinggi pixel & fade dinamis */}
      <div
        ref={containerRef}
        style={{
          maxHeight: isExpanded || !needsCollapsing ? "none" : `${COLLAPSED_HEIGHT}px`,
        }}
        className={`relative overflow-hidden transition-[max-height] duration-700 ease-in-out`}
      >
        {/* 4 Kolom di desktop (1 col mobile, 2 col tablet, 4 col desktop) */}
        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 sm:gap-5 [column-fill:_balance]">
          {items.map((item, index) => (
            <div key={index} className="break-inside-avoid mb-4 sm:mb-5">
              <figure
                className="group relative cursor-pointer rounded-xl border border-paper-200/90 dark:border-paper-800/90 bg-white dark:bg-[#1f1f23] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setSelectedIndex(index)}
              >
                {/* Natural aspect ratio image with full responsive height */}
                <div className="relative w-full overflow-hidden bg-paper-100 dark:bg-paper-900/50">
                  <Image
                    src={item.url}
                    alt={`Galeri karya ${index + 1}`}
                    width={1000}
                    height={1400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 4}
                  />

                  {/* Hover Overlay preview icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center pointer-events-none">
                    <span className="p-2.5 rounded-full bg-white/95 dark:bg-paper-900/95 text-paper-900 dark:text-paper-100 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 duration-200 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </figure>
            </div>
          ))}
        </div>

        {/* Gradien Fade di batas bawah ketika dicutkan */}
        {showFade && (
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-paper-50 via-paper-50/85 to-transparent dark:from-[#18181B] dark:via-[#18181B]/85 dark:to-transparent pointer-events-none" />
        )}
      </div>

      {/* Tombol Lihat Lebih Banyak / Ciutkan */}
      {needsCollapsing && (
        <div className="flex justify-center -mt-6 relative z-10 pt-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-paper-900 dark:bg-white text-white dark:text-paper-900 hover:bg-accent-500 dark:hover:bg-accent-400 dark:hover:text-black font-semibold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Ciutkan galeri</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Lihat lebih banyak ({items.length} Gambar)</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </>
            )}
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

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[85vh] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={items[selectedIndex].url}
                alt={`Pratinjau galeri ${selectedIndex + 1}`}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
