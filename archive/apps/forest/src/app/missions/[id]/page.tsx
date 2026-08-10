import { notFound } from "next/navigation";
import {
  getMission,
  getSitesByMission,
  getSurveysByMission,
  getPlantingsByMission,
  getMonitoringByMission,
  getImpactByMission,
} from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  planning: "#94a3b8",
  active: "#4ade80",
  monitoring: "#22d3ee",
  completed: "#10b981",
  "on-hold": "#f59e0b",
  archived: "#64748b",
};

export default function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = params as unknown as { id: string };
  const mission = getMission(id);
  if (!mission) return notFound();

  const sites = getSitesByMission(id);
  const surveys = getSurveysByMission(id);
  const plantings = getPlantingsByMission(id);
  const monitoring = getMonitoringByMission(id);
  const impacts = getImpactByMission(id);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#050f0a" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 960 }}>
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#f8fafc",
                margin: 0,
              }}
            >
              {mission.name}
            </h1>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "3px 12px",
                borderRadius: 12,
                background: `${STATUS_COLORS[mission.status]}22`,
                color: STATUS_COLORS[mission.status],
              }}
            >
              {mission.status}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>
            {mission.description}
          </p>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            {mission.region} &middot; Started{" "}
            {new Date(mission.startDate).toLocaleDateString()}
          </div>
        </div>

        {mission.goals.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#f8fafc",
                marginBottom: 12,
              }}
            >
              Goals
            </h2>
            {mission.goals.map((goal, i) => (
              <div
                key={i}
                style={{ fontSize: 13, color: "#94a3b8", padding: "4px 0" }}
              >
                &bull; {goal}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {[
            { label: "Sites", value: sites.length, color: "#22d3ee" },
            { label: "Surveys", value: surveys.length, color: "#a78bfa" },
            { label: "Plantings", value: plantings.length, color: "#4ade80" },
            {
              label: "Impact Reports",
              value: impacts.length,
              color: "#f59e0b",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#0a1a0f",
                border: "1px solid #1a3a2a",
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b" }}>{stat.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {sites.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#f8fafc",
                marginBottom: 12,
              }}
            >
              Sites
            </h2>
            {sites.map((site) => (
              <div
                key={site.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#f8fafc" }}
                >
                  {site.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {site.areaHectares ? `${site.areaHectares} ha` : "Area TBD"}{" "}
                  &middot; {site.surveyIds.length} surveys &middot;{" "}
                  {site.plantingIds.length} plantings
                </div>
              </div>
            ))}
          </div>
        )}

        {plantings.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#f8fafc",
                marginBottom: 12,
              }}
            >
              Plantings
            </h2>
            {plantings.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginBottom: 8,
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
                      background:
                        p.status === "completed"
                          ? "rgba(74,222,128,0.12)"
                          : "rgba(148,163,184,0.12)",
                      color: p.status === "completed" ? "#4ade80" : "#94a3b8",
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

        {monitoring.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#f8fafc",
                marginBottom: 12,
              }}
            >
              Monitoring
            </h2>
            {monitoring.slice(0, 5).map((m) => (
              <div
                key={m.id}
                style={{
                  background: "#0a1a0f",
                  border: "1px solid #1a3a2a",
                  borderRadius: 10,
                  padding: "14px 18px",
                  marginBottom: 8,
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
                  {m.observations.length} observations
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
