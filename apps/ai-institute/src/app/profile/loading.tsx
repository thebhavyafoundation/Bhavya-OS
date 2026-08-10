export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#1a3a2a]/30 rounded-full" />
            <div className="space-y-3">
              <div className="h-7 w-48 bg-[#1a3a2a]/30 rounded-lg" />
              <div className="h-4 w-32 bg-[#1a3a2a]/20 rounded" />
            </div>
          </div>
          <div className="h-px bg-[#1a3a2a]/20" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
            ))}
          </div>
          <div className="h-40 bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20" />
        </div>
      </div>
    </div>
  );
}
