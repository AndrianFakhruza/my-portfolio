import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): HeadingItem[] {
  if (!markdown) return [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: HeadingItem[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const cleanText = rawText
      .replace(/[*_`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();
    const id = slugify(cleanText);
    headings.push({ id, text: cleanText, level });
  }
  return headings;
}

/**
 * Mengurutkan proyek:
 * - Jika ada proyek yang diset nomor urutnya (order > 0, mis. 1, 2, dst), maka akan diprioritaskan di atas
 * - Secara default (order = 0), proyek diurutkan dari yang terbaru (newest first)
 */
export function sortProjects<T extends { order: number; createdAt: Date | string }>(projects: T[]): T[] {
  return [...projects].sort((a, b) => {
    const orderA = a.order > 0 ? a.order : 999999;
    const orderB = b.order > 0 ? b.order : 999999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });
}



