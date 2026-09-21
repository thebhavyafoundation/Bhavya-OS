import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { curriculum, getTotalModules } from "@/data/curriculum-levels";
import {
  BookOpen,
  ArrowRight,
  Users,
  Code,
  Lightbulb,
  Building,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bhavya Academy Curriculum — 13 Levels of AI Mastery",
  description:
    "Explore the Bhavya Academy curriculum: 13 progressive levels from Digital Foundations to Institution Building, designed to transform learners into builders and leaders.",
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
  const totalModules = getTotalModules();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="min-h-screen">
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
              learning path — from digital foundations to institution building.{" "}
              <strong>13 levels. {totalModules} modules.</strong> One
              transformation journey.
            </p>
          </div>
        </section>

        {/* All Levels */}
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
                13 Levels of Progressive Learning
              </h2>
              <p
                style={{
                  color: "var(--color-earth)",
                  marginTop: "var(--space-2)",
                  maxWidth: "600px",
                  lineHeight: 1.6,
                }}
              >
                Each level builds on the previous, combining theoretical
                understanding with hands-on practice.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {curriculum.map((level) => (
                <a
                  key={level.level}
                  href={`/curriculum/levels/${level.level}`}
                  className="curriculum-tier"
                  style={{
                    position: "relative",
                    padding: "var(--space-5)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    borderRadius: "var(--radius-lg)",
                    textDecoration: "none",
                    transition: "all var(--duration-normal) var(--ease-out)",
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
                        borderRadius: "var(--radius-md)",
                        background: "rgba(14, 56, 46, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "var(--text-sm)",
                        fontWeight: 700,
                        color: "var(--color-brand-forest)",
                      }}
                    >
                      L{level.level}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <h3
                        style={{
                          fontWeight: 600,
                          color: "var(--color-brand-forest)",
                          fontSize: "var(--text-sm)",
                        }}
                      >
                        Level {level.level}: {level.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "var(--text-sm)",
                          color: "var(--color-earth)",
                          marginTop: "var(--space-1)",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {level.mission}
                      </p>
                      <p
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "rgba(106, 124, 82, 0.6)",
                          marginTop: "var(--space-2)",
                        }}
                      >
                        {level.duration} · {level.moduleCount} modules ·{" "}
                        {level.handsOnPercent}% hands-on
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    style={{
                      position: "absolute",
                      right: "var(--space-4)",
                      top: "50%",
                      transform: "translateY(-50%)",
                      opacity: 0,
                      transition: "opacity var(--duration-fast) ease",
                      color: "var(--color-brand-forest)",
                    }}
                    className="group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Transformation Journey */}
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

        {/* CTA */}
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
      </main>
      <SiteFooter />
    </>
  );
}
