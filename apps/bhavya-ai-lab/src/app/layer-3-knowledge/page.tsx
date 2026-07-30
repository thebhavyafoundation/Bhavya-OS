import Link from "next/link";

const domains = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    icon: "🤖",
    description: "Core AI concepts, machine learning, neural networks",
    color: "#8b5cf6",
  },
  {
    id: "programming",
    title: "Programming",
    icon: "💻",
    description: "Variables, loops, functions, data structures",
    color: "#3b82f6",
  },
  {
    id: "robotics",
    title: "Robotics",
    icon: "🦾",
    description: "Hardware, sensors, control systems",
    color: "#10b981",
  },
  {
    id: "data-science",
    title: "Data Science",
    icon: "📊",
    description: "Statistics, visualization, analysis",
    color: "#f59e0b",
  },
  {
    id: "ethics",
    title: "Ethics & Safety",
    icon: "🛡️",
    description: "AI bias, privacy, responsible use",
    color: "#ef4444",
  },
  {
    id: "digital-literacy",
    title: "Digital Literacy",
    icon: "📱",
    description: "Internet safety, digital citizenship",
    color: "#06b6d4",
  },
];

export default function KnowledgePage() {
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
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#f59e0b",
            marginBottom: 8,
          }}
        >
          LAYER 3 — KNOWLEDGE
        </p>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Knowledge Objects
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8" }}>
          Atomic units of knowledge. Each object is self-contained, versioned,
          and schema-validated.
        </p>
      </div>

      {/* Knowledge Object Format */}
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
          Knowledge Object Structure
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
          {`{
  "id": "ko-ai-what-is-ai",
  "version": "1.0.0",
  "domain": "ai",
  "concept": "What is AI?",
  "definition": "...",
  "examples": [...],
  "misconceptions": [...],
  "difficulty": "beginner",
  "prerequisites": [],
  "relatedObjects": [...],
  "projects": [...],
  "references": [...]
}`}
        </pre>
      </div>

      {/* Domains Grid */}
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
        Domains
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {domains.map((domain) => (
          <Link
            key={domain.id}
            href={`/layer-3-knowledge/${domain.id}`}
            style={{
              padding: 32,
              background: "#1e293b",
              borderRadius: 12,
              border: "1px solid #334155",
              textDecoration: "none",
              color: "#f8fafc",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>{domain.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {domain.title}
            </h3>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              {domain.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
