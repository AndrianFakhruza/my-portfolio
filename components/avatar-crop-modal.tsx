"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  Move,
  Loader2,
} from "lucide-react";

interface AvatarCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onConfirm: (croppedBlob: Blob, previewUrl: string) => Promise<void> | void;
}

export function AvatarCropModal({
  isOpen,
  imageSrc,
  onClose,
  onConfirm,
}: AvatarCropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // in degrees: 0, 90, 180, 270
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset state when modal opens or imageSrc changes
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageRef.current = img;
        setImageLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Handle Drag / Pan with Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Drag / Pan with Touch (Mobile / Tablet)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.4), 4));
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Export cropped circle image to high-res PNG Blob
  const handleApplyCrop = async () => {
    if (!imageRef.current) return;
    setSaving(true);

    try {
      const img = imageRef.current;
      const outputSize = 640; // 640x640 high-res output
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Gagal menginisialisasi canvas.");

      // Visual box size in UI modal is 280x280 px
      const previewSize = 280;
      const scaleFactor = outputSize / previewSize;

      // Enable smooth image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Circular clip mask
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      // Clear with transparent
      ctx.clearRect(0, 0, outputSize, outputSize);

      // Translate to canvas center
      ctx.save();
      ctx.translate(outputSize / 2, outputSize / 2);

      // Apply pan position scaled to output
      ctx.translate(position.x * scaleFactor, position.y * scaleFactor);

      // Apply rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Scale (zoom)
      ctx.scale(zoom, zoom);

      // Draw original image centered
      // We calculate a base fitted size so zoom=1 fits comfortably in previewSize
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawWidth = outputSize;
      let drawHeight = outputSize;

      if (imgAspect > 1) {
        drawHeight = outputSize;
        drawWidth = outputSize * imgAspect;
      } else {
        drawWidth = outputSize;
        drawHeight = outputSize / imgAspect;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      // Convert canvas to transparent PNG Blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/png", 1.0);
      });

      if (!blob) throw new Error("Gagal memproses gambar.");

      const previewUrl = URL.createObjectURL(blob);
      await onConfirm(blob, previewUrl);
      onClose();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat memotong foto.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#18181B] rounded-3xl border border-paper-200 dark:border-paper-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-paper-200 dark:border-paper-800">
          <div>
            <h3 className="font-display text-base font-bold text-paper-950 dark:text-paper-50 flex items-center gap-2">
              <Move className="w-4 h-4 text-[#F59E0B]" />
              Sesuaikan Foto Profil
            </h3>
            <p className="text-xs text-paper-500 dark:text-paper-400 mt-0.5">
              Geser untuk posisi, gunakan slider untuk zoom
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-xl text-paper-400 hover:text-paper-900 dark:hover:text-paper-100 hover:bg-paper-100 dark:hover:bg-paper-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Interactive Crop Area */}
        <div className="p-6 flex flex-col items-center">
          {/* Viewport Box (280x280) */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className={`relative w-[280px] h-[280px] rounded-2xl overflow-hidden cursor-move border border-paper-200/80 dark:border-paper-800/80 shadow-inner ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e4e4e7 25%, transparent 25%),
                linear-gradient(-45deg, #e4e4e7 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e4e4e7 75%),
                linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)
              `,
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            }}
          >
            {/* Dark Checkerboard tint for dark mode */}
            <div className="absolute inset-0 bg-paper-100/60 dark:bg-[#18181B]/80 pointer-events-none" />

            {/* The Image being transformed */}
            {imageLoaded && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? "none" : "transform 0.05s ease-out",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Crop Preview"
                  draggable={false}
                  className="max-w-none select-none"
                  style={{
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: "center center",
                    width: "280px",
                    height: "auto",
                  }}
                />
              </div>
            )}

            {/* Circular Mask Overlay: Dark outside, Transparent inside */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
                borderRadius: "50%",
                width: "240px",
                height: "240px",
                top: "20px",
                left: "20px",
                border: "2px solid #F59E0B",
              }}
            />

            {/* Grid Guideline in circle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[240px] h-[240px] rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-full h-[1px] bg-white/20" />
                <div className="h-full w-[1px] bg-white/20 absolute" />
              </div>
            </div>

            {/* Hint overlay */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
                Tahan &amp; Geser Foto
              </span>
            </div>
          </div>

          {/* Controls: Zoom, Rotate, Reset */}
          <div className="w-full mt-6 space-y-4">
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-paper-600 dark:text-paper-300">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Perbesar / Perkecil (Zoom)
                </span>
                <span className="font-mono text-paper-500">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(Number((z - 0.1).toFixed(2)), 0.4))}
                  className="p-1.5 rounded-lg border border-paper-200 dark:border-paper-700 hover:bg-paper-100 dark:hover:bg-paper-800 text-paper-600 dark:text-paper-300 transition-colors"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.4"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#F59E0B] cursor-pointer h-1.5 bg-paper-200 dark:bg-paper-700 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(Number((z + 0.1).toFixed(2)), 3.5))}
                  className="p-1.5 rounded-lg border border-paper-200 dark:border-paper-700 hover:bg-paper-100 dark:hover:bg-paper-800 text-paper-600 dark:text-paper-300 transition-colors"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center justify-center gap-2 pt-1 border-t border-paper-100 dark:border-paper-800/80">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-paper-200 dark:border-paper-700 hover:bg-paper-100 dark:hover:bg-paper-800 text-xs font-medium text-paper-700 dark:text-paper-300 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Putar 90°</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-paper-200 dark:border-paper-700 hover:bg-paper-100 dark:hover:bg-paper-800 text-xs font-medium text-paper-700 dark:text-paper-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-paper-400" />
                <span>Reset Posisi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-paper-50 dark:bg-paper-900/40 border-t border-paper-200 dark:border-paper-800">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-paper-600 dark:text-paper-400 hover:bg-paper-200/50 dark:hover:bg-paper-800 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            disabled={saving || !imageLoaded}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#18181B] shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses Foto...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Terapkan &amp; Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

