export default function Loading() {
  return (
    <div className="min-h-screen bg-bg-primary px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 bg-bg-tertiary/30 rounded-lg" />
            <div className="h-5 w-20 bg-[#c9a227]/20 rounded-full" />
          </div>
          <div className="h-3 w-full bg-bg-tertiary/15 rounded-full">
            <div className="h-3 w-1/3 bg-bg-tertiary/30 rounded-full" />
          </div>
          <div className="bg-bg-tertiary/10 rounded-xl border border-border-primary/20 p-6 space-y-4">
            <div className="h-5 w-3/4 bg-bg-tertiary/25 rounded" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-bg-tertiary/15 rounded-lg border border-border-primary/20"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <div className="h-10 w-28 bg-bg-tertiary/20 rounded-xl" />
            <div className="h-10 w-32 bg-bg-tertiary/25 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
