import Link from "next/link";
import { getHeritageMissions } from "@/lib/data";
import type { Mission } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  planning: "#94a3b8", active: "#c9a84c", monitoring: "#22d3ee",
  completed: "#10b981", "on-hold": "#f59e0b", archived: "#64748b",
};

export default function MissionsPage() {
  const missions = getHeritageMissions();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Heritage Missions</h1>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>Cultural heritage preservation across regions.</p>
          </div>
          <Link href="/missions/new" style={{
            padding: "10px 20px", background: "#c9a84c", color: "#0f0a05",
            borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>+ New Mission</Link>
        </div>

        {missions.length === 0 ? (
          <div style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 48, textAlign: "center" }}>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>No heritage missions yet.</p>
            <Link href="/missions/new" style={{
              padding: "10px 20px", background: "#c9a84c", color: "#0f0a05",
              borderRadius: 8, fontSize: 13, fontWeight: 600, display: "inline-block", textDecoration: "none",
            }}>Create First Mission</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {missions.map((mission: Mission) => (
              <Link key={mission.id} href={`/missions/${mission.id}`} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12,
                padding: "20px 24px", textDecoration: "none",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{mission.name}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 10,
                      background: `${STATUS_COLORS[mission.status]}22`, color: STATUS_COLORS[mission.status],
                    }}>{mission.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>{mission.description}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                    {mission.region} &middot; {mission.siteIds.length} sites &middot; {mission.goals.length} goals
                  </div>
                </div>
                <span style={{ color: "#475569", fontSize: 18 }}>&rarr;</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
