export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 bg-[#1a3a2a]/30 rounded-lg" />
            <div className="h-5 w-20 bg-[#c9a227]/20 rounded-full" />
          </div>
          <div className="h-3 w-full bg-[#1a3a2a]/15 rounded-full">
            <div className="h-3 w-1/3 bg-[#1a3a2a]/30 rounded-full" />
          </div>
          <div className="bg-[#1a3a2a]/10 rounded-xl border border-[#1a3a2a]/20 p-6 space-y-4">
            <div className="h-5 w-3/4 bg-[#1a3a2a]/25 rounded" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-[#1a3a2a]/15 rounded-lg border border-[#1a3a2a]/20" />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <div className="h-10 w-28 bg-[#1a3a2a]/20 rounded-xl" />
            <div className="h-10 w-32 bg-[#1a3a2a]/25 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
