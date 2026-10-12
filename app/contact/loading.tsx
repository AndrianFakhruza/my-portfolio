export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-paper-50 dark:bg-paper-950 skeleton-wave">
      {/* Navbar placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-paper-200 dark:bg-paper-800 rounded" />

      {/* Heading + form skeleton */}
      <section className="pt-20 sm:pt-24 px-4 sm:px-8 max-w-2xl mx-auto py-16">
        <div className="space-y-4 mb-10">
          <div className="h-10 w-44 bg-paper-200 dark:bg-paper-800 rounded" />
          <div className="h-5 w-80 bg-paper-200 dark:bg-paper-800 rounded" />
          <div className="h-5 w-64 bg-paper-200 dark:bg-paper-800 rounded" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-5">
          {/* Input: Name */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-11 w-full bg-paper-200 dark:bg-paper-800 rounded-lg" />
          </div>
          {/* Input: Email */}
          <div className="space-y-2">
            <div className="h-4 w-16 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-11 w-full bg-paper-200 dark:bg-paper-800 rounded-lg" />
          </div>
          {/* Input: Subject */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-11 w-full bg-paper-200 dark:bg-paper-800 rounded-lg" />
          </div>
          {/* Textarea: Message */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-paper-200 dark:bg-paper-800 rounded" />
            <div className="h-36 w-full bg-paper-200 dark:bg-paper-800 rounded-lg" />
          </div>
          {/* Submit button */}
          <div className="h-12 w-36 bg-paper-200 dark:bg-paper-800 rounded-lg" />
        </div>
      </section>
    </div>
  );
}
