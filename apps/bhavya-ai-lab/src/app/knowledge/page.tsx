import Link from "next/link";

const domains = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    icon: "🤖",
    description: "Core AI concepts, machine learning, neural networks",
    entries: 20,
    color: "#8b5cf6",
  },
  {
    id: "programming",
    title: "Programming",
    icon: "💻",
    description: "Variables, loops, functions, data structures",
    entries: 15,
    color: "#3b82f6",
  },
  {
    id: "robotics",
    title: "Robotics",
    icon: "🦾",
    description: "Hardware, sensors, control systems",
    entries: 12,
    color: "#10b981",
  },
  {
    id: "data-science",
    title: "Data Science",
    icon: "📊",
    description: "Statistics, visualization, analysis",
    entries: 10,
    color: "#f59e0b",
  },
  {
    id: "ethics",
    title: "Ethics & Safety",
    icon: "🛡️",
    description: "AI bias, privacy, responsible use",
    entries: 8,
    color: "#ef4444",
  },
  {
    id: "digital-literacy",
    title: "Digital Literacy",
    icon: "📱",
    description: "Internet safety, digital citizenship",
    entries: 10,
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
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          Knowledge Base
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8" }}>
          Reference material organized by domain
        </p>
      </div>

      {/* Domains Grid */}
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
            href={`/knowledge/${domain.id}`}
            style={{
              padding: 32,
              background: "#1e293b",
              borderRadius: 12,
              border: "1px solid #334155",
              textDecoration: "none",
              color: "#f8fafc",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>{domain.icon}</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
              {domain.title}
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 16 }}>
              {domain.description}
            </p>
            <span style={{ fontSize: 12, color: domain.color, fontWeight: 500 }}>
              {domain.entries} entries
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
