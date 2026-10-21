"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectCard } from "./project-card";
import { DesignGalleryMasonry } from "./design-gallery-masonry";
import { Search, FolderOpen, Globe, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  type?: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover: string;
  featured: boolean;
  category?: Category | null;
  categories?: Category[];
  tools?: string;
  gallery?: string;
  liveUrl?: string | null;
  repoUrl?: string | null;
  projectType?: string;
}

interface ProjectsViewProps {
  initialProjects: any[];
  categories: Category[];
}

function ProjectsViewContent({ initialProjects, categories }: ProjectsViewProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"web" | "design">(
    tabParam === "design" ? "design" : "web"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab if query param changes
  useEffect(() => {
    if (tabParam === "design" || tabParam === "web") {
      setActiveTab(tabParam);
      setSelectedCategory("all");
    }
  }, [tabParam]);

  // Separate projects by type
  const webProjects = useMemo(
    () => initialProjects.filter((p) => p.projectType !== "gallery"),
    [initialProjects]
  );

  const designProjects = useMemo(
    () => initialProjects.filter((p) => p.projectType === "gallery"),
    [initialProjects]
  );

  const currentList = activeTab === "web" ? webProjects : designProjects;

  // Filtered categories relevant to the active tab
  const relevantCategories = useMemo(() => {
    return categories.filter((cat) => {
      return currentList.some(
        (p) =>
          p.categories?.some((c: any) => c.slug === cat.slug) ||
          p.category?.slug === cat.slug
      );
    });
  }, [categories, currentList]);

  // Filtered items based on category and search query
  const filteredProjects = useMemo(() => {
    return currentList.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (project.categories && project.categories.some((c: any) => c.slug === selectedCategory)) ||
        project.category?.slug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title?.toLowerCase().includes(q) ||
        project.summary?.toLowerCase().includes(q) ||
        project.category?.name?.toLowerCase().includes(q) ||
        (project.categories && project.categories.some((c: any) => c.name?.toLowerCase().includes(q))) ||
        (project.tools && project.tools.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [currentList, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* ── 1. Tab Navigasi Utama: Proyek Website vs Karya Desain (Clean Underlined Tabs) ── */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-paper-200/80 dark:border-paper-800/80">
        <button
          type="button"
          onClick={() => {
            setActiveTab("web");
            setSelectedCategory("all");
          }}
          className={cn(
            "relative pb-3 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer",
            activeTab === "web"
              ? "text-paper-950 dark:text-white font-bold"
              : "text-paper-500 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-200"
          )}
        >
          <Globe className={cn("w-4 h-4 transition-colors", activeTab === "web" ? "text-accent-500" : "text-paper-400")} />
          <span>Proyek Website</span>
          <span
            className={cn(
              "text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold transition-colors",
              activeTab === "web"
                ? "bg-accent-500/10 text-accent-600 dark:text-accent-400 font-bold"
                : "bg-paper-100 dark:bg-paper-800 text-paper-500 dark:text-paper-400"
            )}
          >
            {webProjects.length}
          </span>
          {/* Active Indicator Bar */}
          {activeTab === "web" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500 rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("design");
            setSelectedCategory("all");
            setSearchQuery("");
          }}
          className={cn(
            "relative pb-3 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer",
            activeTab === "design"
              ? "text-paper-950 dark:text-white font-bold"
              : "text-paper-500 dark:text-paper-400 hover:text-paper-900 dark:hover:text-paper-200"
          )}
        >
          <Palette className={cn("w-4 h-4 transition-colors", activeTab === "design" ? "text-amber-500" : "text-paper-400")} />
          <span>Karya Desain</span>
          <span
            className={cn(
              "text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold transition-colors",
              activeTab === "design"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold"
                : "bg-paper-100 dark:bg-paper-800 text-paper-500 dark:text-paper-400"
            )}
          >
            {designProjects.length}
          </span>
          {/* Active Indicator Bar */}
          {activeTab === "design" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
          )}
        </button>
      </div>

      {/* ── 2. Toolbar Kategori (Kiri) & Kolom Pencarian (Kanan) dalam 1 Baris Sejajar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer",
              selectedCategory === "all"
                ? "bg-paper-900 text-white dark:bg-white dark:text-paper-950 border-transparent shadow-xs"
                : "bg-white dark:bg-paper-900/60 text-paper-600 dark:text-paper-400 border-paper-200 dark:border-paper-800 hover:border-paper-400 dark:hover:border-paper-600 hover:text-paper-900 dark:hover:text-white"
            )}
          >
            Semua ({currentList.length})
          </button>
          {relevantCategories.map((cat) => {
            const count = currentList.filter(
              (p) =>
                p.categories?.some((c: any) => c.slug === cat.slug) ||
                p.category?.slug === cat.slug
            ).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer",
                  selectedCategory === cat.slug
                    ? activeTab === "web"
                      ? "bg-accent-500 text-white font-bold border-transparent shadow-xs"
                      : "bg-[#F59E0B] text-[#18181B] font-bold border-transparent shadow-xs"
                    : "bg-white dark:bg-paper-900/60 text-paper-600 dark:text-paper-400 border-paper-200 dark:border-paper-800 hover:border-paper-400 dark:hover:border-paper-600 hover:text-paper-900 dark:hover:text-white"
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input - Hanya Tampil di Menu Proyek Website */}
        {activeTab === "web" && (
          <div className="relative w-full sm:w-64 md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari website atau teknologi..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-xs"
            />
          </div>
        )}
      </div>

      {/* ── Content Display According to Active Tab ── */}
      {filteredProjects.length > 0 ? (
        activeTab === "web" ? (
          /* Web Projects: Structured Card Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                layout="compact"
                index={idx}
              />
            ))}
          </div>
        ) : (
          /* Design Projects: Pinterest-Style Natural Aspect-Ratio Masonry (5 Kolom + Fade Batasan) */
          <DesignGalleryMasonry projects={filteredProjects} collapsible={true} />
        )
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-paper-300 dark:border-paper-800 bg-paper-50/50 dark:bg-paper-900/20 space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-100 dark:bg-paper-800 flex items-center justify-center mx-auto text-paper-400">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-paper-900 dark:text-paper-100">
            Tidak ada {activeTab === "web" ? "proyek website" : "karya desain"} yang sesuai
          </h3>
          <p className="text-sm text-paper-500 max-w-sm mx-auto">
            Coba ubah filter kategori atau bersihkan kolom pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}

export function ProjectsView(props: ProjectsViewProps) {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs font-mono text-paper-400">
          Memuat portofolio karya...
        </div>
      }
    >
      <ProjectsViewContent {...props} />
    </Suspense>
  );
}
