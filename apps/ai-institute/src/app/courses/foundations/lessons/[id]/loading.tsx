export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-4 w-32 bg-[#1a3a2a]/30 rounded" />
            <div className="h-4 w-2 bg-[#1a3a2a]/20 rounded" />
            <div className="h-4 w-20 bg-[#1a3a2a]/25 rounded" />
          </div>
          <div className="h-9 w-80 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="flex gap-4">
            <div className="h-6 w-28 bg-[#1a3a2a]/20 rounded-full" />
            <div className="h-6 w-20 bg-[#1a3a2a]/20 rounded-full" />
          </div>
          <div className="space-y-4 pt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-[#1a3a2a]/20 rounded" />
                <div className="h-4 w-5/6 bg-[#1a3a2a]/15 rounded" />
                <div className="h-4 w-2/3 bg-[#1a3a2a]/10 rounded" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-32 bg-[#1a3a2a]/25 rounded-xl" />
            <div className="h-10 w-28 bg-[#1a3a2a]/20 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
