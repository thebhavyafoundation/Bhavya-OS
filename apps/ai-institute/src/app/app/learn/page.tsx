import type { Metadata } from "next";
import { BookOpen, Clock, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn — My Bhavya",
  description: "Continue your learning journey at Bhavya Foundation.",
};

const courses = [
  {
    id: "foundations",
    title: "Bhavya Foundations",
    progress: 65,
    nextLesson: "Introduction to Knowledge Objects",
    status: "in_progress",
  },
  {
    id: "ai-literacy",
    title: "AI Literacy for Everyone",
    progress: 30,
    nextLesson: "What is Machine Learning?",
    status: "in_progress",
  },
  {
    id: "forest-science",
    title: "Forest Restoration Science",
    progress: 0,
    nextLesson: "Ecosystem Basics",
    status: "not_started",
  },
];

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

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          {courses.map((course) => (
            <div
              key={course.id}
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                <div>
                  <h2
                    style={{
                      fontSize: "var(--text-xl)",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {course.title}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", color: "var(--text-secondary)", fontSize: "var(--text-sm)" }}>
                    {course.status === "in_progress" ? (
                      <>
                        <Clock size={14} />
                        <span>In progress</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        <span>Not started</span>
                      </>
                    )}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--forest)",
                  }}
                >
                  {course.progress}%
                </span>
              </div>

              <div
                style={{
                  height: 4,
                  background: "var(--border)",
                  borderRadius: 2,
                  marginBottom: "var(--space-4)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${course.progress}%`,
                    background: "var(--forest)",
                    borderRadius: 2,
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
                  Next: {course.nextLesson}
                </span>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-4)",
                    background: "var(--forest)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continue
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
