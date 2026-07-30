import Link from "next/link";

const articles = [
  {
    id: "what-is-ai",
    title: "What is Artificial Intelligence?",
    description: "Definition, explanation, and local examples",
    difficulty: "Beginner",
  },
  {
    id: "types-of-ai",
    title: "Types of AI",
    description: "Narrow vs General AI, levels of intelligence",
    difficulty: "Beginner",
  },
  {
    id: "how-ai-works",
    title: "How AI Works",
    description: "Data, patterns, and learning mechanisms",
    difficulty: "Intermediate",
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Supervised, unsupervised, and reinforcement learning",
    difficulty: "Intermediate",
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    description: "Brain-inspired computing and deep learning",
    difficulty: "Advanced",
  },
  {
    id: "ai-applications",
    title: "AI Applications",
    description: "Image recognition, NLP, recommendation systems",
    difficulty: "Intermediate",
  },
  {
    id: "ai-ethics",
    title: "AI Ethics",
    description: "Bias, safety, and responsible AI development",
    difficulty: "Beginner",
  },
];

export default function AIKnowledgePage() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <Link
          href="/knowledge"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: 14,
            marginBottom: 16,
            display: "inline-block",
          }}
        >
          ← Back to Knowledge Base
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
          🤖 Artificial Intelligence
        </h1>
        <p style={{ fontSize: 18, color: "#94a3b8" }}>
          Core AI concepts from fundamentals to advanced topics
        </p>
      </div>

      {/* Articles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/knowledge/ai/${article.id}`}
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
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                {article.title}
              </h2>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>
                {article.description}
              </p>
            </div>
            <span
              style={{
                fontSize: 12,
                padding: "4px 12px",
                borderRadius: 16,
                background: "#334155",
                color: "#94a3b8",
              }}
            >
              {article.difficulty}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
