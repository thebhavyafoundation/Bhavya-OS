import type { Metadata } from "next";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Contributions — My Bhavya",
  description: "Your impact across learning, volunteering, and research.",
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
            <Heart size={32} style={{ color: "var(--text-secondary)" }} />
          </div>
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            No contributions yet
          </h3>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              maxWidth: 400,
              margin: "0 auto",
            }}
          >
            Your learning, volunteering, and research contributions will appear
            here as you engage with the institution.
          </p>
        </div>
      </div>
    </div>
  );
}
