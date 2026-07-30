import Link from "next/link";

const levels = [
  {
    id: "foundation",
    title: "Foundation",
    age: "8-10",
    weeks: 12,
    description: "Computer basics and visual programming",
    modules: 6,
    color: "#10b981",
  },
  {
    id: "beginner",
    title: "Beginner",
    age: "11-13",
    weeks: 16,
    description: "Text programming and web basics",
    modules: 6,
    color: "#3b82f6",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    age: "14-16",
    weeks: 20,
    description: "Advanced programming and robotics",
    modules: 6,
    color: "#8b5cf6",
  },
  {
    id: "advanced",
    title: "Advanced",
    age: "16-18",
    weeks: 24,
    description: "Machine learning and system design",
    modules: 5,
    color: "#f59e0b",
  },
  {
    id: "expert",
    title: "Expert",
    age: "18+",
    weeks: 28,
    description: "Specialization and open source",
    modules: 5,
    color: "#ef4444",
  },
];

export default function CurriculumPage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <Link
          href="/"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 16,
            display: "inline-block",
          }}
        >
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Curriculum
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8" }}>
          Structured learning paths from foundation to expert level
        </p>
      </div>

      {/* Learning Levels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {levels.map((level) => (
          <Link
            key={level.id}
            href={`/curriculum/${level.id}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 32,
              background: "#1e293b",
              borderRadius: 12,
              border: "1px solid #334155",
              textDecoration: "none",
              color: "#f8fafc",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${level.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 700,
                    color: level.color,
                  }}
                >
                  {level.id.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
                    {level.title}
                  </h2>
                  <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
                    Ages {level.age}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 16, color: "#cbd5e1", marginBottom: 8 }}>
                {level.description}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: "#64748b" }}>
                {level.modules} modules
              </span>
              <span style={{ fontSize: 14, color: "#64748b" }}>
                {level.weeks} weeks
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
