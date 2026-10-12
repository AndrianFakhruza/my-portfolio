export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-paper-950 skeleton-wave">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-paper-200 dark:bg-paper-800 rounded" />

      {/* Hero section */}
      <section className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16">
          {/* Left column */}
          <div className="flex-1 space-y-6 w-full">
            <div className="h-6 w-32 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-12 w-3/4 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-12 w-2/3 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-full bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-5/6 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="flex gap-4 pt-2">
              <div className="h-11 w-36 bg-paper-200 dark:bg-paper-800 rounded" />
              <div className="h-11 w-32 bg-paper-200 dark:bg-paper-800 rounded" />
            </div>
          </div>
          {/* Right column: photo placeholder */}
          <div className="flex-shrink-0 w-72 h-80 lg:w-96 lg:h-96 bg-paper-200 dark:bg-paper-800 rounded-2xl" />
        </div>
      </section>

      {/* Featured projects section */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-16">
        <div className="h-8 w-56 bg-paper-200 dark:bg-paper-800 rounded mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-paper-200 dark:border-paper-800 space-y-4 p-0">
              {/* Card image */}
              <div className="h-48 w-full bg-paper-200 dark:bg-paper-800 rounded-t-xl" />
              <div className="px-4 pb-4 space-y-3">
                {/* Title */}
                <div className="h-6 w-2/3 bg-paper-200 dark:bg-paper-800 rounded" />
                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-paper-200 dark:bg-paper-800 rounded-full" />
                  <div className="h-5 w-20 bg-paper-200 dark:bg-paper-800 rounded-full" />
                  <div className="h-5 w-14 bg-paper-200 dark:bg-paper-800 rounded-full" />
                </div>
                {/* Description */}
                <div className="h-4 w-full bg-paper-200 dark:bg-paper-800 rounded" />
                <div className="h-4 w-5/6 bg-paper-200 dark:bg-paper-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
