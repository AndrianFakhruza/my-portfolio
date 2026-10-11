import Link from "next/link";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: Date | string;
    readingTime: string;
    tags?: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border border-paper-200/80 dark:border-paper-800/80 bg-card-bg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      <div className="space-y-3.5">
        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-paper-500 font-sans">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper-100 dark:bg-paper-900 border border-paper-200/60 dark:border-paper-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-accent-500" />
            {formatDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-paper-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-paper-400" />
            {post.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-paper-900 dark:text-paper-100 group-hover:text-accent-500 transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2">
            <span>{post.title}</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 text-accent-500" />
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-paper-600 dark:text-paper-400 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
