"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  GraduationCap,
  AlertTriangle,
  Lightbulb,
  Target,
  Link2,
} from "lucide-react";

interface Concept {
  name: string;
  description: string;
  difficulty: string;
}

interface Definition {
  term: string;
  definition: string;
}

interface Example {
  title: string;
  description: string;
}

interface Misconception {
  belief: string;
  correction: string;
}

interface Exercise {
  prompt: string;
  type: string;
  difficulty: string;
  answer?: string;
}

interface KnowledgeObject {
  id: string;
  title: string;
  domain: string;
  subject?: string;
  grade?: number;
  description?: string;
  concepts: Concept[];
  definitions: Definition[];
  examples: Example[];
  misconceptions: Misconception[];
  exercises: Exercise[];
  prerequisites: string[];
  related: string[];
  metadata: Record<string, unknown>;
  provenance?: string;
  status?: string;
}

interface KOListSummary {
  id: string;
  title: string;
  domain: string;
  provenance?: string;
  status?: string;
}

// TODO: reference design tokens — these hex values are data-mapped for runtime use
const domainColors: Record<string, string> = {
  AI: "#3b82f6",
  Forest: "#22c55e",
  Heritage: "#f59e0b",
  Community: "#8b5cf6",
};

const statusColors: Record<string, string> = {
  draft: "var(--text-tertiary)",
  published: "#22c55e",
};

const provenanceLabels: Record<string, string> = {
  institutional: "Institutional",
  "test-seed": "Test",
  imported: "Imported",
};

export default function KnowledgePage() {
  const [knowledgeObjects, setKnowledgeObjects] = useState<KnowledgeObject[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [expandedKo, setExpandedKo] = useState<string | null>(null);

  useEffect(() => {
    const fetchKOs = async () => {
      try {
        // Fetch KO list from Studio API
        const listRes = await fetch("/api/studio/knowledge");
        if (!listRes.ok) throw new Error("Failed to fetch KOs");
        const summaries: KOListSummary[] = await listRes.json();

        // Fetch full details for each KO
        const fullKos = await Promise.all(
          summaries.map(async (summary) => {
            try {
              const detailRes = await fetch(
                `/api/studio/knowledge/${summary.id}`,
              );
              if (detailRes.ok) {
                return await detailRes.json();
              }
              return summary as unknown as KnowledgeObject;
            } catch {
              return summary as unknown as KnowledgeObject;
            }
          }),
        );

        setKnowledgeObjects(fullKos);
      } catch {
        // API not available
      } finally {
        setLoading(false);
      }
    };
    fetchKOs();
  }, []);

  const domains = [...new Set(knowledgeObjects.map((ko) => ko.domain))];

  const filteredKos = knowledgeObjects.filter((ko) => {
    const matchesSearch =
      !searchQuery ||
      ko.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ko.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ko.concepts?.some((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesDomain = !selectedDomain || ko.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
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
                Explore and create knowledge objects for the community.
              </p>
            </div>
            <Link
              href="/app/knowledge/new"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                background: "var(--forest)",
                color: "var(--bg)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Plus size={16} />
              Create KO
            </Link>
          </div>
        </header>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "var(--space-4)",
          }}
        >
          <Search size={18} style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search knowledge objects, concepts, definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Domain filter */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginBottom: "var(--space-8)",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setSelectedDomain(null)}
            style={{
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              border: "1px solid var(--border)",
              background:
                selectedDomain === null ? "var(--forest)" : "transparent",
              color:
                selectedDomain === null ? "var(--bg)" : "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            All
          </button>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() =>
                setSelectedDomain(selectedDomain === domain ? null : domain)
              }
              style={{
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                border: "1px solid var(--border)",
                background:
                  selectedDomain === domain
                    ? domainColors[domain] || "var(--forest)"
                    : "transparent",
                color:
                  selectedDomain === domain
                    ? "var(--bg)"
                    : "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "var(--space-12)",
              color: "var(--text-secondary)",
            }}
          >
            Loading knowledge objects...
          </div>
        ) : filteredKos.length === 0 ? (
          <div
            style={{
              padding: "var(--space-12)",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto var(--space-4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <BookOpen size={32} style={{ color: "var(--text-secondary)" }} />
            </div>
            <h3
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-2)",
              }}
            >
              No knowledge objects yet
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                maxWidth: 400,
                margin: "0 auto var(--space-4)",
              }}
            >
              Knowledge objects will appear here as they are created through the
              content pipeline.
            </p>
            <Link
              href="/app/knowledge/new"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                background: "var(--forest)",
                color: "var(--bg)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Plus size={16} />
              Create your first KO
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {filteredKos.map((ko) => {
              const isExpanded = expandedKo === ko.id;
              const color = domainColors[ko.domain] || "var(--forest)";

              return (
                <div
                  key={ko.id}
                  style={{
                    background: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedKo(isExpanded ? null : ko.id)}
                    style={{
                      width: "100%",
                      padding: "var(--space-5)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-4)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: color + "20",
                        borderRadius: "var(--radius-md)",
                        flexShrink: 0,
                      }}
                    >
                      <BookOpen size={20} style={{ color }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-2)",
                          marginBottom: "var(--space-1)",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "var(--text-base)",
                            fontWeight: 700,
                            color: "var(--text)",
                          }}
                        >
                          {ko.title}
                        </h3>
                        <span
                          style={{
                            padding: "2px 8px",
                            background: color + "20",
                            color,
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                          }}
                        >
                          {ko.domain}
                        </span>
                        {/* Status badge */}
                        <span
                          style={{
                            padding: "2px 8px",
                            background:
                              (statusColors[ko.status || "draft"] ||
                                "var(--text-tertiary)") + "20",
                            color:
                              statusColors[ko.status || "draft"] ||
                              "var(--text-tertiary)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {ko.status || "draft"}
                        </span>
                        {/* Provenance badge */}
                        {ko.provenance && ko.provenance !== "institutional" && (
                          <span
                            style={{
                              padding: "2px 8px",
                              background: "var(--border)",
                              color: "var(--text-tertiary)",
                              borderRadius: "var(--radius-sm)",
                              fontSize: "var(--text-xs)",
                              fontWeight: 600,
                            }}
                          >
                            {provenanceLabels[ko.provenance] || ko.provenance}
                          </span>
                        )}
                      </div>
                      {ko.description && (
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--text-secondary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ko.description}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: "var(--space-4)",
                          marginTop: "var(--space-2)",
                          fontSize: "var(--text-xs)",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        <span>{ko.concepts?.length || 0} concepts</span>
                        <span>{ko.definitions?.length || 0} definitions</span>
                        <span>{ko.examples?.length || 0} examples</span>
                        {ko.prerequisites && ko.prerequisites.length > 0 && (
                          <span>{ko.prerequisites.length} prerequisites</span>
                        )}
                        {ko.related && ko.related.length > 0 && (
                          <span>{ko.related.length} related</span>
                        )}
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronDown
                        size={16}
                        style={{ color: "var(--text-tertiary)" }}
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        style={{ color: "var(--text-tertiary)" }}
                      />
                    )}
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "0 var(--space-5) var(--space-5)",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "var(--space-5)",
                          marginTop: "var(--space-5)",
                        }}
                      >
                        {/* Concepts */}
                        {ko.concepts && ko.concepts.length > 0 && (
                          <div>
                            <h4
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: "var(--space-3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                              }}
                            >
                              <Target size={14} />
                              Concepts
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                              }}
                            >
                              {ko.concepts.map((concept, i) => (
                                <div
                                  key={i}
                                  style={{
                                    padding: "var(--space-3)",
                                    background: "var(--bg)",
                                    borderRadius: "var(--radius-md)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: 600,
                                      color: "var(--text)",
                                    }}
                                  >
                                    {concept.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color: "var(--text-secondary)",
                                      marginTop: "var(--space-1)",
                                    }}
                                  >
                                    {concept.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Definitions */}
                        {ko.definitions && ko.definitions.length > 0 && (
                          <div>
                            <h4
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: "var(--space-3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                              }}
                            >
                              <BookOpen size={14} />
                              Definitions
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                              }}
                            >
                              {ko.definitions.map((def, i) => (
                                <div
                                  key={i}
                                  style={{
                                    padding: "var(--space-3)",
                                    background: "var(--bg)",
                                    borderRadius: "var(--radius-md)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: 600,
                                      color: "var(--text)",
                                    }}
                                  >
                                    {def.term}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color: "var(--text-secondary)",
                                      marginTop: "var(--space-1)",
                                    }}
                                  >
                                    {def.definition}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Examples */}
                        {ko.examples && ko.examples.length > 0 && (
                          <div>
                            <h4
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: "var(--space-3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                              }}
                            >
                              <Lightbulb size={14} />
                              Examples
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                              }}
                            >
                              {ko.examples.map((ex, i) => (
                                <div
                                  key={i}
                                  style={{
                                    padding: "var(--space-3)",
                                    background: "var(--bg)",
                                    borderRadius: "var(--radius-md)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: 600,
                                      color: "var(--text)",
                                    }}
                                  >
                                    {ex.title}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color: "var(--text-secondary)",
                                      marginTop: "var(--space-1)",
                                    }}
                                  >
                                    {ex.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Misconceptions */}
                        {ko.misconceptions && ko.misconceptions.length > 0 && (
                          <div>
                            <h4
                              style={{
                                fontSize: "var(--text-sm)",
                                fontWeight: 700,
                                color: "var(--text)",
                                marginBottom: "var(--space-3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--space-2)",
                              }}
                            >
                              <AlertTriangle size={14} />
                              Common Misconceptions
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "var(--space-2)",
                              }}
                            >
                              {ko.misconceptions.map((mc, i) => (
                                <div
                                  key={i}
                                  style={{
                                    padding: "var(--space-3)",
                                    background: "var(--bg)",
                                    borderRadius: "var(--radius-md)",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color:
                                        "var(--color-status-error, #ef4444)",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Misconception: {mc.belief}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: "var(--text-xs)",
                                      color:
                                        "var(--color-accent-green, #22c55e)",
                                      marginTop: "var(--space-1)",
                                    }}
                                  >
                                    Correction: {mc.correction}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Prerequisites and Related */}
                      {((ko.prerequisites && ko.prerequisites.length > 0) ||
                        (ko.related && ko.related.length > 0)) && (
                        <div
                          style={{
                            marginTop: "var(--space-5)",
                            paddingTop: "var(--space-5)",
                            borderTop: "1px solid var(--border)",
                          }}
                        >
                          <div
                            style={{ display: "flex", gap: "var(--space-6)" }}
                          >
                            {ko.prerequisites &&
                              ko.prerequisites.length > 0 && (
                                <div>
                                  <h4
                                    style={{
                                      fontSize: "var(--text-sm)",
                                      fontWeight: 700,
                                      color: "var(--text)",
                                      marginBottom: "var(--space-2)",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--space-2)",
                                    }}
                                  >
                                    <GraduationCap size={14} />
                                    Prerequisites
                                  </h4>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "var(--space-2)",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {ko.prerequisites.map((prereq, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          padding:
                                            "var(--space-1) var(--space-3)",
                                          background: "var(--border)",
                                          borderRadius: "var(--radius-sm)",
                                          fontSize: "var(--text-xs)",
                                          color: "var(--text-secondary)",
                                        }}
                                      >
                                        {prereq}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            {ko.related && ko.related.length > 0 && (
                              <div>
                                <h4
                                  style={{
                                    fontSize: "var(--text-sm)",
                                    fontWeight: 700,
                                    color: "var(--text)",
                                    marginBottom: "var(--space-2)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--space-2)",
                                  }}
                                >
                                  <Link2 size={14} />
                                  Related
                                </h4>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "var(--space-2)",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {ko.related.map((rel, i) => (
                                    <span
                                      key={i}
                                      style={{
                                        padding:
                                          "var(--space-1) var(--space-3)",
                                        background: "var(--border)",
                                        borderRadius: "var(--radius-sm)",
                                        fontSize: "var(--text-xs)",
                                        color: "var(--text-secondary)",
                                      }}
                                    >
                                      {rel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
