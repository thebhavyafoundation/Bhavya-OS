import Link from "next/link";

const examples = [
  {
    id: "ai-foundations-lesson-01",
    title: "AI Foundations — Humans and Machines",
    course: "AI Foundations",
    module: "What is Intelligence?",
    lesson: "Humans and Machines",
  },
];

export default function BBLPage() {
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
          Bhavya Build Language (BBL)
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8" }}>
          Declarative language for educational intent. One source, many outputs.
        </p>
      </div>

      {/* BBL Grammar */}
      <div
        style={{
          padding: 24,
          background: "#1e293b",
          borderRadius: 12,
          border: "1px solid #334155",
          marginBottom: 48,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          BBL Grammar
        </h2>
        <pre
          style={{
            fontSize: 13,
            color: "#94a3b8",
            overflow: "auto",
            padding: 16,
            background: "#0f172a",
            borderRadius: 8,
          }}
        >
          {`COURSE {course-name}
  MODULE {module-name}
    LESSON {lesson-name}
      OBJECTIVES
        - {objective}
      SCENE
        {scene-description}
      VISUAL
        {visual-description}
      ACTIVITY
        {activity-description}
      ASSESSMENT
        {assessment-description}
      PROJECT
        {project-description}`}
        </pre>
      </div>

      {/* Compilation Targets */}
      <div
        style={{
          padding: 24,
          background: "#1e293b",
          borderRadius: 12,
          border: "1px solid #334155",
          marginBottom: 48,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Compilation Targets
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            { target: "Web Lesson", format: "HTML/React", factory: "Lesson Factory" },
            { target: "Teacher Guide", format: "PDF", factory: "PDF Factory" },
            { target: "Student Workbook", format: "PDF", factory: "PDF Factory" },
            { target: "Quiz", format: "JSON", factory: "Assessment Factory" },
            { target: "Animation", format: "Remotion", factory: "Video Factory" },
            { target: "Offline Package", format: "ZIP", factory: "Offline Factory" },
          ].map((item) => (
            <div
              key={item.target}
              style={{
                padding: 16,
                background: "#0f172a",
                borderRadius: 8,
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>
                {item.target}
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                {item.format} → {item.factory}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
        Examples
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {examples.map((example) => (
          <Link
            key={example.id}
            href={`/bbl/${example.id}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 24,
              background: "#1e293b",
              borderRadius: 12,
              border: "1px solid #334155",
              textDecoration: "none",
              color: "#f8fafc",
            }}
          >
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {example.title}
              </h3>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>
                {example.course} → {example.module} → {example.lesson}
              </p>
            </div>
            <span style={{ fontSize: 14, color: "#64748b" }}>View →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
