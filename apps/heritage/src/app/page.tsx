import Link from "next/link";
import { getHeritageStats } from "@/lib/data";
import type { Mission } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function HeritageDashboard() {
  const stats = getHeritageStats();
  const missions = getHeritageMissions();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f0a05" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>Heritage Mission</h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>Preserving heritage through structured missions, assessments, documentation, and conservation.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Missions", value: stats.totalMissions, color: "#c9a84c" },
            { label: "Assets", value: stats.totalAssets, color: "#22d3ee" },
            { label: "Assessments", value: stats.totalAssessments, color: "#a78bfa" },
            { label: "Conservation Plans", value: stats.totalConservationPlans, color: "#10b981" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc" }}>Active Missions</h2>
            <Link href="/missions/new" style={{
              padding: "8px 16px", background: "#c9a84c", color: "#0f0a05",
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>+ New Mission</Link>
          </div>
          {missions.length === 0 ? (
            <div style={{ background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <p style={{ color: "#64748b", fontSize: 14 }}>No missions yet. Create your first heritage mission.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {missions.map((mission: Mission) => (
                <Link key={mission.id} href={`/missions/${mission.id}`} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "#1a1208", border: "1px solid #2a1f10", borderRadius: 12,
                  padding: "16px 20px", textDecoration: "none", transition: "border-color 0.15s",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}>{mission.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{mission.region} &middot; {mission.siteIds.length} sites</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 12,
                    background: mission.status === "active" ? "rgba(201,168,76,0.12)" : "rgba(148,163,184,0.12)",
                    color: mission.status === "active" ? "#c9a84c" : "#94a3b8",
                  }}>{mission.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
