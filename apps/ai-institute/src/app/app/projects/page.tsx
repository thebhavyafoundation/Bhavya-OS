import type { Metadata } from "next";
import { Folder } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects — My Bhavya",
  description: "Your active projects and collaborations.",
};

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

        {/* Empty state */}
        <div
          style={{
            padding: "var(--space-12)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto var(--space-4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Folder size={32} style={{ color: "var(--text-secondary)" }} />
          </div>
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            No projects yet
          </h3>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            Projects will appear here as you collaborate with other community
            members on initiatives across the four missions.
          </p>
        </div>
      </div>
    </div>
  );
}
