export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-bg-tertiary/30 rounded-lg" />
          <div className="h-4 w-72 bg-bg-tertiary/20 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-bg-tertiary/10 rounded-xl border border-border-primary/20 p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-tertiary/30 rounded-lg" />
                  <div className="h-5 w-32 bg-bg-tertiary/25 rounded" />
                </div>
                <div className="h-3 w-full bg-bg-tertiary/15 rounded" />
                <div className="h-3 w-2/3 bg-bg-tertiary/10 rounded" />
                <div className="h-8 w-24 bg-bg-tertiary/20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
