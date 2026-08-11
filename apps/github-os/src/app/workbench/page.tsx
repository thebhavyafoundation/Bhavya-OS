"use client";

import { useState } from "react";
import {
  Hammer,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

const MISSIONS = ["forest", "knowledge", "heritage", "community"] as const;
type Mission = (typeof MISSIONS)[number];

interface Violation {
  rule: string;
  severity: "critical" | "major" | "minor";
  description: string;
  location?: string;
  fix?: string;
}

interface Recommendation {
  priority: "high" | "medium" | "low";
  category: string;
  message: string;
  rationale: string;
}

interface AntiPattern {
  pattern: string;
  detected: boolean;
  severity?: string;
  fix?: string;
}

interface ValidationResult {
  overallScore: number;
  scores: {
    brandAlignment: number;
    missionAlignment: number;
    toneCompliance: number;
    antiPatternScore: number;
    accessibility: number;
    evidenceQuality: number;
  };
  violations: Violation[];
  recommendations: Recommendation[];
  antiPatterns: AntiPattern[];
  missionRelevance: {
    mission: Mission;
    alignmentScore: number;
    notes: string[];
  };
}

function scoreColor(score: number): string {
  if (score >= 80) return "var(--color-accent-green-light)";
  if (score >= 60) return "var(--color-accent-gold)";
  if (score >= 40) return "var(--color-accent-earth)";
  return "var(--color-status-error)";
}

function severityIcon(severity: string) {
  if (severity === "critical" || severity === "error")
    return <XCircle size={14} style={{ color: "var(--color-status-error)" }} />;
  if (severity === "major" || severity === "warning")
    return (
      <AlertTriangle size={14} style={{ color: "var(--color-accent-earth)" }} />
    );
  return (
    <CheckCircle
      size={14}
      style={{ color: "var(--color-accent-green-light)" }}
    />
  );
}

function priorityColor(priority: string): string {
  if (priority === "high") return "var(--color-status-error)";
  if (priority === "medium") return "var(--color-accent-gold)";
  return "var(--color-accent-green-light)";
}

export default function WorkbenchPage() {
  const [description, setDescription] = useState("");
  const [mission, setMission] = useState<Mission>("forest");
  const [typography, setTypography] = useState("");
  const [colorSystem, setColorSystem] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "violations" | "recommendations" | "antiPatterns"
  >("violations");

  async function runValidation() {
    setLoading(true);
    try {
      const res = await fetch("/api/constitutional-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_id: `wb-${Date.now()}`,
          source_type: "workbench",
          input: {
            typography,
            color_system: colorSystem,
            content,
            interaction_patterns: [],
            accessibility: {},
            motion: "",
            imagery: "",
          },
        }),
      });
      const data = await res.json();
      setResults({
        overallScore: data.overall_constitutional_score || 0,
        scores: {
          brandAlignment: data.brand_alignment || 0,
          missionAlignment: data.mission_alignment || 0,
          toneCompliance: data.tone_compliance || 0,
          antiPatternScore: data.anti_pattern_score || 0,
          accessibility: data.accessibility_compliance || 0,
          evidenceQuality: data.evidence_quality || 0,
        },
        violations: data.violations || [],
        recommendations: (data.recommendations || []).map((r: string) => ({
          priority: "medium" as const,
          category: "general",
          message: r,
          rationale: "",
        })),
        antiPatterns: (data.anti_patterns_detected || []).map((ap: string) => ({
          pattern: ap,
          detected: true,
        })),
        missionRelevance: data.mission_relevance
          ? {
              mission: mission,
              alignmentScore: Math.round(
                ((data.mission_relevance[mission] || 0) /
                  Math.max(
                    1,
                    Math.max(
                      ...Object.values(
                        data.mission_relevance as Record<string, number>,
                      ),
                    ),
                  )) *
                  100,
              ),
              notes: Object.entries(
                data.mission_relevance as Record<string, number>,
              )
                .filter(([, v]) => (v as number) > 0)
                .map(
                  ([k]) =>
                    `${k} mission: ${k === mission ? "selected" : "related"}`,
                ),
            }
          : { mission, alignmentScore: 0, notes: [] },
      });
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }

  const tabItems = [
    { key: "violations" as const, label: "Violations" },
    { key: "recommendations" as const, label: "Recommendations" },
    { key: "antiPatterns" as const, label: "Anti-Patterns" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          padding: "2rem",
          overflow: "auto",
        }}
      >
        {/* Input Panel */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Hammer size={20} style={{ color: "var(--color-accent-gold)" }} />
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                color: "var(--color-text-primary)",
                margin: 0,
              }}
            >
              Design Intelligence Workbench
            </h1>
          </div>

          {/* Description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Design Description
            </label>
            <textarea
              aria-label="Design description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the design or component you want to validate..."
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-primary)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                resize: "vertical",
                outline: "2px solid var(--color-border-focus)",
                outlineOffset: "2px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Mission Selector */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Mission
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {MISSIONS.map((m) => (
                <button
                  key={m}
                  aria-pressed={mission === m}
                  onClick={() => setMission(m)}
                  style={{
                    flex: 1,
                    padding: "0.625rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border:
                      mission === m
                        ? "1px solid var(--color-accent-gold)"
                        : "1px solid var(--color-border-primary)",
                    background:
                      mission === m
                        ? "var(--color-accent-gold)"
                        : "var(--color-bg-secondary)",
                    color:
                      mission === m
                        ? "var(--color-text-inverse)"
                        : "var(--color-text-secondary)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    textTransform: "capitalize",
                    cursor: "pointer",
                    fontWeight: mission === m ? 600 : 400,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Typography
            </label>
            <input
              type="text"
              aria-label="Typography"
              value={typography}
              onChange={(e) => setTypography(e.target.value)}
              placeholder="e.g. Playfair Display + Inter"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-primary)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                outline: "2px solid var(--color-border-focus)",
                outlineOffset: "2px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Color System */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Color System
            </label>
            <input
              type="text"
              aria-label="Color system"
              value={colorSystem}
              onChange={(e) => setColorSystem(e.target.value)}
              placeholder="e.g. Forest Green, Warm Ivory, Heritage Gold"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-primary)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                outline: "2px solid var(--color-border-focus)",
                outlineOffset: "2px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Content / Copy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
            }}
          >
            <label
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Content / Copy
            </label>
            <textarea
              aria-label="Content or copy to validate"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the actual text copy or content to validate..."
              rows={5}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border-primary)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                resize: "vertical",
                outline: "2px solid var(--color-border-focus)",
                outlineOffset: "2px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Run Button */}
          <button
            aria-label="Run constitutional validation"
            onClick={runValidation}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.875rem 1.5rem",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: loading
                ? "var(--color-bg-tertiary)"
                : "var(--color-accent-gold)",
              color: loading
                ? "var(--color-text-muted)"
                : "var(--color-text-inverse)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Hammer size={16} />
            Run Constitutional Validation
            <ArrowRight size={16} />
          </button>
        </section>

        {/* Results Panel */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {!results && !loading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: "1rem",
                color: "var(--color-text-muted)",
                textAlign: "center",
                padding: "3rem",
              }}
            >
              <Hammer
                size={48}
                style={{ color: "var(--color-border-primary)" }}
              />
              <p
                style={{
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                Enter your design details and run validation to see results.
              </p>
            </div>
          )}

          {loading && (
            <div
              role="status"
              aria-label="Loading"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid var(--color-border-primary)",
                  borderTopColor: "var(--color-accent-gold)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  marginRight: "0.75rem",
                }}
              />
              Running constitutional validation...
            </div>
          )}

          {results && (
            <>
              {/* Overall Score */}
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border-primary)",
                  background: "var(--color-surface)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.1rem",
                    color: "var(--color-text-primary)",
                    margin: "0 0 1rem 0",
                  }}
                >
                  Constitutional Compliance
                </h2>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: scoreColor(results.overallScore),
                    fontFamily: "var(--font-display)",
                    marginBottom: "1rem",
                  }}
                >
                  {results.overallScore}%
                </div>

                {/* Score Bars */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.625rem",
                  }}
                >
                  {(
                    [
                      {
                        label: "Brand Alignment",
                        value: results.scores.brandAlignment,
                      },
                      {
                        label: "Mission Alignment",
                        value: results.scores.missionAlignment,
                      },
                      {
                        label: "Tone Compliance",
                        value: results.scores.toneCompliance,
                      },
                      {
                        label: "Anti-Pattern Score",
                        value: results.scores.antiPatternScore,
                      },
                      {
                        label: "Accessibility",
                        value: results.scores.accessibility,
                      },
                      {
                        label: "Evidence Quality",
                        value: results.scores.evidenceQuality,
                      },
                    ] as { label: string; value: number }[]
                  ).map((bar) => (
                    <div key={bar.label}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {bar.label}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: scoreColor(bar.value),
                            fontWeight: 600,
                          }}
                        >
                          {bar.value}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "4px",
                          borderRadius: "var(--radius-xs)",
                          background: "var(--color-bg-tertiary)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${bar.value}%`,
                            height: "100%",
                            borderRadius: "var(--radius-xs)",
                            background: scoreColor(bar.value),
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div
                role="tablist"
                style={{
                  display: "flex",
                  gap: "0",
                  borderBottom: "1px solid var(--color-border-primary)",
                }}
              >
                {tabItems.map((tab) => (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      padding: "0.625rem 0.75rem",
                      background: "none",
                      border: "none",
                      borderBottom:
                        activeTab === tab.key
                          ? "2px solid var(--color-accent-gold)"
                          : "2px solid transparent",
                      color:
                        activeTab === tab.key
                          ? "var(--color-text-primary)"
                          : "var(--color-text-muted)",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.8rem",
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {tab.label}
                    <span
                      style={{
                        marginLeft: "0.375rem",
                        padding: "0.125rem 0.375rem",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.7rem",
                        background: "var(--color-bg-tertiary)",
                        color: "var(--color-text-tertiary)",
                      }}
                    >
                      {tab.key === "violations"
                        ? results.violations.length
                        : tab.key === "recommendations"
                          ? results.recommendations.length
                          : results.antiPatterns.length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border-primary)",
                  background: "var(--color-surface)",
                  maxHeight: "400px",
                  overflow: "auto",
                }}
              >
                {activeTab === "violations" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {results.violations.length === 0 && (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          margin: 0,
                          fontSize: "0.85rem",
                        }}
                      >
                        No violations found.
                      </p>
                    )}
                    {results.violations.map((v, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-bg-secondary)",
                          border: "1px solid var(--color-border-primary)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.375rem",
                          }}
                        >
                          {severityIcon(v.severity)}
                          <span
                            style={{
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              fontWeight: 600,
                              color:
                                v.severity === "critical"
                                  ? "var(--color-status-error)"
                                  : v.severity === "major"
                                    ? "var(--color-accent-earth)"
                                    : "var(--color-accent-green-light)",
                            }}
                          >
                            {v.severity}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-secondary)",
                              marginLeft: "auto",
                            }}
                          >
                            {v.rule}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "var(--color-text-primary)",
                            lineHeight: 1.5,
                          }}
                        >
                          {v.description}
                        </p>
                        {v.location && (
                          <p
                            style={{
                              margin: "0.375rem 0 0",
                              fontSize: "0.75rem",
                              color: "var(--color-text-tertiary)",
                              fontStyle: "italic",
                            }}
                          >
                            Location: {v.location}
                          </p>
                        )}
                        {v.fix && (
                          <p
                            style={{
                              margin: "0.375rem 0 0",
                              fontSize: "0.75rem",
                              color: "var(--color-accent-gold)",
                            }}
                          >
                            Fix: {v.fix}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "recommendations" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {results.recommendations.length === 0 && (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          margin: 0,
                          fontSize: "0.85rem",
                        }}
                      >
                        No recommendations at this time.
                      </p>
                    )}
                    {results.recommendations.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-bg-secondary)",
                          border: "1px solid var(--color-border-primary)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.375rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.7rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              fontWeight: 600,
                              color: priorityColor(r.priority),
                              padding: "0.125rem 0.5rem",
                              borderRadius: "var(--radius-xs)",
                              background: "var(--color-bg-tertiary)",
                            }}
                          >
                            {r.priority}
                          </span>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            {r.category}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.85rem",
                            color: "var(--color-text-primary)",
                            lineHeight: 1.5,
                          }}
                        >
                          {r.message}
                        </p>
                        {r.rationale && (
                          <p
                            style={{
                              margin: "0.375rem 0 0",
                              fontSize: "0.75rem",
                              color: "var(--color-text-tertiary)",
                              fontStyle: "italic",
                            }}
                          >
                            {r.rationale}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "antiPatterns" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {results.antiPatterns.length === 0 && (
                      <p
                        style={{
                          color: "var(--color-text-muted)",
                          margin: 0,
                          fontSize: "0.85rem",
                        }}
                      >
                        No anti-patterns detected.
                      </p>
                    )}
                    {results.antiPatterns.map((ap, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--color-bg-secondary)",
                          border: "1px solid var(--color-border-primary)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.375rem",
                          }}
                        >
                          {ap.detected ? (
                            <XCircle
                              size={14}
                              style={{ color: "var(--color-status-error)" }}
                            />
                          ) : (
                            <CheckCircle
                              size={14}
                              style={{
                                color: "var(--color-accent-green-light)",
                              }}
                            />
                          )}
                          <span
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              color: "var(--color-text-primary)",
                            }}
                          >
                            {ap.pattern}
                          </span>
                          {ap.severity && (
                            <span
                              style={{
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color:
                                  ap.severity === "critical"
                                    ? "var(--color-status-error)"
                                    : "var(--color-accent-earth)",
                                marginLeft: "auto",
                              }}
                            >
                              {ap.severity}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8rem",
                            color: ap.detected
                              ? "var(--color-status-error)"
                              : "var(--color-accent-green-light)",
                          }}
                        >
                          {ap.detected ? "Detected" : "Clear"}
                        </p>
                        {ap.fix && (
                          <p
                            style={{
                              margin: "0.375rem 0 0",
                              fontSize: "0.75rem",
                              color: "var(--color-accent-gold)",
                            }}
                          >
                            Fix: {ap.fix}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mission Relevance */}
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border-primary)",
                  background: "var(--color-surface)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.95rem",
                    color: "var(--color-text-primary)",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  Mission Relevance
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontWeight: 600,
                      color: "var(--color-accent-gold)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {results.missionRelevance.mission}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: scoreColor(
                        results.missionRelevance.alignmentScore,
                      ),
                      fontWeight: 600,
                    }}
                  >
                    {results.missionRelevance.alignmentScore}% alignment
                  </span>
                </div>
                {results.missionRelevance.notes.length > 0 && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.375rem",
                    }}
                  >
                    {results.missionRelevance.notes.map((note, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
