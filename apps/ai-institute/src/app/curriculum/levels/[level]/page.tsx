import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  getModule,
  getModulesByLevel,
  isLevelParam,
  levelParams,
  getAgeBandForLevel,
} from "@/data/curriculum";

interface LevelPageProps {
  params: Promise<{ level: string }>;
}

export function generateStaticParams() {
  return levelParams().map((level) => ({ level }));
}

export async function generateMetadata({
  params,
}: LevelPageProps): Promise<Metadata> {
  const { level } = await params;
  const mod = getModulesByLevel(level as never)[0];
  if (!mod) return {};
  const isAdvanced = /^\d+$/.test(level) && Number(level) >= 7;
  return {
    title: `${mod.level === "jr-a" ? "Junior A" : mod.level === "jr-b" ? "Junior B" : `Level ${mod.level}`}: ${mod.title} — Curriculum — Bhavya Foundation`,
    description: `${mod.mission} — ${mod.duration} · ${mod.handsOnPercent}% hands-on · ${mod.ageBand === "advanced" ? "Advanced · mentor-led" : `Ages ${mod.ageBand}`}`,
  };
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level } = await params;
  if (!isLevelParam(level)) notFound();
  const modules = getModulesByLevel(level as never);
  const isAdvanced = /^\d+$/.test(level) && Number(level) >= 7;
  const ageBand = getAgeBandForLevel(Number(level) || 0);

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
                padding: "var(--space-1) var(--space-4)",
                borderRadius: "var(--radius-full)",
                background: "rgba(14, 56, 46, 0.1)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--color-brand-forest)",
                marginBottom: "var(--space-6)",
              }}
            >
              {level === "jr-a"
                ? "Junior A"
                : level === "jr-b"
                  ? "Junior B"
                  : `Level ${level}`}
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
              {level === "jr-a"
                ? "Junior A — Sprouts"
                : level === "jr-b"
                  ? "Junior B — Explorers"
                  : isAdvanced
                    ? `Advanced Level ${level}`
                    : `Level ${level}`}
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
              {modules[0]?.mission}
            </p>
          </div>
        </section>

        {/* Advanced banner */}
        {isAdvanced && (
          <section
            style={{
              padding: "var(--space-4) 0",
              background: "rgba(106, 124, 82, 0.05)",
              borderTop: "1px solid var(--color-border-primary)",
              borderBottom: "1px solid var(--color-border-primary)",
            }}
          >
            <div className="container mx-auto max-w-5xl px-6 text-center">
              <p style={{ color: "var(--color-earth)", margin: 0 }}>
                <strong>
                  Advanced track — designed for ages 15+ and mentor-led
                  learners.
                </strong>
              </p>
            </div>
          </section>
        )}

        {/* Module cards */}
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
                Modules
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                {modules.length} Modules
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Click any module to explore its objectives, format, and lessons.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {modules.map((m) => (
                <a
                  key={m.id}
                  href={`/curriculum/levels/${level}/${m.id}`}
                  style={{
                    display: "block",
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--color-border-primary)",
                    background: "var(--color-bg-primary)",
                    padding: "var(--space-5)",
                    boxShadow: "var(--shadow-sm)",
                    textDecoration: "none",
                    transition:
                      "transform var(--duration-fast) ease, box-shadow var(--duration-fast) ease, border-color var(--duration-fast) ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    e.currentTarget.style.borderColor =
                      "var(--color-brand-forest)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.borderColor =
                      "var(--color-border-primary)";
                  }}
                >
                  <span
                    className="curriculum-tier-band"
                    style={{
                      display: "inline-block",
                      fontSize: "var(--text-xs)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "var(--color-brand-forest)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {m.ageBand === "advanced"
                      ? "Advanced"
                      : `Ages ${m.ageBand}`}
                  </span>
                  <h3
                    style={{
                      fontWeight: 600,
                      color: "var(--color-brand-forest)",
                      fontSize: "var(--text-lg)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-earth)",
                      marginBottom: "var(--space-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.mission}
                  </p>
                  <p
                    style={{
                      color: "var(--color-earth)",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    {m.duration} · {m.handsOnPercent}% hands-on
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Back */}
        <section
          style={{
            padding: "var(--space-16) 0",
            borderTop: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="container mx-auto max-w-5xl px-6">
            <a
              href="/curriculum"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-5)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-primary)",
                color: "var(--color-brand-forest)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                textDecoration: "none",
                transition: "background var(--duration-fast) ease",
              }}
            >
              <BookOpen size={16} />
              Back to Curriculum
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
