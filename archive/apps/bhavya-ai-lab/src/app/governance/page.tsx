import { getGovernanceDocs, getPolicies } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function GovernancePage() {
  const [governanceDocs, policies] = await Promise.all([
    getGovernanceDocs(),
    getPolicies(),
  ]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>⚖️</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Governance
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {governanceDocs.length} governance documents · {policies.length}{" "}
          policies
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Governance Documents */}
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
            <span style={{ fontSize: 16 }}>📜</span> Governance Documents
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {governanceDocs.length > 0 ? (
              governanceDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 12,
                    padding: 20,
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fafafa",
                          marginBottom: 4,
                        }}
                      >
                        {doc.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#71717a" }}>
                        {doc.type}
                        {doc.ratified ? ` · Ratified ${doc.ratified}` : ""}
                        {doc.owner ? ` · ${doc.owner}` : ""}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background:
                          doc.status === "published" ? "#166534" : "#78350f",
                        color:
                          doc.status === "published" ? "#22c55e" : "#f59e0b",
                        fontWeight: 500,
                      }}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#a1a1aa",
                      lineHeight: 1.6,
                      margin: "0 0 12px 0",
                    }}
                  >
                    {doc.summary}
                  </p>
                  {doc.sections && doc.sections.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {doc.sections.slice(0, 4).map((section) => (
                        <span
                          key={section.heading}
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "#1c1c1f",
                            color: "#71717a",
                            border: "1px solid #27272a",
                          }}
                        >
                          {section.heading}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "#52525b",
                  fontSize: 14,
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                }}
              >
                No governance documents found
              </div>
            )}
          </div>
        </div>

        {/* Policies */}
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
            <span style={{ fontSize: 16 }}>📋</span> Policies
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {policies.length > 0 ? (
              policies.map((pol) => (
                <div
                  key={pol.id}
                  style={{
                    background: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: 12,
                    padding: 20,
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fafafa",
                          marginBottom: 4,
                        }}
                      >
                        {pol.icon && (
                          <span style={{ marginRight: 6 }}>{pol.icon}</span>
                        )}
                        {pol.title}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background:
                          pol.status === "published" ? "#166534" : "#78350f",
                        color:
                          pol.status === "published" ? "#22c55e" : "#f59e0b",
                        fontWeight: 500,
                      }}
                    >
                      {pol.status}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#a1a1aa",
                      lineHeight: 1.6,
                      margin: "0 0 12px 0",
                    }}
                  >
                    {pol.description}
                  </p>
                  {pol.sections && pol.sections.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {pol.sections.slice(0, 4).map((section) => (
                        <span
                          key={section.heading}
                          style={{
                            fontSize: 10,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: "#1c1c1f",
                            color: "#71717a",
                            border: "1px solid #27272a",
                          }}
                        >
                          {section.heading}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "#52525b",
                  fontSize: 14,
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                }}
              >
                No policies found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
