import type { Metadata } from "next";
import { Award, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Credentials — My Bhavya",
  description: "Your achievements and certifications.",
};

const credentials = [
  {
    id: "1",
    title: "Bhavya Foundations - Level 1",
    type: "course",
    date: "2026-07-15",
    description: "Completed foundational course on AI and Bhavya Foundation's mission.",
  },
  {
    id: "2",
    title: "Forest Restoration Volunteer",
    type: "volunteer",
    date: "2026-06-20",
    description: "Recognized contribution to the Bhavya Forest Mission.",
  },
  {
    id: "3",
    title: "Knowledge Object Contributor",
    type: "contribution",
    date: "2026-08-01",
    description: "Created 5 knowledge objects for the Bhavya knowledge graph.",
  },
];

export default function CredentialsPage() {
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
            Credentials
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Your achievements and recognition.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {credentials.map((cred) => (
            <div
              key={cred.id}
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--gold)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <Award size={24} style={{ color: "var(--bg)" }} />
              </div>

              <h2
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {cred.title}
              </h2>

              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-4)",
                  lineHeight: 1.6,
                }}
              >
                {cred.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {new Date(cred.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-3)",
                    background: "transparent",
                    color: "var(--gold)",
                    border: "1px solid var(--gold)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Download size={12} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
