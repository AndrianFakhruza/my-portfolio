export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-paper-950 animate-pulse">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-paper-200 dark:bg-paper-800 rounded" />

      {/* Header + filters */}
      <section className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto py-12">
        <div className="space-y-4 mb-8">
          <div className="h-10 w-48 bg-paper-200 dark:bg-paper-800 rounded" />
          <div className="h-5 w-80 bg-paper-200 dark:bg-paper-800 rounded" />
        </div>
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-paper-200 dark:bg-paper-800 rounded-full" />
          ))}
        </div>

        {/* Grid of 6 project card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-paper-200 dark:border-paper-800">
              {/* Card image */}
              <div className="h-48 w-full bg-paper-200 dark:bg-paper-800" />
              <div className="px-4 py-4 space-y-3">
                {/* Title */}
                <div className="h-6 w-2/3 bg-paper-200 dark:bg-paper-800 rounded" />
                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-paper-200 dark:bg-paper-800 rounded-full" />
                  <div className="h-5 w-20 bg-paper-200 dark:bg-paper-800 rounded-full" />
                </div>
                {/* Description */}
                <div className="h-4 w-full bg-paper-200 dark:bg-paper-800 rounded" />
                <div className="h-4 w-4/5 bg-paper-200 dark:bg-paper-800 rounded" />
                {/* Link */}
                <div className="h-4 w-24 bg-paper-200 dark:bg-paper-800 rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
