import { getMonitoring } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function MonitoringPage() {
  const entries = getMonitoring();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050f0a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#f8fafc",
            marginBottom: 24,
          }}
        >
          Monitoring
        </h1>
        {entries.length === 0 ? (
          <div
            style={{
              background: "#0a1a0f",
              border: "1px solid #1a3a2a",
              borderRadius: 12,
              padding: 48,
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", fontSize: 14 }}>
              No monitoring entries yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {entries.map((m) => (
              <div
                key={m.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}
                >
                  {m.title}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {m.type} &middot;{" "}
                  {new Date(m.conductedDate).toLocaleDateString()} &middot;{" "}
                  {m.conductedBy} &middot; {m.observations.length} observations
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
