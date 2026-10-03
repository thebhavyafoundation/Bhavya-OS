import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  levelParams,
  getModulesByLevel,
  getAgeBandForLevel,
} from "@/data/curriculum";

export const metadata: Metadata = {
  title: "Academy Levels — 15 Levels of AI Mastery — Bhavya Foundation",
  description:
    "Explore all 15 levels of the Bhavya Academy curriculum — from Junior A (ages 6–8) through Junior B (ages 9–11), Core (ages 12–15), and Advanced (15+).",
};

export default function LevelsPage() {
  return (
    <>
      <div id="main-content" className="min-h-screen">
        {/* Hero */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(to bottom, rgba(14, 56, 46, 0.05), transparent)",
            padding: "var(--space-24) 0 var(--space-16)",
          }}
        >
          <div className="container mx-auto max-w-5xl px-6 text-center">
            <span
              style={{
                display: "inline-block",
                borderRadius: "var(--radius-full)",
                background: "rgba(14, 56, 46, 0.1)",
                padding: "var(--space-1) var(--space-4)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-brand-forest)",
                marginBottom: "var(--space-6)",
              }}
            >
              Academy / Levels
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.25rem, 5vw, 3rem)",
                fontWeight: 400,
                color: "var(--color-brand-forest)",
                marginBottom: "var(--space-6)",
                lineHeight: 1.2,
              }}
            >
              15 Levels, One Transformation
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-earth)",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Each level is a complete learning unit — mission, duration,
              hands-on percentage, outcome, and modules. Progress through all 15
              to become an Institution Builder.
            </p>
          </div>
        </section>

        {/* Levels Grid */}
        <section style={{ padding: "var(--space-16) 0" }}>
          <div className="container mx-auto max-w-6xl px-6">
            <div style={{ marginBottom: "var(--space-10)" }}>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-brand-forest)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Complete Curriculum
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                All Levels
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Click any level to explore its mission, modules, and hands-on
                components.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {levelParams().map((level) => {
                const modules = getModulesByLevel(level as never);
                const ageBand = getAgeBandForLevel(Number(level) || 0);
                return (
                  <a
                    key={level}
                    href={`/curriculum/levels/${level}`}
                    style={{
                      display: "block",
                      borderRadius: "var(--radius-xl)",
                      border: "1px solid rgba(106, 124, 82, 0.1)",
                      background: "white",
                      padding: "var(--space-5)",
                      boxShadow: "var(--shadow-sm)",
                      transition: "all var(--duration-normal) ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                      e.currentTarget.style.borderColor =
                        "rgba(106, 124, 82, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                      e.currentTarget.style.borderColor =
                        "rgba(106, 124, 82, 0.1)";
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
                          flexShrink: 0,
                          width: "40px",
                          height: "40px",
                          borderRadius: "var(--radius-lg)",
                          background: "rgba(14, 56, 46, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          color: "var(--color-brand-forest)",
                        }}
                      >
                        {level === "jr-a"
                          ? "JA"
                          : level === "jr-b"
                            ? "JB"
                            : `L${level}`}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <h3
                          style={{
                            fontWeight: 600,
                            color: "var(--color-brand-forest)",
                          }}
                        >
                          {level === "jr-a"
                            ? "Junior A"
                            : level === "jr-b"
                              ? "Junior B"
                              : `Level ${level}`}
                        </h3>
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--color-earth)",
                            marginTop: "var(--space-1)",
                          }}
                        >
                          {modules.map((m) => m.title).join(" · ")}
                        </p>
                        <p
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-earth)",
                            marginTop: "var(--space-1)",
                          }}
                        >
                          {modules.length} modules ·{" "}
                          {ageBand === "advanced"
                            ? "Advanced"
                            : `Ages ${ageBand}`}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Summary Table */}
        <section
          style={{
            padding: "var(--space-16) 0",
            borderTop: "1px solid rgba(106, 124, 82, 0.1)",
          }}
        >
          <div className="container mx-auto max-w-6xl px-6">
            <div style={{ marginBottom: "var(--space-10)" }}>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--color-brand-forest)",
                  marginBottom: "var(--space-2)",
                }}
              >
                Quick Reference
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                Level Summary
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              {levelParams().map((level) => {
                const modules = getModulesByLevel(level as never);
                const ageBand = getAgeBandForLevel(Number(level) || 0);
                return (
                  <div
                    key={level}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid rgba(106, 124, 82, 0.1)",
                      background: "white",
                      padding: "var(--space-4)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: "var(--text-sm)",
                          color: "var(--color-brand-forest)",
                        }}
                      >
                        {level === "jr-a"
                          ? "Junior A"
                          : level === "jr-b"
                            ? "Junior B"
                            : `Level ${level}`}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--color-earth)",
                          marginTop: "var(--space-1)",
                        }}
                      >
                        {modules.length} modules ·{" "}
                        {ageBand === "advanced"
                          ? "Advanced"
                          : `Ages ${ageBand}`}
                      </div>
                    </div>
                    <a
                      href={`/curriculum/levels/${level}`}
                      aria-label={`Go to ${level === "jr-a" ? "Junior A" : level === "jr-b" ? "Junior B" : `Level ${level}`}`}
                      style={{
                        flexShrink: 0,
                        color: "var(--color-brand-forest)",
                      }}
                    >
                      <ArrowRight size={16} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
