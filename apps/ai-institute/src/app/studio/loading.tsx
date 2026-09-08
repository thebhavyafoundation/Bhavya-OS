export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-bg-tertiary/30 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-bg-tertiary/20 rounded-xl border border-border-primary/30"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
