export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-bg-tertiary/30 rounded" />
            <div className="h-4 w-2 bg-bg-tertiary/20 rounded" />
            <div className="h-4 w-16 bg-bg-tertiary/25 rounded" />
          </div>
          <div className="h-9 w-72 bg-bg-tertiary/30 rounded-lg" />
          <div className="h-4 w-96 bg-bg-tertiary/20 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-tertiary/10 rounded-xl border border-border-primary/20 p-5 space-y-4">
              <div className="h-5 w-36 bg-bg-tertiary/25 rounded" />
              <div className="h-32 bg-bg-tertiary/15 rounded-lg" />
            </div>
            <div className="bg-bg-tertiary/10 rounded-xl border border-border-primary/20 p-5 space-y-4">
              <div className="h-5 w-36 bg-bg-tertiary/25 rounded" />
              <div className="h-32 bg-bg-tertiary/15 rounded-lg" />
            </div>
          </div>
          <div className="h-10 w-40 bg-bg-tertiary/25 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
