import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function AcademyPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <section
        style={{
          padding: "var(--space-24) 0 var(--space-16)",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "720px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "var(--space-1) var(--space-4)",
              borderRadius: "var(--radius-full)",
              background: "rgba(14, 56, 46, 0.1)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-6)",
            }}
          >
            Knowledge / Academy
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 5vw, 3rem)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-6)",
              lineHeight: 1.2,
            }}
          >
            Bhavya Academy
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-earth)",
              maxWidth: "600px",
              margin: "0 auto var(--space-10)",
              lineHeight: 1.7,
            }}
          >
            A structured, progressive learning path — from first encounters with
            AI to institution building. Four tracks serve ages 6–18 with
            age-appropriate content, hands-on labs, and real projects.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/curriculum"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-brand-forest)",
                color: "white",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                textDecoration: "none",
                transition: "opacity var(--duration-fast) ease",
              }}
            >
              <BookOpen size={16} />
              Explore the Curriculum
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/courses"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(106, 124, 82, 0.2)",
                color: "var(--color-brand-forest)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                textDecoration: "none",
                transition: "background var(--duration-fast) ease",
              }}
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
