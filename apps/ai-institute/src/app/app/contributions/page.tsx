import type { Metadata } from "next";
import { Heart, BookOpen, TreePine, FlaskConical, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Contributions — My Bhavya",
  description: "Your impact across learning, volunteering, and research.",
};

const contributions = [
  {
    id: "1",
    type: "learning",
    icon: BookOpen,
    title: "Completed AI Foundations Module",
    date: "2026-08-05",
    impact: "Gained foundational AI knowledge",
  },
  {
    id: "2",
    type: "volunteer",
    icon: TreePine,
    title: "Planted 12 trees at Bhavya Forest",
    date: "2026-07-28",
    impact: "Contributed to forest restoration",
  },
  {
    id: "3",
    type: "research",
    icon: FlaskConical,
    title: "Created 3 Knowledge Objects",
    date: "2026-07-20",
    impact: "Expanded the knowledge graph",
  },
  {
    id: "4",
    type: "community",
    icon: Users,
    title: "Mentored 2 new students",
    date: "2026-07-15",
    impact: "Helped onboard community members",
  },
];

const impactSummary = {
  learning: 12,
  volunteer: 8,
  research: 5,
  community: 3,
};

export default function ContributionsPage() {
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
            Contributions
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Your impact across the institution.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
          }}
        >
          {Object.entries(impactSummary).map(([type, count]) => (
            <div
              key={type}
              style={{
                padding: "var(--space-5)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-3xl)",
                  fontWeight: 800,
                  color: "var(--forest)",
                  marginBottom: "var(--space-1)",
                }}
              >
                {count}
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  textTransform: "capitalize",
                }}
              >
                {type}
              </div>
            </div>
          ))}
        </div>

        <h2
          style={{
            fontSize: "var(--text-xl)",
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: "var(--space-5)",
          }}
        >
          Recent Activity
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {contributions.map((contrib) => (
            <div
              key={contrib.id}
              style={{
                padding: "var(--space-5)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--forest)",
                  borderRadius: "var(--radius-md)",
                  flexShrink: 0,
                }}
              >
                <contrib.icon size={20} style={{ color: "var(--bg)" }} />
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "var(--text-base)",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {contrib.title}
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
                  <span>{new Date(contrib.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  <span>·</span>
                  <span style={{ color: "var(--forest)" }}>{contrib.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
