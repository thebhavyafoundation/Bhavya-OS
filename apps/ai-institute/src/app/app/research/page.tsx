import type { Metadata } from "next";
import { FlaskConical, BookOpen, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Research — My Bhavya",
  description: "Explore research projects and knowledge objects.",
};

const researchProjects = [
  {
    id: "1",
    title: "AI for Forest Monitoring",
    status: "active",
    collaborators: 8,
    publications: 3,
    description: "Using computer vision to monitor forest health from satellite imagery.",
  },
  {
    id: "2",
    title: "Heritage Site Documentation",
    status: "active",
    collaborators: 5,
    publications: 1,
    description: "3D scanning and digital preservation of endangered heritage sites.",
  },
];

export default function ResearchPage() {
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
            Research
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Active research projects and knowledge contributions.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {researchProjects.map((project) => (
            <div
              key={project.id}
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-3)" }}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "var(--space-1) var(--space-2)",
                    background: project.status === "active" ? "var(--forest)" : "var(--earth)",
                    color: "var(--bg)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {project.status}
                </div>
              </div>

              <h2
                style={{
                  fontSize: "var(--text-xl)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {project.title}
              </h2>

              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-4)",
                  lineHeight: 1.6,
                }}
              >
                {project.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "var(--space-6)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  <Users size={14} />
                  <span>{project.collaborators} collaborators</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  <BookOpen size={14} />
                  <span>{project.publications} publications</span>
                </div>
              </div>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-4)",
                  background: "var(--gold)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Project
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
