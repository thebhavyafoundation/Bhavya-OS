import { getResearchProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const projects = await getResearchProjects();

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
          <span style={{ fontSize: 24 }}>🔬</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Research
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {projects.length} research projects
        </p>
      </div>

      {projects.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map((project) => (
            <div
              key={project.id}
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
                    {project.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>
                    Mission: {project.mission}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background:
                      project.status === "active" ||
                      project.status === "in-progress"
                        ? "#166534"
                        : project.status === "completed"
                          ? "#1e3a5f"
                          : "#78350f",
                    color:
                      project.status === "active" ||
                      project.status === "in-progress"
                        ? "#22c55e"
                        : project.status === "completed"
                          ? "#3b82f6"
                          : "#f59e0b",
                    fontWeight: 500,
                  }}
                >
                  {project.status}
                </span>
              </div>

              {project.objectives && project.objectives.length > 0 && (
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
                    Objectives
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {project.objectives.map((obj, i) => (
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
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.findings && project.findings.length > 0 && (
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
                    Findings
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {project.findings.slice(0, 3).map((finding, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 12,
                          color: "#a1a1aa",
                          paddingLeft: 12,
                        }}
                      >
                        {finding}
                      </div>
                    ))}
                  </div>
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔬</div>
          No research projects found. Add JSON files to content/research/
        </div>
      )}
    </div>
  );
}
