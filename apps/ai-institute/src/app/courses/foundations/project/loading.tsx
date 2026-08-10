export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-[#1a3a2a]/30 rounded" />
            <div className="h-4 w-2 bg-[#1a3a2a]/20 rounded" />
            <div className="h-4 w-16 bg-[#1a3a2a]/25 rounded" />
          </div>
          <div className="h-9 w-72 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="h-4 w-96 bg-[#1a3a2a]/20 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20 p-5 space-y-4">
              <div className="h-5 w-36 bg-[#1a3a2a]/25 rounded" />
              <div className="h-32 bg-[#1a3a2a]/15 rounded-lg" />
            </div>
            <div className="bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20 p-5 space-y-4">
              <div className="h-5 w-36 bg-[#1a3a2a]/25 rounded" />
              <div className="h-32 bg-[#1a3a2a]/15 rounded-lg" />
            </div>
          </div>
          <div className="h-10 w-40 bg-[#1a3a2a]/25 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
