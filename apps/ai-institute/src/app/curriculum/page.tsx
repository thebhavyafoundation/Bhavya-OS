import type { Metadata } from "next";
import { AICurriculumTimeline } from "@/components/curriculum/AICurriculumTimeline";
import {
  BookOpen,
  ArrowRight,
  Users,
  Code,
  Lightbulb,
  Building,
} from "lucide-react";
import {
  TRACKS,
  getTrackCount,
  getTotalModules,
  levelParams,
  getModulesByLevel,
} from "@/data/curriculum";

export const metadata: Metadata = {
  title: "Bhavya Academy Curriculum — 86 Modules, 4 Tracks, Ages 6–18",
  description:
    "Explore the Bhavya Academy AI curriculum: four learning tracks, 86 modules for ages 6–18, aligned to United States, China, UNESCO, and OECD AI education standards.",
};

const journeyStages = [
  {
    icon: Users,
    title: "Visitor",
    description:
      "Begin your journey. Explore AI, understand its potential, and discover how technology can serve communities.",
  },
  {
    icon: Code,
    title: "Builder",
    description:
      "Create AI-powered applications, agents, and automation systems. Develop practical skills through hands-on projects.",
  },
  {
    icon: Lightbulb,
    title: "Contributor",
    description:
      "Contribute to open source, conduct research, and build products that solve real-world problems.",
  },
  {
    icon: BookOpen,
    title: "Mentor",
    description:
      "Guide and teach others. Share knowledge, lead workshops, and help the next generation of learners.",
  },
  {
    icon: Building,
    title: "Institution Builder",
    description:
      "Build and lead educational institutions. Create self-sustaining learning ecosystems that serve communities for generations.",
  },
];

export default function CurriculumPage() {
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
          <div
            className="container"
            style={{ textAlign: "center", maxWidth: "720px" }}
          >
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
              Academy / Curriculum
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
              A Curriculum Designed for Transformation
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
              The Bhavya Academy curriculum is a structured, progressive
              learning path — from AI foundations to institution building.{" "}
              <strong>
                {getTotalModules()} modules across 4 learning tracks.
              </strong>{" "}
              One transformation journey.
            </p>
          </div>
        </section>

        {/* Track Cards */}
        <section style={{ padding: "var(--space-16) 0" }}>
          <div className="container">
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
                Learning Tracks
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                Four Tracks, Four Bands
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Each track serves a developmental band with age-appropriate
                content, hands-on labs, and real projects. Progress through all
                tracks to complete the full curriculum.
              </p>
            </div>
            <div
              className="curriculum-tier-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {TRACKS.map((t) => (
                <a
                  key={t.id}
                  className="curriculum-tier"
                  href={
                    t.levels.length === 1
                      ? `/curriculum/levels/${t.levels[0]}`
                      : `/curriculum#levels`
                  }
                  style={{
                    display: "block",
                    padding: "var(--space-5)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    borderRadius: "var(--radius-lg)",
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
                    {t.bandLabel}
                  </span>
                  <h3
                    style={{
                      fontWeight: 600,
                      color: "var(--color-brand-forest)",
                      fontSize: "var(--text-lg)",
                      marginBottom: "var(--space-2)",
                    }}
                  >
                    {t.label}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-earth)",
                      marginBottom: "var(--space-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {getTrackCount(t.id)} modules · {t.levels.length}{" "}
                    {t.levels.length === 1 ? "level" : "levels"}
                  </p>
                  <span
                    className="curriculum-tier-cta"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--space-1)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 500,
                      color: "var(--color-brand-forest)",
                    }}
                  >
                    Explore →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Full Level Index */}
        <section
          id="levels"
          style={{
            padding: "var(--space-16) 0",
            borderTop: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="container">
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
                All Levels
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                Complete Level Index
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Click any level to explore its modules and learning objectives.
              </p>
            </div>
            <div
              className="curriculum-tier-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {levelParams().map((l) => {
                const modules = getModulesByLevel(l as never);
                const isAdvanced = /^\d+$/.test(l) && Number(l) >= 7;
                return (
                  <a
                    key={l}
                    className="curriculum-tier"
                    href={`/curriculum/levels/${l}`}
                    style={{
                      display: "block",
                      padding: "var(--space-5)",
                      background: "var(--color-bg-primary)",
                      border: "1px solid var(--color-border-primary)",
                      borderRadius: "var(--radius-lg)",
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
                      {l === "jr-a"
                        ? "Ages 6–8"
                        : l === "jr-b"
                          ? "Ages 9–11"
                          : isAdvanced
                            ? "Advanced · 15+"
                            : "Ages 12–15"}
                    </span>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: "var(--color-brand-forest)",
                        fontSize: "var(--text-lg)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      {l === "jr-a"
                        ? "Junior A"
                        : l === "jr-b"
                          ? "Junior B"
                          : `Level ${l}`}
                    </h3>
                    <p
                      style={{
                        color: "var(--color-earth)",
                        marginBottom: "var(--space-3)",
                        lineHeight: 1.5,
                      }}
                    >
                      {modules.length} modules
                    </p>
                    <span
                      className="curriculum-tier-cta"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-1)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        color: "var(--color-brand-forest)",
                      }}
                    >
                      Open →
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Full Path - preserved from original */}
        <section style={{ padding: "var(--space-16) 0" }}>
          <div className="container">
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
                The Full Path
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                86 Modules, Ages 6–18
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Four bands, from first encounters with machines to
                research-grade capstones — each module aligned to recognized AI
                education standards. Your progress is saved as you go.
              </p>
            </div>
            <AICurriculumTimeline />
          </div>
        </section>

        {/* Transformation Journey - preserved from original */}
        <section
          style={{
            padding: "var(--space-16) 0",
            borderTop: "1px solid var(--color-border-primary)",
          }}
        >
          <div className="container">
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
                The Transformation Journey
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                From Visitor to Institution Builder
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                The curriculum is designed not just to teach skills, but to
                transform learners into leaders who can build institutions that
                serve communities.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {journeyStages.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.title}
                    style={{
                      padding: "var(--space-5)",
                      background: "var(--color-bg-primary)",
                      border: "1px solid var(--color-border-primary)",
                      borderRadius: "var(--radius-lg)",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "var(--radius-md)",
                        background: "rgba(14, 56, 46, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      <Icon
                        size={20}
                        style={{ color: "var(--color-brand-forest)" }}
                      />
                    </div>
                    <h3
                      style={{
                        fontWeight: 600,
                        color: "var(--color-brand-forest)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {stage.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-earth)",
                        marginTop: "var(--space-1)",
                        lineHeight: 1.5,
                      }}
                    >
                      {stage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA - preserved from original */}
        <section
          style={{
            padding: "var(--space-16) 0",
            borderTop: "1px solid rgba(106, 124, 82, 0.1)",
          }}
        >
          <div className="container">
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
                Start Your Journey
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl, 1.5rem)",
                  fontWeight: 400,
                  color: "var(--color-brand-forest)",
                }}
              >
                Begin With Level 0
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                No prior experience required. The curriculum starts with digital
                foundations and progressively builds to advanced AI skills.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/curriculum/levels/0"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-brand-forest)",
                  color: "white",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "opacity var(--duration-fast) ease",
                }}
              >
                <BookOpen size={16} />
                Start Level 0
                <ArrowRight size={16} />
              </a>
              <a
                href="/curriculum/levels"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-3) var(--space-5)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid rgba(106, 124, 82, 0.2)",
                  color: "var(--color-brand-forest)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "background var(--duration-fast) ease",
                }}
              >
                View All Levels
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
