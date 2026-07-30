import Link from "next/link";

const modules = [
  {
    id: "computer-basics",
    title: "Computer Basics",
    weeks: 2,
    lessons: 5,
    description: "Introduction to computers and their components",
  },
  {
    id: "internet-safety",
    title: "Internet Safety",
    weeks: 1,
    lessons: 4,
    description: "Staying safe online and digital citizenship",
  },
  {
    id: "scratch-intro",
    title: "Introduction to Scratch",
    weeks: 3,
    lessons: 8,
    description: "Visual programming with sprites and blocks",
  },
  {
    id: "logical-thinking",
    title: "Logical Thinking",
    weeks: 2,
    lessons: 6,
    description: "Patterns, sequences, and problem-solving",
  },
  {
    id: "data-information",
    title: "Data and Information",
    weeks: 2,
    lessons: 5,
    description: "Collecting, sorting, and presenting data",
  },
  {
    id: "capstone",
    title: "Capstone Project",
    weeks: 2,
    lessons: 3,
    description: "Apply everything you learned to solve a real problem",
  },
];

export default function FoundationPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <Link
          href="/curriculum"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 16,
            display: "inline-block",
          }}
        >
          ← Back to Curriculum
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Foundation Level
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 8 }}>
          Ages 8-10 • 12 weeks • 6 modules
        </p>
        <p style={{ fontSize: 16, color: "#cbd5e1" }}>
          Start your journey into computers and programming. No experience needed!
        </p>
      </div>

      {/* Modules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {modules.map((module, index) => (
          <div
            key={module.id}
            style={{
              padding: 32,
              background: "#1e293b",
              borderRadius: 12,
              border: "1px solid #334155",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#10b98120",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#10b981",
                }}
              >
                {index + 1}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
                  {module.title}
                </h2>
                <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
                  {module.weeks} weeks • {module.lessons} lessons
                </p>
              </div>
            </div>
            <p style={{ fontSize: 16, color: "#cbd5e1" }}>
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
