export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-bg-tertiary/30 rounded-lg" />
          <div className="h-4 w-64 bg-bg-tertiary/20 rounded" />
          <div className="bg-bg-tertiary/10 rounded-xl border border-border-primary/20 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-bg-tertiary/30 rounded-full" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-bg-tertiary/30 rounded" />
                <div className="h-3 w-28 bg-bg-tertiary/20 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-bg-tertiary/15 rounded" />
            <div className="h-3 w-5/6 bg-bg-tertiary/10 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-bg-tertiary/15 rounded-xl border border-border-primary/20" />
            <div className="h-28 bg-bg-tertiary/15 rounded-xl border border-border-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
