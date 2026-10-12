export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-paper-950 animate-pulse">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-paper-200 dark:bg-paper-800 rounded" />

      {/* Hero section */}
      <section className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 py-16">
          {/* Left: heading + bio lines + buttons */}
          <div className="flex-1 space-y-5 w-full">
            <div className="h-10 w-48 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-full bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-11/12 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-4/5 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-full bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-5 w-3/4 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="flex gap-4 pt-2">
              <div className="h-11 w-36 bg-paper-200 dark:bg-paper-800 rounded" />
              <div className="h-11 w-32 bg-paper-200 dark:bg-paper-800 rounded" />
            </div>
          </div>
          {/* Right: photo rect */}
          <div className="flex-shrink-0 w-72 h-80 lg:w-80 lg:h-96 bg-paper-200 dark:bg-paper-800 rounded-2xl" />
        </div>
      </section>

      {/* Two-column section */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Academic Path + timeline items */}
          <div className="space-y-6">
            <div className="h-8 w-44 bg-paper-200 dark:bg-paper-800 rounded" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-paper-200 dark:bg-paper-800 flex-shrink-0 mt-1" />
                  {i < 1 && <div className="w-0.5 flex-1 bg-paper-200 dark:bg-paper-800 mt-1" />}
                </div>
                <div className="flex-1 space-y-2 pb-6">
                  <div className="h-5 w-2/3 bg-paper-200 dark:bg-paper-800 rounded" />
                  <div className="h-4 w-1/2 bg-paper-200 dark:bg-paper-800 rounded" />
                  <div className="h-4 w-full bg-paper-200 dark:bg-paper-800 rounded" />
                  <div className="h-4 w-5/6 bg-paper-200 dark:bg-paper-800 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Right: tech logos placeholder 2 rows */}
          <div className="space-y-6">
            <div className="h-8 w-40 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-paper-200 dark:bg-paper-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
