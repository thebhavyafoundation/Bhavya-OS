export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-[#1a3a2a]/30 rounded-lg" />
              <div className="h-4 w-48 bg-[#1a3a2a]/20 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-9 w-24 bg-[#1a3a2a]/20 rounded-lg" />
              <div className="h-9 w-20 bg-[#1a3a2a]/25 rounded-lg" />
            </div>
          </div>
          <div className="relative h-[500px] bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 bg-[#1a3a2a]/25 rounded-full border border-[#1a3a2a]/30"
                style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 2) * 30}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
