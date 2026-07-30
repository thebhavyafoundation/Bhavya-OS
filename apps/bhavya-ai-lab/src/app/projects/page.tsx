import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

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
          <span style={{ fontSize: 24 }}>📁</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Projects
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {projects.length} institutional projects
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
                    {project.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#71717a" }}>
                    Mission: {project.mission}
                    {project.budget ? ` · Budget: ${project.budget}` : ""}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background:
                      project.status === "Active" ? "#166534" : "#78350f",
                    color: project.status === "Active" ? "#22c55e" : "#f59e0b",
                    fontWeight: 500,
                  }}
                >
                  {project.status}
                </span>
              </div>

              {project.impact && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#a1a1aa",
                    padding: "8px 12px",
                    background: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  {project.impact}
                </div>
              )}

              {project.sectors && project.sectors.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#52525b",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Sectors ({project.sectors.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {project.sectors.map((sector) => (
                      <div
                        key={sector.name}
                        style={{
                          padding: "8px 12px",
                          background: "#09090b",
                          border: "1px solid #27272a",
                          borderRadius: 8,
                          fontSize: 12,
                          color: "#a1a1aa",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 500,
                            color: "#fafafa",
                            marginBottom: 2,
                          }}
                        >
                          {sector.name}
                        </div>
                        {sector.canopyDensity && (
                          <span style={{ color: "#22c55e" }}>
                            Canopy: {sector.canopyDensity}
                          </span>
                        )}
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
          <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
          No projects found. Add JSON files to content/projects/
        </div>
      )}
    </div>
  );
}
