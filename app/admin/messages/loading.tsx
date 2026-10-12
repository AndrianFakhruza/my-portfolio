export default function AdminMessagesLoading() {
  return (
    <div className="space-y-6 skeleton-wave">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-paper-200 dark:bg-paper-800 rounded-xl" />
      </div>

      {/* Messages list */}
      <div className="bg-paper-200 dark:bg-paper-800 rounded-xl overflow-hidden">
        {/* 6 message rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-paper-300 dark:border-paper-700 last:border-0"
          >
            {/* Avatar */}
            <div className="h-10 w-10 flex-shrink-0 bg-paper-300 dark:bg-paper-700 rounded-full" />
            {/* Name + preview */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-paper-300 dark:bg-paper-700 rounded-lg" />
              <div className="h-3 w-full bg-paper-300 dark:bg-paper-700 rounded-lg" />
              <div className="h-3 w-3/4 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            </div>
            {/* Date */}
            <div className="h-3 w-16 flex-shrink-0 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
