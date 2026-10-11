"use client";

import { useEffect, useState } from "react";
import { ListOrdered, ArrowUp, ExternalLink, Github, ChevronDown } from "lucide-react";
import type { HeadingItem } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: HeadingItem[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  variant?: "all" | "desktop" | "mobile";
}

export function TableOfContents({
  headings,
  liveUrl,
  repoUrl,
  variant = "all",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-90px 0px -65% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setMobileOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!headings.length) return null;

  const showMobile = variant === "all" || variant === "mobile";
  const showDesktop = variant === "all" || variant === "desktop";

  return (
    <>
      {/* Mobile Accordion Bar */}
      {showMobile && (
        <div className={cn("p-3 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft", variant === "all" && "lg:hidden mb-6")}>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-paper-800 dark:text-paper-200"
          >
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-accent-500" />
              <span>Daftar Subbab ({headings.length} bagian)</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-paper-400 transition-transform duration-200",
                mobileOpen && "rotate-180"
              )}
            />
          </button>

          {mobileOpen && (
            <nav className="mt-2.5 pt-2.5 border-t border-paper-100 dark:border-paper-800/60 space-y-1">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <button
                    key={heading.id}
                    type="button"
                    onClick={() => scrollTo(heading.id)}
                    className={cn(
                      "w-full text-left py-1.5 px-2 rounded-lg text-xs transition-colors flex items-center gap-2",
                      heading.level === 3 && "pl-5 text-[11px]",
                      isActive
                        ? "text-accent-500 font-semibold bg-accent-500/10"
                        : "text-paper-600 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-100"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isActive ? "bg-accent-500" : "bg-paper-300 dark:bg-paper-700"
                      )}
                    />
                    <span className="truncate">{heading.text}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      {showDesktop && (
        <aside className={cn("space-y-4", variant === "all" && "hidden lg:block")}>
          <div className="p-4 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft">
            <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-paper-100 dark:border-paper-800/60">
              <ListOrdered className="w-4 h-4 text-accent-500" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-paper-800 dark:text-paper-200">
                Daftar Subbab
              </h3>
            </div>

            <nav className="space-y-0.5 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <button
                    key={heading.id}
                    type="button"
                    onClick={() => scrollTo(heading.id)}
                    className={cn(
                      "w-full text-left py-1.5 px-2 rounded-lg text-xs transition-all flex items-center gap-2 text-balance leading-snug",
                      heading.level === 3 && "pl-5 text-[11px]",
                      isActive
                        ? "text-accent-500 font-bold bg-accent-500/10"
                        : "text-paper-600 dark:text-paper-400 hover:text-paper-950 dark:hover:text-paper-50 hover:bg-paper-100/60 dark:hover:bg-paper-800/40"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0 transition-transform",
                        isActive
                          ? "bg-accent-500 scale-125"
                          : "bg-paper-300 dark:bg-paper-700"
                      )}
                    />
                    <span className="line-clamp-2">{heading.text}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 pt-2.5 border-t border-paper-100 dark:border-paper-800/60 flex items-center justify-between">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-paper-400 hover:text-accent-500 transition-colors"
              >
                <ArrowUp className="w-3 h-3" />
                <span>Kembali ke Atas</span>
              </button>
            </div>
          </div>

          {/* Action Buttons if links available */}
          {(liveUrl || repoUrl) && (
            <div className="p-3.5 rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-paper-400 block px-1">
                Tautan Proyek
              </span>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-accent-500 text-white hover:bg-accent-600 shadow-sm transition-all"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-paper-100 dark:bg-paper-800 text-paper-800 dark:text-paper-200 hover:border-paper-300 border border-paper-200 dark:border-paper-700 transition-all"
                >
                  <span>Repositori Kode</span>
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </aside>
      )}
    </>
  );
}

