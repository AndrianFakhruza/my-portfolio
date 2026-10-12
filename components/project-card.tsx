"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover: string;
    role?: string;
    tools?: string;
    category?: {
      name: string;
      slug: string;
    };
    featured?: boolean;
  };
  layout?: "asymmetric" | "standard" | "compact";
  index?: number;
}

export function ProjectCard({ project, layout = "standard", index = 0 }: ProjectCardProps) {
  const toolsList = project.tools ? project.tools.split(",").map((t) => t.trim()).slice(0, 3) : [];

  if (layout === "compact") {
    return (
      <article className="group relative flex flex-col justify-between rounded-xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        <div>
          {/* Media Preview Box - Compact 16:9 */}
          <Link
            href={`/projects/${project.slug}`}
            className="relative block aspect-[16/9] w-full overflow-hidden bg-paper-100 dark:bg-paper-900"
          >
            <Image
              src={project.cover || "/placeholder-project.jpg"}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

            {/* Floating Category Pill */}
            {project.category && (
              <div className="absolute top-2 left-2 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                  {project.category.name}
                </span>
              </div>
            )}
          </Link>

          {/* Content Body - Compact */}
          <div className="p-3 sm:p-3.5 space-y-1">
            <h3 className="font-display text-sm sm:text-base font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors line-clamp-1">
              <Link href={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
            <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 leading-relaxed">
              {project.summary}
            </p>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-0 flex items-center justify-between text-[11px] border-t border-paper-100 dark:border-paper-900/60 mt-1 pt-2.5">
          <span className="text-paper-400 truncate max-w-[130px]">
            {project.role || "Product Designer"}
          </span>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-accent-500 hover:text-accent-600 transition-colors"
          >
            <span>Detail</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-400 overflow-hidden">
      <div>
        {/* Media Preview Box */}
        <Link
          href={`/projects/${project.slug}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-paper-100 dark:bg-paper-900"
        >
          <Image
            src={project.cover || "/placeholder-project.jpg"}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300" />

          {/* Floating Category Pill on top left */}
          {project.category && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-black/60 backdrop-blur-md text-white border border-white/15 shadow-sm">
                {project.category.name}
              </span>
            </div>
          )}

          {/* Floating Featured Badge */}
          {project.featured && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#F59E0B] text-[#18181B] shadow-md shadow-amber-500/25">
                <Sparkles className="w-2.5 h-2.5" />
                Unggulan
              </span>
            </div>
          )}

          {/* Hover Arrow */}
          <div className="absolute bottom-3 right-3 z-10 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-paper-900 dark:bg-paper-800 dark:text-paper-100 border border-paper-200 dark:border-paper-700 shadow-md">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-display text-lg font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors line-clamp-1">
            <Link href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          </h3>
          <p className="text-xs text-paper-500 dark:text-paper-400 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>
      </div>

      {/* Meta Footer */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-paper-100 dark:border-paper-900/60 mt-1 pt-3">
        <span className="text-[11px] font-medium text-paper-500 dark:text-paper-400 truncate max-w-[120px]">
          {project.role || "Product Designer"}
        </span>

        {toolsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {toolsList.map((tool) => (
              <span
                key={tool}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-paper-100 dark:bg-paper-900 text-paper-500 dark:text-paper-400 border border-paper-200/50 dark:border-paper-800/50"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
