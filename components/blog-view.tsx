"use client";

import { useState, useMemo } from "react";
import { PostCard } from "./post-card";
import { Search, BookOpen } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date | string;
  readingTime: string;
  tags?: string;
}

interface BlogViewProps {
  initialPosts: Post[];
  availableTags?: string[];
}

export function BlogView({ initialPosts }: BlogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return initialPosts;
    return initialPosts.filter((post) => {
      const postTags = post.tags ? post.tags.toLowerCase() : "";
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        postTags.includes(q)
      );
    });
  }, [initialPosts, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-paper-200/80 dark:border-paper-800/80">
        <p className="text-sm font-medium text-paper-600 dark:text-paper-400">
          Menampilkan <span className="font-semibold text-paper-900 dark:text-paper-100">{filteredPosts.length}</span> artikel
        </p>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paper-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-paper-200 dark:border-paper-800 bg-white dark:bg-paper-900/60 text-paper-900 dark:text-paper-100 placeholder:text-paper-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid Articles */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-paper-300 dark:border-paper-800 bg-paper-50/50 dark:bg-paper-900/20 space-y-3">
          <div className="w-12 h-12 rounded-full bg-paper-100 dark:bg-paper-800 flex items-center justify-center mx-auto text-paper-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-paper-900 dark:text-paper-100">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-sm text-paper-500 max-w-sm mx-auto">
            Coba gunakan kata kunci pencarian yang lain.
          </p>
        </div>
      )}
    </div>
  );
}
