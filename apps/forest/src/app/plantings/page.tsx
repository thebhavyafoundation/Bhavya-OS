import { getPlantings } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  planned: "#94a3b8",
  "in-progress": "#f59e0b",
  completed: "#4ade80",
  monitoring: "#22d3ee",
};

export default function PlantingsPage() {
  const plantings = getPlantings();

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
          Plantings
        </h1>
        {plantings.length === 0 ? (
          <div
            style={{
              background: "#0a1a0f",
              border: "1px solid #1a3a2a",
              borderRadius: 12,
              padding: 48,
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", fontSize: 14 }}>No plantings yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {plantings.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}
                  >
                    {p.name}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: `${STATUS_COLORS[p.status]}22`,
                      color: STATUS_COLORS[p.status],
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  {p.plantedCount}/{p.targetCount} planted &middot;{" "}
                  {p.species.join(", ")}
                  {p.survivalRate !== undefined &&
                    ` \u00b7 ${p.survivalRate}% survival`}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
