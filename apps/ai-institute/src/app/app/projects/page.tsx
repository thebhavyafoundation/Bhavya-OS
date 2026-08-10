import type { Metadata } from "next";
import { Folder, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects — My Bhavya",
  description: "Your active projects and collaborations.",
};

const projects = [
  {
    id: "1",
    title: "Forest Health Dashboard",
    status: "in_progress",
    role: "Developer",
    description: "Real-time monitoring dashboard for forest restoration sites.",
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    title: "Heritage Site 3D Models",
    status: "in_progress",
    role: "Contributor",
    description: "Creating 3D digital twins of heritage structures.",
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    title: "AI Literacy Curriculum",
    status: "completed",
    role: "Author",
    description: "Open-source curriculum for teaching AI fundamentals.",
    lastActivity: "1 week ago",
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1
            style={{
              fontSize: "var(--text-3xl)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.03em",
            }}
          >
            Projects
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Active projects and collaborations.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                padding: "var(--space-5)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--border)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Folder size={20} style={{ color: "var(--text-secondary)" }} />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "var(--text-base)",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    {project.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        background: project.status === "completed" ? "var(--forest)" : "var(--gold)",
                        color: "var(--bg)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                      }}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                    <span>{project.role}</span>
                    <span>·</span>
                    <span>{project.lastActivity}</span>
                  </div>
                </div>
              </div>

              <ArrowRight size={16} style={{ color: "var(--text-tertiary)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
