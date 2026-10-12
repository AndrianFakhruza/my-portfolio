export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page title */}
      <div className="h-8 w-48 bg-paper-200 dark:bg-paper-800 rounded-xl" />

      {/* Metric cards — 2x2 on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-paper-200 dark:bg-paper-800 rounded-xl p-5 flex flex-col gap-3"
          >
            {/* Icon placeholder */}
            <div className="h-10 w-10 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            {/* Big number */}
            <div className="h-8 w-16 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            {/* Label */}
            <div className="h-4 w-24 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Two-column area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-paper-200 dark:bg-paper-800 rounded-xl p-5 space-y-4">
          {/* Section heading */}
          <div className="h-5 w-36 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          {/* 5 project rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="h-10 w-10 flex-shrink-0 bg-paper-300 dark:bg-paper-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-paper-300 dark:bg-paper-700 rounded-lg" />
                <div className="h-3 w-1/2 bg-paper-300 dark:bg-paper-700 rounded-lg" />
              </div>
              {/* Status badge */}
              <div className="h-5 w-16 bg-paper-300 dark:bg-paper-700 rounded-full" />
            </div>
          ))}
        </div>

        {/* Recent Messages */}
        <div className="bg-paper-200 dark:bg-paper-800 rounded-xl p-5 space-y-4">
          {/* Section heading */}
          <div className="h-5 w-36 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          {/* 4 message rows */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-9 w-9 flex-shrink-0 bg-paper-300 dark:bg-paper-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-paper-300 dark:bg-paper-700 rounded-lg" />
                <div className="h-3 w-full bg-paper-300 dark:bg-paper-700 rounded-lg" />
              </div>
              {/* Date */}
              <div className="h-3 w-12 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
