import Link from "next/link";
import { getProjects, getResearchStats } from "@/lib/data";
import Sidebar from "@/components/Sidebar";

const STATUS_COLORS: Record<string, string> = {
  idea: "#94a3b8",
  proposal: "#f59e0b",
  active: "#10b981",
  analysis: "#06b6d4",
  draft: "#8b5cf6",
  review: "#3b82f6",
  revision: "#f97316",
  approval: "#14b8a6",
  published: "#22c55e",
  archived: "#64748b",
};

export default function ResearchDashboard() {
  const stats = getResearchStats();
  const projects = getProjects();
  const activeProjects = projects.filter((p) =>
    ["active", "analysis", "draft", "review"].includes(p.status),
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1100 }}>
        <div style={{ marginBottom: 36 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#0D503C",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Research Lifecycle
          </p>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: 8,
            }}
          >
            Research Platform
          </h1>
          <p style={{ fontSize: 15, color: "#666", maxWidth: 600 }}>
            Manage the full research lifecycle: from idea to published
            knowledge. Every claim backed by evidence, every source tracked with
            provenance.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {[
            { label: "Projects", value: stats.totalProjects, color: "#0D503C" },
            { label: "Sources", value: stats.totalSources, color: "#8b5cf6" },
            { label: "Evidence", value: stats.totalEvidence, color: "#3b82f6" },
            { label: "Reviews", value: stats.totalReviews, color: "#f59e0b" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: "18px 20px",
                background: "#fff",
                border: "1px solid #e5e5e0",
                borderRadius: 10,
              }}
            >
              <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 26, fontWeight: 700, color: s.color }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div style={{ marginBottom: 36 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 16,
            }}
          >
            Research Pipeline
          </h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {(
              [
                "idea",
                "proposal",
                "active",
                "analysis",
                "draft",
                "review",
                "approval",
                "published",
              ] as const
            ).map((status) => (
              <div
                key={status}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  background: `${STATUS_COLORS[status]}15`,
                  color: STATUS_COLORS[status],
                  border: `1px solid ${STATUS_COLORS[status]}30`,
                }}
              >
                {status} ({stats.projectsByStatus[status]})
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1a1a" }}>
              Active Projects
            </h2>
            <Link
              href="/projects/new"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#fff",
                background: "#0D503C",
                padding: "7px 14px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              + New Project
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "#fff",
                  border: "1px solid #e5e5e0",
                  borderRadius: 10,
                  textDecoration: "none",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#1a1a1a",
                      margin: "0 0 4px 0",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#888", margin: 0 }}>
                    PI: {project.principalInvestigator} &middot;{" "}
                    {project.mission} &middot; {project.objectives.length}{" "}
                    objectives
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: `${STATUS_COLORS[project.status]}15`,
                    color: STATUS_COLORS[project.status],
                  }}
                >
                  {project.status}
                </span>
              </Link>
            ))}
            {activeProjects.length === 0 && (
              <p
                style={{
                  padding: 32,
                  textAlign: "center",
                  color: "#888",
                  background: "#fff",
                  borderRadius: 10,
                  border: "1px solid #e5e5e0",
                }}
              >
                No active projects. Create one to get started.
              </p>
            )}
          </div>
        </div>

        {/* All Projects */}
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: 16,
            }}
          >
            All Projects
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  background: "#fff",
                  border: "1px solid #e5e5e0",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                <div>
                  <span
                    style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}
                  >
                    {project.title}
                  </span>
                  <span style={{ fontSize: 12, color: "#888", marginLeft: 12 }}>
                    {project.mission}
                  </span>
                </div>
                <span
                  style={{ fontSize: 11, color: STATUS_COLORS[project.status] }}
                >
                  {project.status}
                </span>
              </Link>
            ))}
            {projects.length === 0 && (
              <p style={{ padding: 32, textAlign: "center", color: "#888" }}>
                No research projects yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
