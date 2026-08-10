import Link from "next/link";
import { getMissions } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  planning: "#94a3b8",
  active: "#4ade80",
  monitoring: "#22d3ee",
  completed: "#10b981",
  "on-hold": "#f59e0b",
  archived: "#64748b",
};

export default function MissionsPage() {
  const missions = getMissions();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050f0a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#f8fafc",
                marginBottom: 8,
              }}
            >
              Missions
            </h1>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              Long-term restoration goals across regions.
            </p>
          </div>
          <Link
            href="/missions/new"
            style={{
              padding: "10px 20px",
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
              padding: 48,
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
              No missions yet.
            </p>
            <Link
              href="/missions/new"
              style={{
                padding: "10px 20px",
                background: "#4ade80",
                color: "#0a1a0f",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: "inline-block",
              }}
            >
              Create First Mission
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  padding: "20px 24px",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#f8fafc",
                      }}
                    >
                      {mission.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: `${STATUS_COLORS[mission.status]}22`,
                        color: STATUS_COLORS[mission.status],
                      }}
                    >
                      {mission.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8" }}>
                    {mission.description}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>
                    {mission.region} &middot; {mission.siteIds.length} sites
                    &middot; {mission.goals.length} goals
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
