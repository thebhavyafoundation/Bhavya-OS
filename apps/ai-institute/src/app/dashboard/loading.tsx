export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d] px-6 py-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-[#1a3a2a]/30 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[#1a3a2a]/20 rounded-xl border border-[#1a3a2a]/30" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
            <div className="h-64 bg-[#1a3a2a]/15 rounded-xl border border-[#1a3a2a]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
