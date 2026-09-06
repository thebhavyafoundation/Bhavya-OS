"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getNodeBySlug,
  getPrerequisites,
  getRelated,
  getNodesByCategory,
} from "@/data/knowledge-graph";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

/* Category colors — mapped to brand-compliant palette */
const categoryColors: Record<string, string> = {
  fundamentals: "var(--color-accent-green)",
  "machine-learning": "var(--color-status-info)",
  "deep-learning": "var(--color-viz-sage)",
  nlp: "var(--color-viz-sage-light)",
  "computer-vision": "var(--color-accent-gold)",
  "generative-ai": "var(--color-viz-gold-light)",
  llm: "var(--color-accent-earth)",
  agents: "var(--color-status-error)",
  rag: "var(--color-viz-earth-light)",
  embeddings: "var(--color-viz-forest-light)",
  infrastructure: "var(--color-text-tertiary)",
  deployment: "var(--color-status-info)",
  ethics: "var(--color-accent-gold)",
  product: "var(--color-accent-earth)",
  research: "var(--color-viz-sage)",
};

export default function ConceptPage() {
  const params = useParams();
  const slug = params.id as string;
  const node = getNodeBySlug(slug);
  const [activeTab, setActiveTab] = useState<
    "overview" | "examples" | "mistakes" | "interview" | "glossary"
  >("overview");

  if (!node) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <SiteHeader />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
              }}
            >
              Concept Not Found
            </h1>
            <Link
              href="/knowledge-graph"
              style={{
                color: "var(--color-accent-gold)",
                textDecoration: "none",
              }}
            >
              ← Back to Knowledge Graph
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const prerequisites = getPrerequisites(node.id);
  const related = getRelated(node.id);
  const sameCategory = getNodesByCategory(node.category).filter(
    (n) => n.id !== node.id,
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <SiteHeader />

      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border-primary)",
          padding: "var(--space-8) var(--space-6)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Link
            href="/knowledge-graph"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "var(--space-4)",
            }}
          >
            ← Back to Knowledge Graph
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "var(--space-4)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                background: `color-mix(in srgb, ${categoryColors[node.category]} 15%, transparent)`,
                color: categoryColors[node.category],
              }}
            >
              {node.title.charAt(0)}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-3xl)",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {node.title}
              </h1>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-lg)",
                }}
              >
                {node.description}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  marginTop: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    fontWeight: 500,
                    background: `color-mix(in srgb, ${categoryColors[node.category]} 15%, transparent)`,
                    color: categoryColors[node.category],
                  }}
                >
                  {node.category
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {node.estimatedMinutes} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-1)",
            marginBottom: "var(--space-8)",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-1)",
          }}
        >
          {(
            [
              "overview",
              "examples",
              "mistakes",
              "interview",
              "glossary",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "all var(--duration-fast) ease",
                background:
                  activeTab === tab ? "var(--color-surface)" : "transparent",
                color:
                  activeTab === tab
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
                boxShadow: activeTab === tab ? "var(--shadow-sm)" : "none",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Why It Exists
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {node.whyItExists}
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                History
              </h2>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {node.history}
              </p>
            </section>

            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Real-World Use Cases
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {node.realWorldUseCases.map((use, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-3)",
                      background: "var(--color-surface)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-4)",
                      border: "1px solid var(--color-border-secondary)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-accent-gold)",
                        marginTop: 2,
                      }}
                    >
                      ▸
                    </span>
                    <span
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {use}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {prerequisites.length > 0 && (
              <section>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  Prerequisites
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prerequisites.map((pre) => (
                    <Link
                      key={pre.id}
                      href={`/concepts/${pre.slug}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-3)",
                        background: "var(--color-surface)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-4)",
                        border: "1px solid var(--color-border-secondary)",
                        textDecoration: "none",
                        color: "inherit",
                        transition: "all var(--duration-fast) ease",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "var(--radius-sm)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "var(--text-xs)",
                          fontWeight: 700,
                          background: `color-mix(in srgb, ${categoryColors[pre.category]} 15%, transparent)`,
                          color: categoryColors[pre.category],
                        }}
                      >
                        {pre.title.charAt(0)}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: 500,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {pre.title}
                        </div>
                        <div
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          {pre.difficulty}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                Related Concepts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/concepts/${rel.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      background: "var(--color-surface)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-4)",
                      border: "1px solid var(--color-border-secondary)",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "all var(--duration-fast) ease",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        background: `color-mix(in srgb, ${categoryColors[rel.category]} 15%, transparent)`,
                        color: categoryColors[rel.category],
                      }}
                    >
                      {rel.title.charAt(0)}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: 500,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {rel.title}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {rel.difficulty}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-6">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
              }}
            >
              Examples
            </h2>
            {node.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-6)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <h3
                  style={{
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {ex.title}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-sm)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {ex.description}
                </p>
                {ex.code && (
                  <pre
                    style={{
                      background: "var(--color-surface-2)",
                      borderRadius: "var(--radius-md)",
                      padding: "var(--space-4)",
                      overflowX: "auto",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-accent-green)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {ex.code}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "mistakes" && (
          <div className="space-y-6">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
              }}
            >
              Common Mistakes
            </h2>
            <div className="space-y-3">
              {node.commonMistakes.map((mistake, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-3)",
                    background:
                      "rgba(var(--color-status-error-rgb, 192, 57, 43), 0.08)",
                    border:
                      "1px solid rgba(var(--color-status-error-rgb, 192, 57, 43), 0.2)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-4)",
                  }}
                >
                  <span
                    style={{ color: "var(--color-status-error)", marginTop: 2 }}
                  >
                    ✗
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {mistake}
                  </span>
                </div>
              ))}
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginTop: "var(--space-8)",
                marginBottom: "var(--space-4)",
              }}
            >
              Interview Questions
            </h2>
            <div className="space-y-3">
              {node.interviewQuestions.map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--space-3)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-4)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-accent-gold)",
                      fontWeight: 700,
                    }}
                  >
                    Q
                  </span>
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {q}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "interview" && (
          <div className="space-y-6">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
              }}
            >
              Interview Questions
            </h2>
            <div className="space-y-3">
              {node.interviewQuestions.map((q, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-5)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--space-3)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-accent-gold)",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      style={{
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {q}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "glossary" && (
          <div className="space-y-6">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
              }}
            >
              Key Terms
            </h2>
            <div className="space-y-3">
              {node.glossary.map((term, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-5)",
                  }}
                >
                  <dt
                    style={{
                      fontWeight: 600,
                      color: "var(--color-accent-gold)",
                      marginBottom: "var(--space-1)",
                    }}
                  >
                    {term.term}
                  </dt>
                  <dd
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {term.definition}
                  </dd>
                </div>
              ))}
            </div>

            {node.references.length > 0 && (
              <>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    marginTop: "var(--space-8)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  References
                </h2>
                <div className="space-y-3">
                  {node.references.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border-primary)",
                        borderRadius: "var(--radius-md)",
                        padding: "var(--space-5)",
                        textDecoration: "none",
                        color: "inherit",
                        transition: "all var(--duration-fast) ease",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-accent-gold)",
                            fontWeight: 500,
                          }}
                        >
                          {ref.title}
                        </span>
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-text-muted)",
                            padding: "2px 8px",
                            borderRadius: "var(--radius-full)",
                            background: "var(--color-surface-2)",
                          }}
                        >
                          {ref.type}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Same Category */}
        {sameCategory.length > 0 && (
          <section
            style={{
              marginTop: "var(--space-12)",
              paddingTop: "var(--space-8)",
              borderTop: "1px solid var(--color-border-primary)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-4)",
              }}
            >
              More in{" "}
              {node.category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sameCategory.slice(0, 4).map((n) => (
                <Link
                  key={n.id}
                  href={`/concepts/${n.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-4)",
                    border: "1px solid var(--color-border-secondary)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all var(--duration-fast) ease",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      background: `color-mix(in srgb, ${categoryColors[n.category]} 15%, transparent)`,
                      color: categoryColors[n.category],
                    }}
                  >
                    {n.title.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        color: "var(--color-text-primary)",
                      }}
                    >
                      {n.title}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {n.difficulty} • {n.estimatedMinutes} min
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
