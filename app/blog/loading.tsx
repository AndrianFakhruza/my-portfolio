export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-paper-950 skeleton-wave">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-paper-200 dark:bg-paper-800 rounded" />

      {/* Header skeleton */}
      <section className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto py-12">
        <div className="space-y-4 mb-10">
          <div className="h-10 w-36 bg-paper-200 dark:bg-paper-800 rounded" />
          <div className="h-5 w-72 bg-paper-200 dark:bg-paper-800 rounded" />
        </div>

        {/* Grid of 4 article card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-paper-200 dark:border-paper-800 overflow-hidden"
            >
              {/* Article image */}
              <div className="h-44 w-full bg-paper-200 dark:bg-paper-800" />
              <div className="px-5 py-5 space-y-3">
                {/* Title */}
                <div className="h-6 w-3/4 bg-paper-200 dark:bg-paper-800 rounded" />
                {/* Date */}
                <div className="h-4 w-28 bg-paper-200 dark:bg-paper-800 rounded" />
                {/* Excerpt */}
                <div className="h-4 w-full bg-paper-200 dark:bg-paper-800 rounded" />
                <div className="h-4 w-5/6 bg-paper-200 dark:bg-paper-800 rounded" />
                <div className="h-4 w-2/3 bg-paper-200 dark:bg-paper-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
