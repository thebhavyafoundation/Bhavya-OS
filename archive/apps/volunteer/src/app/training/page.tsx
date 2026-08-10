import { getTrainings } from "@/lib/data";
import type { Training } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  enrolled: "#64748b", "in-progress": "#06b6d4", completed: "#14b8a6", expired: "#ef4444",
};

export default function TrainingPage() {
  const trainings = getTrainings();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a1628" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 24 }}>Training Records</h1>
        {trainings.length === 0 ? (
          <div style={{ background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14 }}>No training records yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {trainings.map((t: Training) => (
              <div key={t.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#0f1d32", border: "1px solid #1e3a5f", borderRadius: 12, padding: "16px 20px",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {t.provider} &middot; {t.hours}h &middot; {t.category}
                  </div>
                </div>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 10,
                  background: `${STATUS_COLORS[t.status]}22`, color: STATUS_COLORS[t.status],
                }}>{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
