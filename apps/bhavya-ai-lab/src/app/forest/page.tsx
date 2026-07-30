import { getForestMissions } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ForestPage() {
  const missions = await getForestMissions();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🌲</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Forest Missions
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {missions.length} missions tracked across forest restoration regions
        </p>
      </div>

      {missions.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {missions.map((mission) => (
            <div
              key={mission.id}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 12,
                padding: 24,
                transition: "border-color 0.15s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#3f3f46")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#27272a")
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#fafafa",
                      marginBottom: 4,
                    }}
                  >
                    {mission.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>
                    {mission.region}
                    {mission.startDate
                      ? ` · Started ${mission.startDate.slice(0, 10)}`
                      : ""}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background:
                      mission.status === "active" ||
                      mission.status === "in-progress"
                        ? "#166534"
                        : "#78350f",
                    color:
                      mission.status === "active" ||
                      mission.status === "in-progress"
                        ? "#22c55e"
                        : "#f59e0b",
                    fontWeight: 500,
                  }}
                >
                  {mission.status}
                </span>
              </div>

              {mission.goals && mission.goals.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#52525b",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Goals
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {mission.goals.map((goal, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 12,
                          color: "#a1a1aa",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#22c55e",
                            marginTop: 5,
                            flexShrink: 0,
                          }}
                        />
                        {goal}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mission.tags && mission.tags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {mission.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 10,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background: "#1c1c1f",
                        color: "#71717a",
                        border: "1px solid #27272a",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: 60,
            textAlign: "center",
            color: "#52525b",
            fontSize: 14,
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🌲</div>
          No forest missions recorded yet
        </div>
      )}
    </div>
  );
}
