import { getKnowledgeObjects } from "@/lib/data";

export const dynamic = "force-dynamic";

const CURRICULUM_LEVELS = [
  {
    id: "foundation",
    label: "Foundation",
    ages: "8-10",
    color: "#22c55e",
    icon: "🌱",
    description:
      "Computer basics, logical thinking, introduction to AI concepts",
  },
  {
    id: "explorer",
    label: "Explorer",
    ages: "10-12",
    color: "#3b82f6",
    icon: "🔍",
    description: "Programming fundamentals, data basics, simple AI experiments",
  },
  {
    id: "builder",
    label: "Builder",
    ages: "12-14",
    color: "#f59e0b",
    icon: "🔨",
    description: "Python, machine learning basics, robotics, web development",
  },
  {
    id: "innovator",
    label: "Innovator",
    ages: "14-16",
    color: "#a855f7",
    icon: "🚀",
    description: "Deep learning, NLP, computer vision, system design",
  },
  {
    id: "expert",
    label: "Expert",
    ages: "16-18+",
    color: "#ef4444",
    icon: "🎓",
    description:
      "Research methods, production systems, open source contributions",
  },
];

export default async function CoursesPage() {
  const knowledgeObjects = await getKnowledgeObjects();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 24 }}>🎓</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Courses
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {CURRICULUM_LEVELS.length} Levels · {knowledgeObjects.length}{" "}
          Knowledge Objects
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginBottom: 48,
        }}
      >
        {CURRICULUM_LEVELS.map((level, i) => {
          const levelKOs = knowledgeObjects.filter((ko) => {
            const grade = ko.grade;
            if (level.id === "foundation") return grade >= 8 && grade <= 10;
            if (level.id === "explorer") return grade >= 10 && grade <= 12;
            if (level.id === "builder") return grade >= 12 && grade <= 14;
            if (level.id === "innovator") return grade >= 14 && grade <= 16;
            if (level.id === "expert") return grade >= 16;
            return false;
          });

          return (
            <div
              key={level.id}
              style={{
                background: "#18181b",
                border: "1px solid #27272a",
                borderRadius: 12,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = level.color + "40")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#27272a")
              }
            >
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: level.color + "15",
                    border: `1px solid ${level.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {level.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fafafa",
                      }}
                    >
                      Level {i + 1}: {level.label}
                    </div>
                    <span style={{ fontSize: 12, color: "#71717a" }}>
                      Ages {level.ages}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#a1a1aa",
                      lineHeight: 1.5,
                      marginBottom: 12,
                    }}
                  >
                    {level.description}
                  </div>
                  <div
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        background: "#27272a",
                        borderRadius: 2,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: 2,
                          width:
                            levelKOs.length > 0
                              ? `${Math.min(100, levelKOs.length * 20)}%`
                              : "0%",
                          background: level.color,
                          transition: "width 0.3s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#71717a",
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      {levelKOs.length} modules
                    </span>
                  </div>
                </div>
              </div>
              {levelKOs.length > 0 && (
                <div
                  style={{ borderTop: "1px solid #27272a", padding: "8px 0" }}
                >
                  {levelKOs.map((ko, j) => (
                    <div
                      key={ko.id}
                      style={{
                        padding: "8px 24px 8px 92px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 13,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span
                          style={{
                            color: j < 2 ? "#22c55e" : "#52525b",
                            fontSize: 12,
                          }}
                        >
                          {j < 2 ? "✓" : j === 2 ? "▶" : "○"}
                        </span>
                        <span style={{ color: "#fafafa" }}>{ko.title}</span>
                      </div>
                      <span style={{ color: "#52525b", fontSize: 11 }}>
                        {ko.concepts?.length || 0} concepts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
