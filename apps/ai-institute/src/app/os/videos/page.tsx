import { getBuilders } from "@/lib/os-data";
import { Video } from "lucide-react";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

const VIDEO_CATEGORIES = [
  { name: "System Design", icon: "🏗", count: 0 },
  { name: "Prompt Engineering", icon: "✍️", count: 0 },
  { name: "RAG", icon: "🔗", count: 0 },
  { name: "Knowledge Graphs", icon: "🧠", count: 0 },
  { name: "LLMs", icon: "🤖", count: 0 },
  { name: "Runtime", icon: "⚡", count: 0 },
  { name: "Governance", icon: "⚖️", count: 0 },
  { name: "Research", icon: "🔬", count: 0 },
];

export default async function VideosPage() {
  const builders = await getBuilders();
  const videoBuilder = (builders as AnyRecord[]).find(
    (b) => b.id === "video",
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Videos
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          AI-generated educational videos · {VIDEO_CATEGORIES.length} categories
        </p>
      </div>

      {videoBuilder && (
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-lg">🔧</span>
            <div>
              <div className="text-base font-semibold text-text-primary">
                {videoBuilder.name}
              </div>
              <div className="text-xs text-text-tertiary">
                {videoBuilder.description}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {videoBuilder.output?.map((o: string) => (
              <span
                key={o}
                className="text-[11px] px-2.5 py-1 rounded-md bg-bg-primary text-text-secondary border border-border-primary"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        {VIDEO_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="glass rounded-xl p-5 text-center hover:border-border-secondary transition-colors cursor-pointer"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="text-sm font-medium text-text-primary mb-1">
              {cat.name}
            </div>
            <div className="text-xs text-text-muted">
              {cat.count} videos
            </div>
          </div>
        ))}
      </div>

      <div className="p-16 text-center bg-bg-secondary border border-border-primary rounded-xl">
        <Video className="w-10 h-10 mx-auto mb-4 text-text-muted" />
        <div className="text-lg font-semibold text-text-primary mb-2">
          Videos will be generated from Knowledge Objects
        </div>
        <div className="text-sm text-text-tertiary max-w-lg mx-auto leading-relaxed">
          The Video Builder compiles lessons into Remotion-based animations.
          Each video includes scene graphs, timing, and auto-generated scripts.
        </div>
      </div>
    </div>
  );
}
