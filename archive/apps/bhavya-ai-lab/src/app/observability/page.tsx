import { getServices, getRuntime } from "@/lib/data";

export const dynamic = "force-dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

export default async function ObservabilityPage() {
  const [services, runtime] = await Promise.all([getServices(), getRuntime()]);

  const components: [string, AnyRecord][] = runtime?.components
    ? Object.entries(runtime.components)
    : [];

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
          <span style={{ fontSize: 24 }}>📡</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Observability
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          Service health and runtime component status
        </p>
      </div>

      {/* Services */}
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
          <span style={{ fontSize: 16 }}>⚡</span> Services ({services.length})
        </h2>
        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {services.length > 0 ? (
            (services as AnyRecord[]).map((svc) => (
              <div
                key={svc.id}
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid #27272a",
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
                      background:
                        svc.status === "active"
                          ? "#22c55e"
                          : svc.status === "configured"
                            ? "#f59e0b"
                            : "#ef4444",
                      boxShadow:
                        svc.status === "active" ? "0 0 6px #22c55e44" : "none",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fafafa",
                      }}
                    >
                      {svc.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#52525b",
                        fontFamily: "monospace",
                      }}
                    >
                      {svc.endpoint}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background:
                      svc.status === "active"
                        ? "#166534"
                        : svc.status === "configured"
                          ? "#78350f"
                          : "#7f1d1d",
                    color:
                      svc.status === "active"
                        ? "#22c55e"
                        : svc.status === "configured"
                          ? "#f59e0b"
                          : "#ef4444",
                    fontWeight: 500,
                  }}
                >
                  {svc.status}
                </span>
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
              No services registered
            </div>
          )}
        </div>
      </div>

      {/* Runtime Components */}
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
          <span style={{ fontSize: 16 }}>🧩</span> Runtime Components (
          {components.length})
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
                  borderBottom: "1px solid #27272a",
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
              No runtime components
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
