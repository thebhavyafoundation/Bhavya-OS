export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20 p-4 space-y-2">
                <div className="h-3 w-20 bg-[#1a3a2a]/25 rounded" />
                <div className="h-7 w-12 bg-[#1a3a2a]/30 rounded" />
                <div className="h-2 w-full bg-[#1a3a2a]/15 rounded-full" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-48 bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20" />
            <div className="space-y-4">
              <div className="h-20 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
              <div className="h-20 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
              <div className="h-20 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
