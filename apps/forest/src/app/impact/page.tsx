import { getImpactReports } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function ImpactPage() {
  const impacts = getImpactReports();

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
          Impact Reports
        </h1>
        {impacts.length === 0 ? (
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
              No impact reports yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {impacts.map((imp) => (
              <div
                key={imp.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#f8fafc",
                    marginBottom: 8,
                  }}
                >
                  {imp.title}
                </div>
                <div
                  style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}
                >
                  {imp.summary}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                  }}
                >
                  {[
                    {
                      label: "Area",
                      value: `${imp.areaRestoredHectares} ha`,
                      color: "#4ade80",
                    },
                    {
                      label: "Planted",
                      value: imp.totalPlanted.toLocaleString(),
                      color: "#22d3ee",
                    },
                    {
                      label: "Survival",
                      value: `${imp.survivalRate}%`,
                      color: "#f59e0b",
                    },
                    {
                      label: "Species",
                      value: imp.speciesCount.toString(),
                      color: "#a78bfa",
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
