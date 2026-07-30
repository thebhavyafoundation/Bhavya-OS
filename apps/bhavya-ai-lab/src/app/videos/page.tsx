import { getBuilders } from "@/lib/data";

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
  const videoBuilder = (builders as AnyRecord[]).find((b) => b.id === "video");

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🎥</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Videos
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          AI-generated educational videos · {VIDEO_CATEGORIES.length} categories
        </p>
      </div>

      {videoBuilder && (
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>🔧</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fafafa" }}>
                {videoBuilder.name}
              </div>
              <div style={{ fontSize: 12, color: "#71717a" }}>
                {videoBuilder.description}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {videoBuilder.output?.map((o: string) => (
              <span
                key={o}
                style={{
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#09090b",
                  color: "#a1a1aa",
                  border: "1px solid #27272a",
                }}
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 48,
        }}
      >
        {VIDEO_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
              transition: "border-color 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#3f3f46")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#27272a")
            }
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#fafafa",
                marginBottom: 4,
              }}
            >
              {cat.name}
            </div>
            <div style={{ fontSize: 12, color: "#52525b" }}>
              {cat.count} videos
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: 60,
          textAlign: "center",
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎥</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#fafafa",
            marginBottom: 8,
          }}
        >
          Videos will be generated from Knowledge Objects
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#71717a",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          The Video Builder compiles lessons into Remotion-based animations.
          Each video includes scene graphs, timing, and auto-generated scripts.
        </div>
      </div>
    </div>
  );
}
