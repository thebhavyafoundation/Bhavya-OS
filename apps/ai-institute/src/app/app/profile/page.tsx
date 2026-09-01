import type { Metadata } from "next";
import { User, BookOpen, TreePine, FlaskConical, Award, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile — My Bhavya",
  description: "Your institutional profile at Bhavya Foundation.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1
                style={{
                  fontSize: "var(--text-3xl)",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                }}
              >
                Profile
              </h1>
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-secondary)",
                  marginTop: "var(--space-3)",
                }}
              >
                Your institutional identity at Bhavya Foundation.
              </p>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                background: "transparent",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                cursor: "pointer",
              }}
            >
              <Settings size={14} />
              Edit Profile
            </button>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--space-8)" }}>
          <div>
            <div
              style={{
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--border)",
                borderRadius: "50%",
                marginBottom: "var(--space-4)",
              }}
            >
              <User size={48} style={{ color: "var(--text-secondary)" }} />
            </div>

            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-1)",
              }}
            >
              Student User
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                marginBottom: "var(--space-4)",
              }}
            >
              student@ai-institute.com
            </p>

            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                flexWrap: "wrap",
              }}
            >
              {["Student", "Volunteer"].map((role) => (
                <span
                  key={role}
                  style={{
                    padding: "4px 12px",
                    background: "var(--forest)",
                    color: "var(--bg)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Institutional Stats
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "var(--space-4)",
                }}
              >
                {[
                  { label: "Courses", value: "—", icon: BookOpen },
                  { label: "Contributions", value: "—", icon: TreePine },
                  { label: "Credentials", value: "—", icon: Award },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <stat.icon size={20} style={{ color: "var(--forest)", marginBottom: "var(--space-2)" }} />
                    <div style={{ fontSize: "var(--text-2xl)", fontWeight: 800, color: "var(--text)" }}>{stat.value}</div>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-secondary)", marginTop: "var(--space-3)", textAlign: "center" }}>
                No verified activity recorded yet.
              </p>
            </div>

            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Interests
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  flexWrap: "wrap",
                }}
              >
                {["Artificial Intelligence", "Forest Restoration", "Heritage Preservation", "Open Source"].map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: "4px 12px",
                      background: "var(--border)",
                      color: "var(--text-secondary)",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--text-xs)",
                    }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
