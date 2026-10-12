export default function AdminMediaLoading() {
  return (
    <div className="space-y-6 skeleton-wave">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-paper-200 dark:bg-paper-800 rounded-xl" />
        <div className="h-9 w-36 bg-paper-200 dark:bg-paper-800 rounded-xl" />
      </div>

      {/* Media grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-paper-200 dark:bg-paper-800 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
