import Link from "next/link";

const layers = [
  {
    id: "layer-0-identity",
    title: "Identity",
    icon: "👤",
    description: "Who we are",
    color: "#10b981",
  },
  {
    id: "layer-1-mission",
    title: "Mission",
    icon: "🎯",
    description: "Why we exist",
    color: "#3b82f6",
  },
  {
    id: "layer-2-context",
    title: "Context",
    icon: "🗺️",
    description: "How to navigate",
    color: "#8b5cf6",
  },
  {
    id: "layer-3-knowledge",
    title: "Knowledge",
    icon: "📚",
    description: "What we know — atomic Knowledge Objects",
    color: "#f59e0b",
  },
  {
    id: "layer-4-factories",
    title: "Factories",
    icon: "🏭",
    description: "Universal Compiler — transform knowledge",
    color: "#ef4444",
  },
  {
    id: "layer-5-applications",
    title: "Applications",
    icon: "📱",
    description: "Web, PDF, Video, Mobile, Offline",
    color: "#06b6d4",
  },
  {
    id: "layer-6-runtime",
    title: "Runtime",
    icon: "⚡",
    description: "Current execution state",
    color: "#64748b",
  },
  {
    id: "layer-7-memory",
    title: "Institutional Memory",
    icon: "🧠",
    description: "Why things exist — decisions, changelog, audit",
    color: "#ec4899",
  },
];

const features = [
  {
    icon: "📦",
    title: "Knowledge First",
    description: "AI is a runtime, not the center. Knowledge is.",
  },
  {
    icon: "🔄",
    title: "Universal Compiler",
    description: "One source compiles to web, PDF, video, mobile, offline",
  },
  {
    icon: "📋",
    title: "Registry Layer",
    description: "Single source of truth for reusable components",
  },
  {
    icon: "🧠",
    title: "Institutional Memory",
    description: "Every decision recorded. Why things exist, not just what.",
  },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#10b981",
            marginBottom: 8,
          }}
        >
          BICM v1.0
        </p>
        <h1
          style={{
            fontSize: 48,
            fontWeight: 800,
            marginBottom: 16,
            background: "linear-gradient(135deg, #10b981, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Bhavya AI Lab
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "#94a3b8",
            maxWidth: 600,
            margin: "0 auto 16px",
          }}
        >
          An Educational Operating System built on the Bhavya Institutional
          Context Methodology.
        </p>
        <p
          style={{
            fontSize: 16,
            color: "#64748b",
            maxWidth: 500,
            margin: "0 auto 32px",
          }}
        >
          Knowledge is the center. AI is a runtime. The filesystem is the
          operating system.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <Link
            href="/layer-3-knowledge"
            style={{
              padding: "12px 32px",
              background: "#10b981",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Explore Knowledge
          </Link>
          <Link
            href="/bbl"
            style={{
              padding: "12px 32px",
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              border: "1px solid #334155",
            }}
          >
            BBL Examples
          </Link>
        </div>
      </div>

      {/* Features */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          marginBottom: 64,
        }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            style={{
              padding: 24,
              background: "#1e293b",
              borderRadius: 12,
              border: "1px solid #334155",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{feature.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              {feature.title}
            </h3>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* 8-Layer Architecture */}
      <div style={{ marginBottom: 64 }}>
        <h2
          style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          8-Layer Architecture
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          From Identity to Institutional Memory — every layer has a purpose
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {layers.map((layer) => (
            <Link
              key={layer.id}
              href={`/${layer.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: 24,
                background: "#1e293b",
                borderRadius: 12,
                border: "1px solid #334155",
                textDecoration: "none",
                color: "#f8fafc",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: `${layer.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                {layer.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>
                  {layer.title}
                </h3>
                <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
                  {layer.description}
                </p>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: layer.color,
                  fontWeight: 500,
                }}
              >
                Layer {layer.id.split("-")[1]}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          padding: "32px 0",
          borderTop: "1px solid #334155",
        }}
      >
        <p style={{ fontSize: 14, color: "#64748b" }}>
          Bhavya AI Lab — BICM v1.0 — Knowledge First
        </p>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
          Built with ❤️ for rural Himachal Pradesh
        </p>
      </div>
    </div>
  );
}
