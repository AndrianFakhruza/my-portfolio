"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "./project-card";
import { Search, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover: string;
  featured: boolean;
  category?: Category | null;
  tools?: string;
  role?: string;
}

interface ProjectsViewProps {
  initialProjects: any[];
  categories: Category[];
}

export function ProjectsView({ initialProjects, categories }: ProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" ||
        project.category?.slug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        project.category?.name?.toLowerCase().includes(q) ||
        (project.tools && project.tools.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-paper-200/80 dark:border-paper-800/80">
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
              selectedCategory === "all"
                ? "bg-paper-900 text-white dark:bg-white dark:text-paper-950 border-transparent shadow-sm"
                : "bg-white dark:bg-paper-900/60 text-paper-600 dark:text-paper-400 border-paper-200 dark:border-paper-800 hover:border-paper-400 dark:hover:border-paper-600 hover:text-paper-900 dark:hover:text-white"
            )}
          >
            Semua ({initialProjects.length})
          </button>
          {categories.map((cat) => {
            const count = initialProjects.filter((p) => p.category?.slug === cat.slug).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border",
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

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari karya atau teknologi..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-white dark:bg-paper-900/60 border border-paper-200 dark:border-paper-800 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/10 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
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
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-paper-300 dark:border-paper-800 bg-paper-50/50 dark:bg-paper-900/20 space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-100 dark:bg-paper-800 flex items-center justify-center mx-auto text-paper-400">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-paper-900 dark:text-paper-100">
            Tidak ada proyek yang sesuai
          </h3>
          <p className="text-sm text-paper-500 max-w-sm mx-auto">
            Coba ubah filter kategori atau bersihkan kolom pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
