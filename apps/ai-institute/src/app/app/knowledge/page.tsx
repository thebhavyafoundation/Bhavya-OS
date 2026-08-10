import type { Metadata } from "next";
import { Search, BookOpen, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Knowledge — My Bhavya",
  description: "Explore the Bhavya Foundation knowledge graph.",
};

const knowledgeObjects = [
  {
    id: "ko-ai-what-is-ai",
    title: "What is Artificial Intelligence?",
    domain: "AI",
    subject: "Computer Science",
    concepts: 5,
    difficulty: "beginner",
  },
  {
    id: "ko-forest-ecosystem-basics",
    title: "Ecosystem Basics",
    domain: "Forest",
    subject: "Environmental Science",
    concepts: 4,
    difficulty: "beginner",
  },
  {
    id: "ko-heritage-cultural-doc",
    title: "Cultural Documentation Methods",
    domain: "Heritage",
    subject: "Anthropology",
    concepts: 3,
    difficulty: "intermediate",
  },
];

export default function KnowledgePage() {
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
            Knowledge
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--text-secondary)",
              marginTop: "var(--space-3)",
            }}
          >
            Explore our connected knowledge graph.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "var(--space-8)",
          }}
        >
          <Search size={18} style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search knowledge objects, concepts, definitions..."
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: "var(--text-base)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          {knowledgeObjects.map((ko) => (
            <div
              key={ko.id}
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "var(--space-3)",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "var(--space-1) var(--space-2)",
                    background: "var(--forest)",
                    color: "var(--bg)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                  }}
                >
                  {ko.domain}
                </div>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                    textTransform: "capitalize",
                  }}
                >
                  {ko.difficulty}
                </span>
              </div>

              <h2
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {ko.title}
              </h2>

              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {ko.subject} · {ko.concepts} concepts
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  color: "var(--forest)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                }}
              >
                Explore
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
