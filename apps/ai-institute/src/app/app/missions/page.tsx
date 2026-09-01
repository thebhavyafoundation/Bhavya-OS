import type { Metadata } from "next";
import { TreePine, Landmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Missions — My Bhavya",
  description: "Track your contribution to Bhavya Foundation missions.",
};

const missions = [
  {
    id: "forest",
    title: "Bhavya Forest Mission",
    description: "Restoring degraded forest across India.",
    icon: TreePine,
    color: "var(--forest)",
  },
  {
    id: "heritage",
    title: "Bhavya Heritage Mission",
    description: "Documenting and preserving India's cultural heritage for future generations.",
    icon: Landmark,
    color: "var(--earth)",
  },
];

export default function MissionsPage() {
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
            Missions
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Your work contributes to something bigger.
          </p>
        </header>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {missions.map((mission) => (
            <div
              key={mission.id}
              style={{
                padding: "var(--space-8)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", gap: "var(--space-6)" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: mission.color,
                    borderRadius: "var(--radius-md)",
                    flexShrink: 0,
                  }}
                >
                  <mission.icon size={24} style={{ color: "var(--bg)" }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "var(--text-xl)",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {mission.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--text-secondary)",
                      marginBottom: "var(--space-4)",
                      lineHeight: 1.6,
                    }}
                  >
                    {mission.description}
                  </p>

                  <div
                    style={{
                      padding: "var(--space-6)",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-tertiary)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      Start contributing to this mission by volunteering, donating, or participating in related projects.
                    </p>
                    <a
                      href="/app/community"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        padding: "var(--space-2) var(--space-4)",
                        background: mission.color,
                        color: "var(--bg)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Get Involved
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
