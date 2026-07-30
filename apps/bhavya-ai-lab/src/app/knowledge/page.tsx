import { getKnowledgeObjects, getContentDocuments } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const [knowledgeObjects, contentDocs] = await Promise.all([
    getKnowledgeObjects(),
    getContentDocuments(),
  ]);

  const docsByCategory = contentDocs.reduce(
    (acc, doc) => {
      const cat = doc.category || "uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(doc);
      return acc;
    },
    {} as Record<string, typeof contentDocs>,
  );

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
          <span style={{ fontSize: 24 }}>📚</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Knowledge Base
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {knowledgeObjects.length} Knowledge Objects · {contentDocs.length}{" "}
          Content Documents
        </p>
      </div>

      <div style={{ marginBottom: 48 }}>
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
          <span style={{ fontSize: 16 }}>🧠</span> Knowledge Objects
        </h2>
        {knowledgeObjects.length > 0 ? (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {knowledgeObjects.map((ko) => (
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
              padding: 40,
              textAlign: "center",
              color: "#52525b",
              fontSize: 14,
            }}
          >
            No Knowledge Objects found. Add JSON files to
            bhavya-ai-lab/knowledge/objects/
          </div>
        )}
      </div>

      <div>
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
          <span style={{ fontSize: 16 }}>📄</span> Content Documents
        </h2>
        {Object.keys(docsByCategory).length > 0 ? (
          Object.entries(docsByCategory).map(([category, docs]) => (
            <div key={category} style={{ marginBottom: 32 }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#a1a1aa",
                  textTransform: "capitalize",
                  marginBottom: 12,
                }}
              >
                {category} ({docs.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {docs.slice(0, 8).map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: "12px 16px",
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "border-color 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#3f3f46")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#27272a")
                    }
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#fafafa",
                        }}
                      >
                        {doc.title}
                      </div>
                      {doc.summary && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#71717a",
                            marginTop: 2,
                          }}
                        >
                          {doc.summary.slice(0, 100)}...
                        </div>
                      )}
                    </div>
                    <div
                      style={{ display: "flex", gap: 6, alignItems: "center" }}
                    >
                      {doc.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "#1c1c1f",
                            color: "#71717a",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background:
                            doc.status === "published" ? "#166534" : "#1c1c1f",
                          color:
                            doc.status === "published" ? "#22c55e" : "#71717a",
                        }}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
                {docs.length > 8 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#52525b",
                      padding: "8px 16px",
                    }}
                  >
                    + {docs.length - 8} more documents
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "#52525b",
              fontSize: 14,
            }}
          >
            No content documents found. Add JSON files to content/knowledge/
          </div>
        )}
      </div>
    </div>
  );
}
