export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-56 bg-bg-tertiary/30 rounded-lg" />
          <div className="h-4 w-80 bg-bg-tertiary/20 rounded" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-bg-tertiary/10 rounded-xl border border-border-primary/20 p-5 flex items-center gap-5"
              >
                <div className="w-14 h-14 bg-bg-tertiary/25 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-bg-tertiary/30 rounded" />
                  <div className="h-3 w-full bg-bg-tertiary/15 rounded" />
                  <div className="h-3 w-3/4 bg-bg-tertiary/10 rounded" />
                </div>
                <div className="h-8 w-20 bg-bg-tertiary/20 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
