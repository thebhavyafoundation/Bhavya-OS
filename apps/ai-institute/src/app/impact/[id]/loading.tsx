export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-20 bg-[#1a3a2a]/30 rounded" />
            <div className="h-4 w-2 bg-[#1a3a2a]/20 rounded" />
            <div className="h-4 w-28 bg-[#1a3a2a]/25 rounded" />
          </div>
          <div className="h-8 w-72 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20 p-4 space-y-3">
                <div className="h-5 w-28 bg-[#1a3a2a]/30 rounded" />
                <div className="h-8 w-16 bg-[#1a3a2a]/25 rounded" />
                <div className="h-3 w-full bg-[#1a3a2a]/20 rounded" />
              </div>
            ))}
          </div>
          <div className="h-48 bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20" />
        </div>
      </div>
    </div>
  );
}
