import { getKnowledgeObjects, getBBLLessons } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const [knowledgeObjects, bblLessons] = await Promise.all([
    getKnowledgeObjects(),
    getBBLLessons(),
  ]);

  const koLessons = knowledgeObjects.map((ko) => ({
    id: ko.id,
    title: ko.title,
    subject: ko.subject,
    grade: ko.grade,
    domain: ko.domain,
    concepts: ko.concepts?.length || 0,
    definitions: ko.definitions?.length || 0,
    examples: ko.examples?.length || 0,
    exercises: ko.exercises?.length || 0,
    description: ko.description,
  }));

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
          <span style={{ fontSize: 24 }}>📖</span>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fafafa",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Lessons
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#71717a", margin: 0 }}>
          {koLessons.length} Knowledge Object Lessons · {bblLessons.length} BBL
          Lessons
        </p>
      </div>

      {/* KO Lessons */}
      {koLessons.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#a1a1aa",
              marginBottom: 16,
            }}
          >
            Knowledge Object Lessons
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {koLessons.map((lesson) => (
              <div
                key={lesson.id}
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  padding: "20px 24px",
                  transition: "border-color 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#3f3f46")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#27272a")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#fafafa",
                        marginBottom: 4,
                      }}
                    >
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#71717a" }}>
                      {lesson.subject} · Grade {lesson.grade} · {lesson.domain}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "#166534",
                      color: "#22c55e",
                      fontWeight: 500,
                    }}
                  >
                    {lesson.concepts} concepts
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#a1a1aa",
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                  }}
                >
                  {lesson.description}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 8,
                  }}
                >
                  {[
                    {
                      label: "Definitions",
                      value: lesson.definitions,
                      icon: "📖",
                    },
                    { label: "Examples", value: lesson.examples, icon: "💡" },
                    { label: "Exercises", value: lesson.exercises, icon: "✏️" },
                    { label: "Concepts", value: lesson.concepts, icon: "🧠" },
                  ].map((section) => (
                    <div
                      key={section.label}
                      style={{
                        padding: "10px 12px",
                        background: "#09090b",
                        borderRadius: 8,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: 16, marginBottom: 4 }}>
                        {section.icon}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#fafafa",
                        }}
                      >
                        {section.value}
                      </div>
                      <div style={{ fontSize: 11, color: "#52525b" }}>
                        {section.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BBL Lessons */}
      {bblLessons.length > 0 && (
        <div style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#a1a1aa",
              marginBottom: 16,
            }}
          >
            BBL (Bhavya Build Language) Lessons
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bblLessons.map((lesson) => (
              <div
                key={lesson.filename}
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #27272a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ fontSize: 14 }}>📝</span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#fafafa",
                      }}
                    >
                      {lesson.filename.replace(".bbl", "").replace(/-/g, " ")}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#52525b",
                      fontFamily: "monospace",
                    }}
                  >
                    .bbl
                  </span>
                </div>
                <pre
                  style={{
                    padding: "16px 20px",
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: "#a1a1aa",
                    fontFamily: '"JetBrains Mono", monospace',
                    overflow: "auto",
                    maxHeight: 300,
                    background: "#09090b",
                  }}
                >
                  {lesson.content?.slice(0, 1500)}
                  {(lesson.content?.length || 0) > 1500 &&
                    "\n\n... (truncated)"}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {koLessons.length === 0 && bblLessons.length === 0 && (
        <div style={{ padding: 80, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#fafafa",
              marginBottom: 8,
            }}
          >
            No lessons yet
          </div>
          <div style={{ fontSize: 14, color: "#71717a" }}>
            Lessons are generated from Knowledge Objects using the Lesson
            Builder.
          </div>
        </div>
      )}
    </div>
  );
}
