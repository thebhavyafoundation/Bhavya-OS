export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-20 bg-[#1a3a2a]/30 rounded" />
            <div className="h-4 w-2 bg-[#1a3a2a]/20 rounded" />
            <div className="h-4 w-32 bg-[#1a3a2a]/25 rounded" />
          </div>
          <div className="h-8 w-80 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="h-64 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
              <div className="flex gap-3">
                <div className="h-10 flex-1 bg-[#1a3a2a]/20 rounded-xl" />
                <div className="h-10 flex-1 bg-[#1a3a2a]/15 rounded-xl" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-28 bg-[#1a3a2a]/20 rounded-xl border border-[#1a3a2a]/30" />
              <div className="h-40 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
