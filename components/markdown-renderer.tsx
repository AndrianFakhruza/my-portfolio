import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-paper-200/80 dark:border-paper-800/80 prose-h2:pb-2.5 prose-h3:text-base sm:prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-p:text-paper-700 dark:text-paper-300 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-p:mb-4 prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1.5 prose-li:text-sm sm:prose-li:text-base prose-li:text-paper-700 dark:prose-li:text-paper-300 prose-blockquote:border-l-4 prose-blockquote:border-accent-500 prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:text-paper-600 dark:prose-blockquote:text-paper-300 prose-code:font-mono prose-code:text-accent-500 prose-code:bg-paper-100 dark:prose-code:bg-paper-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-paper-900 prose-pre:text-paper-100 prose-pre:border prose-pre:border-paper-800 prose-pre:p-3.5 prose-pre:rounded-xl prose-pre:my-4 prose-pre:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children, ...props }) => {
            const rawText = Array.isArray(children)
              ? children.map((c) => (typeof c === "string" ? c : "")).join("")
              : String(children || "");
            const cleanText = rawText.replace(/[*_`]/g, "").trim();
            const id = slugify(cleanText);
            return (
              <h2 id={id} className="scroll-mt-28 group" {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const rawText = Array.isArray(children)
              ? children.map((c) => (typeof c === "string" ? c : "")).join("")
              : String(children || "");
            const cleanText = rawText.replace(/[*_`]/g, "").trim();
            const id = slugify(cleanText);
            return (
              <h3 id={id} className="scroll-mt-28 group" {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
