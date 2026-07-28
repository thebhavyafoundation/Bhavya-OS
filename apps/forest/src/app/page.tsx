import Link from "next/link";
import { getForestStats, getMissions, getImpactReports } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

export default function ForestDashboard() {
  const stats = getForestStats();
  const missions = getMissions();
  const impacts = getImpactReports();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050f0a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#f8fafc",
              marginBottom: 8,
            }}
          >
            Forest Mission
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>
            Restoring nature through structured missions, surveys, planting
            campaigns, and monitoring.
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {[
            { label: "Missions", value: stats.totalMissions, color: "#4ade80" },
            { label: "Sites", value: stats.totalSites, color: "#22d3ee" },
            {
              label: "Plantings",
              value: stats.totalPlantings,
              color: "#f59e0b",
            },
            {
              label: "Area Restored",
              value: `${stats.totalAreaRestored} ha`,
              color: "#10b981",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#0a1a0f",
                border: "1px solid #1a3a2a",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Impact Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "#0a1a0f",
              border: "1px solid #1a3a2a",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              Trees Planted
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#4ade80" }}>
              {stats.totalPlanted}
            </div>
          </div>
          <div
            style={{
              background: "#0a1a0f",
              border: "1px solid #1a3a2a",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              Avg Survival Rate
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#22d3ee" }}>
              {stats.averageSurvivalRate > 0
                ? `${stats.averageSurvivalRate.toFixed(1)}%`
                : "--"}
            </div>
          </div>
          <div
            style={{
              background: "#0a1a0f",
              border: "1px solid #1a3a2a",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              Impact Reports
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#f59e0b" }}>
              {stats.totalImpactReports}
            </div>
          </div>
        </div>

        {/* Missions */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f8fafc" }}>
              Active Missions
            </h2>
            <Link
              href="/missions/new"
              style={{
                padding: "8px 16px",
                background: "#4ade80",
                color: "#0a1a0f",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              + New Mission
            </Link>
          </div>
          {missions.length === 0 ? (
            <div
              style={{
                background: "#0a1a0f",
                border: "1px solid #1a3a2a",
                borderRadius: 12,
                padding: 32,
                textAlign: "center",
              }}
            >
              <p style={{ color: "#64748b", fontSize: 14 }}>
                No missions yet. Create your first restoration mission.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {missions.map((mission) => (
                <Link
                  key={mission.id}
                  href={`/missions/${mission.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#0a1a0f",
                    border: "1px solid #1a3a2a",
                    borderRadius: 12,
                    padding: "16px 20px",
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#f8fafc",
                      }}
                    >
                      {mission.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {mission.region} &middot; {mission.siteIds.length} sites
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 12,
                      background:
                        mission.status === "active"
                          ? "rgba(74,222,128,0.12)"
                          : "rgba(148,163,184,0.12)",
                      color:
                        mission.status === "active" ? "#4ade80" : "#94a3b8",
                    }}
                  >
                    {mission.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Impact Reports */}
        {impacts.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#f8fafc",
                marginBottom: 16,
              }}
            >
              Recent Impact
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {impacts.slice(0, 3).map((impact) => (
                <div
                  key={impact.id}
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
                    {impact.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                    {impact.areaRestoredHectares} ha &middot;{" "}
                    {impact.totalPlanted} trees &middot; {impact.survivalRate}%
                    survival
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
