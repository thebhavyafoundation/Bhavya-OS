import { getRuntime, getBuilders } from "@/lib/data";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default async function RuntimePage() {
  const [runtime, builders] = await Promise.all([getRuntime(), getBuilders()]);

  const components: [string, AnyRecord][] = runtime?.components
    ? Object.entries(runtime.components)
    : [];
  const flow: string[] = runtime?.flow?.steps || [];
  const principles: string[] = runtime?.principles || [];

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
          <span style={{ fontSize: 24 }}>⚡</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Runtime
          </h1>
          <span
            style={{
              fontSize: 12,
              padding: "3px 10px",
              borderRadius: 6,
              background: "#166534",
              color: "#22c55e",
              fontWeight: 500,
            }}
          >
            v{runtime?.version || "3.0.0"}
          </span>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {runtime?.name || "Bhavya AI Lab Runtime"} — {components.length}{" "}
          components · {flow.length} flow steps
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
          <span style={{ fontSize: 16 }}>🧩</span> Components
        </h2>
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {components.length > 0 ? (
            components.map(([key, comp]) => (
              <div
                key={key}
                style={{
                  padding: "14px 20px",
                  borderBottom:
                    components.length > 1 ? "1px solid #27272a" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#22c55e",
                      boxShadow: "0 0 6px #22c55e44",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fafafa",
                        textTransform: "capitalize",
                      }}
                    >
                      {key.replace(/-/g, " ")}
                    </div>
                    <div style={{ fontSize: 12, color: "#71717a" }}>
                      {comp.description}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#52525b",
                    fontFamily: "monospace",
                  }}
                >
                  {comp.path}
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
              No components configured
            </div>
          )}
        </div>
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
          <span style={{ fontSize: 16 }}>🔄</span> Execution Flow
        </h2>
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {flow.length > 0 ? (
            flow.map((step, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 20px",
                  borderBottom:
                    i < flow.length - 1 ? "1px solid #27272a" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#22c55e",
                    color: "#000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: "#e4e4e7" }}>{step}</div>
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
              No flow steps defined
            </div>
          )}
        </div>
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
          <span style={{ fontSize: 16 }}>📐</span> Design Principles
        </h2>
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {principles.length > 0 ? (
            principles.map((principle, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 20px",
                  borderBottom:
                    i < principles.length - 1 ? "1px solid #27272a" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: 13, color: "#a1a1aa" }}>
                  {principle}
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
              No principles defined
            </div>
          )}
        </div>
      </div>

      {builders.length > 0 && (
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
            <span style={{ fontSize: 16 }}>🔨</span> Registered Builders
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {(builders as AnyRecord[]).map((builder) => (
              <div
                key={builder.id}
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#fafafa",
                    marginBottom: 4,
                  }}
                >
                  {builder.name}
                </div>
                <div
                  style={{ fontSize: 12, color: "#71717a", marginBottom: 8 }}
                >
                  {builder.description}
                </div>
                {builder.output && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {builder.output.slice(0, 3).map((o: string) => (
                      <span
                        key={o}
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "#1c1c1f",
                          color: "#71717a",
                        }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
