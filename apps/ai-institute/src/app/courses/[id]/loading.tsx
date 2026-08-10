export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-24 bg-[#1a3a2a]/30 rounded" />
          <div className="h-10 w-96 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="h-4 w-72 bg-[#1a3a2a]/20 rounded" />
          <div className="flex gap-3">
            <div className="h-6 w-20 bg-[#1a3a2a]/25 rounded-full" />
            <div className="h-6 w-16 bg-[#1a3a2a]/25 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20 p-4 space-y-3">
                <div className="h-5 w-40 bg-[#1a3a2a]/30 rounded" />
                <div className="h-3 w-full bg-[#1a3a2a]/20 rounded" />
                <div className="h-3 w-3/4 bg-[#1a3a2a]/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
