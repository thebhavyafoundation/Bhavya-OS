export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="h-4 w-72 bg-[#1a3a2a]/20 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a3a2a]/30 rounded-lg" />
                  <div className="h-5 w-32 bg-[#1a3a2a]/25 rounded" />
                </div>
                <div className="h-3 w-full bg-[#1a3a2a]/15 rounded" />
                <div className="h-3 w-2/3 bg-[#1a3a2a]/10 rounded" />
                <div className="h-8 w-24 bg-[#1a3a2a]/20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
