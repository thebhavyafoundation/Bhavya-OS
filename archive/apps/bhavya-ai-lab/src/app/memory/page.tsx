import { getDecisions } from "@/lib/data";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DecisionRecord = Record<string, any>;

export default async function MemoryPage() {
  const decisionsMeta = await getDecisions();
  const records: DecisionRecord[] = decisionsMeta?.records || [];

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
          <span style={{ fontSize: 24 }}>🧠</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Memory
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          Institutional decision records — {records.length} ADRs
          {decisionsMeta?.update_policy
            ? ` · Policy: ${decisionsMeta.update_policy}`
            : ""}
        </p>
      </div>

      {records.length > 0 ? (
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 120px 140px 160px",
              gap: 16,
              padding: "12px 20px",
              borderBottom: "1px solid #27272a",
              background: "#09090b",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ID
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Title
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Status
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Author
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#52525b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Timestamp
            </div>
          </div>

          {records.map((record) => (
            <div
              key={record.id}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr 120px 140px 160px",
                gap: 16,
                padding: "14px 20px",
                borderBottom: "1px solid #27272a",
                transition: "background 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1c1c1f")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#22c55e",
                  fontFamily: "monospace",
                }}
              >
                {record.payload?.adr || record.id}
              </div>
              <div style={{ fontSize: 13, color: "#fafafa" }}>
                {record.payload?.title || record.id}
              </div>
              <div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 8px",
                    borderRadius: 6,
                    background:
                      record.payload?.status === "Accepted"
                        ? "#166534"
                        : "#78350f",
                    color:
                      record.payload?.status === "Accepted"
                        ? "#22c55e"
                        : "#f59e0b",
                    fontWeight: 500,
                  }}
                >
                  {record.payload?.status || "recorded"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#71717a" }}>
                {record.author}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#52525b",
                  fontFamily: "monospace",
                }}
              >
                {record.timestamp
                  ? record.timestamp.slice(0, 16).replace("T", " ")
                  : "—"}
              </div>
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>🧠</div>
          No decision records found
        </div>
      )}
    </div>
  );
}
