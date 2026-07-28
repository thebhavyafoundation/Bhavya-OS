import { getParticipations } from "@/lib/data";
import type { Participation } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const MISSION_COLORS: Record<string, string> = {
  forest: "#10b981", heritage: "#c9a84c", research: "#a78bfa",
};

export default function ParticipationPage() {
  const participations = getParticipations();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Participation History</h1>
        {participations.length === 0 ? (
          <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No participation records yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {participations.map((p: Participation) => (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: "16px 20px",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{p.task}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    <span style={{
                      fontSize: 11, padding: "1px 6px", borderRadius: 8,
                      background: `${MISSION_COLORS[p.missionType]}22`, color: MISSION_COLORS[p.missionType],
                    }}>{p.missionType}</span> &middot; {p.hours}h &middot; {new Date(p.date).toLocaleDateString()}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 10,
                  background: p.status === "completed" ? "rgba(20,184,166,0.12)" : "rgba(148,163,184,0.12)",
                  color: p.status === "completed" ? "#14b8a6" : "#94a3b8",
                }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
