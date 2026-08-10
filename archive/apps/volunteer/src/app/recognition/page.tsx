import { getRecognitions } from "@/lib/data";
import type { Recognition } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const TYPE_COLORS: Record<string, string> = {
  certificate: "#14b8a6", milestone: "#f59e0b", badge: "#a78bfa", commendation: "#ef4444",
};

export default function RecognitionPage() {
  const recognitions = getRecognitions();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Recognition &amp; Certificates</h1>
        {recognitions.length === 0 ? (
          <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No recognitions awarded yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {recognitions.map((r: Recognition) => (
              <div key={r.id} style={{
                background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: "16px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 10,
                    background: `${TYPE_COLORS[r.type]}22`, color: TYPE_COLORS[r.type], fontWeight: 500,
                  }}>{r.type}</span>
                  {r.missionType && (
                    <span style={{ fontSize: 11, color: "#64748b" }}>{r.missionType}</span>
                  )}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{r.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{r.description}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
                  {new Date(r.awardedDate).toLocaleDateString()}
                  {r.hoursAtAward ? ` \u00B7 ${r.hoursAtAward}h at award` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
