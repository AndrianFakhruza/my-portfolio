export default function AdminAboutLoading() {
  return (
    <div className="space-y-6 skeleton-wave">
      {/* Page title */}
      <div className="h-8 w-40 bg-paper-200 dark:bg-paper-800 rounded-xl" />

      {/* Section card 1 — Personal info */}
      <div className="bg-paper-200 dark:bg-paper-800 rounded-xl p-6 space-y-5">
        {/* Section heading */}
        <div className="h-5 w-36 bg-paper-300 dark:bg-paper-700 rounded-lg" />

        {/* Avatar + bio row */}
        <div className="flex items-start gap-5">
          <div className="h-24 w-24 flex-shrink-0 bg-paper-300 dark:bg-paper-700 rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-full bg-paper-300 dark:bg-paper-700 rounded-lg" />
            <div className="h-4 w-5/6 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            <div className="h-4 w-4/6 bg-paper-300 dark:bg-paper-700 rounded-lg" />
          </div>
        </div>

        {/* Input field skeletons */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            <div className="h-10 w-full bg-paper-300 dark:bg-paper-700 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Section card 2 — Skills / Social links */}
      <div className="bg-paper-200 dark:bg-paper-800 rounded-xl p-6 space-y-5">
        {/* Section heading */}
        <div className="h-5 w-32 bg-paper-300 dark:bg-paper-700 rounded-lg" />

        {/* Input field skeletons */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 bg-paper-300 dark:bg-paper-700 rounded-lg" />
            <div className="h-10 w-full bg-paper-300 dark:bg-paper-700 rounded-lg" />
          </div>
        ))}

        {/* Save button */}
        <div className="h-10 w-28 bg-paper-300 dark:bg-paper-700 rounded-xl" />
      </div>
    </div>
  );
}
