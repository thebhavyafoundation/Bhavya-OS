import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn — My Bhavya",
  description: "Continue your learning journey at Bhavya Foundation.",
};

export default function LearnPage() {
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
            Learn
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Continue where you left off, or explore new courses.
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
            <BookOpen size={32} style={{ color: "var(--text-secondary)" }} />
          </div>
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "var(--space-2)",
            }}
          >
            No courses started yet
          </h3>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              maxWidth: 400,
              margin: "0 auto var(--space-4)",
            }}
          >
            Your enrolled courses and learning progress will appear here. Start
            by exploring our available courses.
          </p>
          <a
            href="/courses"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "var(--space-2) var(--space-4)",
              background: "var(--forest)",
              color: "var(--bg)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse Courses
          </a>
        </div>
      </div>
    </div>
  );
}
