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
    <div className="space-y-8">
      {/* ── Filters & Search Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-paper-200/80 dark:border-paper-800/80">
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer",
              selectedCategory === "all"
                ? "bg-paper-900 text-white dark:bg-white dark:text-paper-950 border-transparent shadow-sm"
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
                    ? "bg-[#F59E0B] text-[#18181B] font-bold border-transparent shadow-md shadow-amber-500/20"
                    : "bg-white dark:bg-paper-900/60 text-paper-600 dark:text-paper-400 border-paper-200 dark:border-paper-800 hover:border-[#F59E0B] hover:text-[#F59E0B]"
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Right Column: Tab Switcher (Top) + Search Bar (Bottom) */}
        <div className="flex flex-col items-stretch md:items-end gap-2.5 shrink-0 w-full md:w-auto">
          {/* ── 2 Menu / Tabs Utama: Proyek Web & Karya Desain ── */}
          <div className="inline-flex items-center p-1 rounded-xl bg-paper-100 dark:bg-paper-900 border border-paper-200/80 dark:border-paper-800/80 shadow-xs self-start md:self-end">
            <button
              type="button"
              onClick={() => {
                setActiveTab("web");
                setSelectedCategory("all");
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                activeTab === "web"
                  ? "bg-white dark:bg-paper-950 text-paper-950 dark:text-paper-50 shadow-xs font-bold border border-paper-200/60 dark:border-paper-800/60"
                  : "text-paper-600 dark:text-paper-400 hover:text-paper-950 dark:hover:text-white"
              )}
            >
              <Globe className={cn("w-3.5 h-3.5", activeTab === "web" ? "text-accent-500" : "")} />
              <span>Proyek Website</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold transition-colors",
                  activeTab === "web"
                    ? "bg-paper-100 dark:bg-paper-800 text-paper-900 dark:text-paper-100"
                    : "bg-paper-200/60 dark:bg-paper-800/60 text-paper-500"
                )}
              >
                {webProjects.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("design");
                setSelectedCategory("all");
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                activeTab === "design"
                  ? "bg-[#F59E0B] text-[#18181B] font-bold shadow-xs"
                  : "text-paper-600 dark:text-paper-400 hover:text-paper-950 dark:hover:text-white"
              )}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Karya Desain</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold transition-colors",
                  activeTab === "design"
                    ? "bg-black/15 text-[#18181B]"
                    : "bg-paper-200/60 dark:bg-paper-800/60 text-paper-500"
                )}
              >
                {designProjects.length}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === "web"
                  ? "Cari website atau teknologi..."
                  : "Cari karya desain..."
              }
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-sm"
            />
          </div>
        </div>
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
          /* Design Projects: Pinterest-Style Natural Aspect-Ratio Masonry */
          <DesignGalleryMasonry projects={filteredProjects} />
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
