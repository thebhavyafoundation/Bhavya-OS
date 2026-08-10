import {
  getKnowledgeObjects,
  getContentDocuments,
  getGovernanceDocs,
  getPolicies,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const [knowledgeObjects, contentDocs, governanceDocs, policies] =
    await Promise.all([
      getKnowledgeObjects(),
      getContentDocuments(),
      getGovernanceDocs(),
      getPolicies(),
    ]);

  const searchableTypes = [
    {
      label: "Knowledge Objects",
      icon: "🧠",
      count: knowledgeObjects.length,
      examples: knowledgeObjects.slice(0, 3).map((ko) => ko.title),
    },
    {
      label: "Content Documents",
      icon: "📄",
      count: contentDocs.length,
      examples: contentDocs.slice(0, 3).map((doc) => doc.title),
    },
    {
      label: "Governance Docs",
      icon: "⚖️",
      count: governanceDocs.length,
      examples: governanceDocs.slice(0, 3).map((doc) => doc.title),
    },
    {
      label: "Policies",
      icon: "📋",
      count: policies.length,
      examples: policies.slice(0, 3).map((pol) => pol.title),
    },
  ];

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
          <span style={{ fontSize: 24 }}>🔍</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Search
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          Search across{" "}
          {knowledgeObjects.length +
            contentDocs.length +
            governanceDocs.length +
            policies.length}{" "}
          institutional records
        </p>
      </div>

      {/* Search Input (placeholder) */}
      <div
        style={{
          background: "#18181b",
          border: "1px solid #27272a",
          borderRadius: 12,
          padding: 20,
          marginBottom: 32,
        }}
      >
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "#52525b",
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search knowledge, documents, policies..."
            disabled
            style={{
              width: "100%",
              padding: "14px 16px 14px 44px",
              background: "#09090b",
              border: "1px solid #27272a",
              borderRadius: 8,
              color: "#71717a",
              fontSize: 14,
              outline: "none",
              cursor: "not-allowed",
            }}
          />
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "#52525b" }}>
          Client-side search coming soon. Currently showing all available
          content types.
        </div>
      </div>

      {/* Searchable Content Types */}
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#fafafa",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>📁</span> Searchable Content
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {searchableTypes.map((type) => (
          <div
            key={type.label}
            style={{
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{type.icon}</span>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#fafafa" }}
                >
                  {type.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 6,
                  background: "#166534",
                  color: "#22c55e",
                  fontWeight: 500,
                }}
              >
                {type.count}
              </span>
            </div>
            {type.examples.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {type.examples.map((example) => (
                  <div
                    key={example}
                    style={{ fontSize: 12, color: "#71717a", paddingLeft: 26 }}
                  >
                    {example}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#52525b", paddingLeft: 26 }}>
                No items available
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
