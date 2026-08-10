export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-[#1a3a2a]/30 rounded" />
            <div className="h-4 w-2 bg-[#1a3a2a]/20 rounded" />
            <div className="h-4 w-16 bg-[#1a3a2a]/25 rounded" />
          </div>
          <div className="h-8 w-64 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
              <div className="h-32 bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20" />
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-[#1a3a2a]/20 rounded-xl border border-[#1a3a2a]/30" />
              <div className="h-36 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
