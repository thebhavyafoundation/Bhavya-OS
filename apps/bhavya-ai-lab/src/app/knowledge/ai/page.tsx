import { getKnowledgeObjects } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AIKnowledgePage() {
  const knowledgeObjects = await getKnowledgeObjects();

  const aiObjects = knowledgeObjects.filter((ko) => {
    const domain = (ko.domain || "").toLowerCase();
    const subject = (ko.subject || "").toLowerCase();
    return (
      domain.includes("artificial") ||
      domain.includes("ai") ||
      domain.includes("machine") ||
      domain.includes("computer") ||
      subject.includes("artificial") ||
      subject.includes("ai") ||
      subject.includes("computer")
    );
  });

  const allObjects = aiObjects.length > 0 ? aiObjects : knowledgeObjects;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <Link
          href="/knowledge"
          style={{
            color: "#71717a",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 16,
            display: "inline-block",
          }}
        >
          ← Back to Knowledge Base
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🤖</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Artificial Intelligence
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {allObjects.length} Knowledge Objects
          {aiObjects.length > 0 ? ` filtered by AI domain` : ""}
        </p>
      </div>

      {/* Knowledge Objects */}
      {allObjects.length > 0 ? (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {allObjects.map((ko) => (
            <div
              key={ko.id}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 12,
                padding: 24,
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#fafafa",
                      marginBottom: 4,
                    }}
                  >
                    {ko.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>
                    {ko.domain} · Grade {ko.grade} · {ko.subject}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background: "#166534",
                    color: "#22c55e",
                    fontWeight: 500,
                  }}
                >
                  {ko.concepts?.length || 0} concepts
                </span>
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#a1a1aa",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {ko.description}
              </p>
              {ko.concepts && ko.concepts.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginTop: 12,
                  }}
                >
                  {ko.concepts.slice(0, 4).map((c) => (
                    <span
                      key={c.name}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "#1c1c1f",
                        color: "#a1a1aa",
                        border: "1px solid #27272a",
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: 60,
            textAlign: "center",
            color: "#52525b",
            fontSize: 14,
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
          No AI knowledge objects found. Add JSON files to
          bhavya-ai-lab/knowledge/objects/
        </div>
      )}
    </div>
  );
}
