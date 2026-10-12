export default function AdminProjectsLoading() {
  return (
    <div className="space-y-6 skeleton-wave">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-paper-200 dark:bg-paper-800 rounded-xl" />
        <div className="h-9 w-32 bg-paper-200 dark:bg-paper-800 rounded-xl" />
      </div>

      {/* Table / list */}
      <div className="bg-paper-200 dark:bg-paper-800 rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-paper-300 dark:border-paper-700">
          <div className="h-4 w-24 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          <div className="h-4 w-32 flex-1 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          <div className="h-4 w-20 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          <div className="h-4 w-16 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          <div className="h-4 w-20 bg-paper-300 dark:bg-paper-700 rounded-lg" />
        </div>

        {/* 6 project rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-paper-300 dark:border-paper-700 last:border-0"
          >
            {/* Thumbnail */}
            <div className="h-12 w-16 flex-shrink-0 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            {/* Title */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-paper-300 dark:bg-paper-700 rounded-lg" />
              <div className="h-3 w-1/2 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            </div>
            {/* Category */}
            <div className="h-4 w-20 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            {/* Status badge */}
            <div className="h-5 w-16 bg-paper-300 dark:bg-paper-700 rounded-full" />
            {/* Actions */}
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-paper-300 dark:bg-paper-700 rounded-lg" />
              <div className="h-8 w-8 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
