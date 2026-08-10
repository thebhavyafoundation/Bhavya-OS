export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="h-4 w-64 bg-[#1a3a2a]/20 rounded" />
          <div className="bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1a3a2a]/30 rounded-full" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-[#1a3a2a]/30 rounded" />
                <div className="h-3 w-28 bg-[#1a3a2a]/20 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-[#1a3a2a]/15 rounded" />
            <div className="h-3 w-5/6 bg-[#1a3a2a]/10 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
            <div className="h-28 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
