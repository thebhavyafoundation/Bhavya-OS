import Link from "next/link";
import type { AIStandard, AIModule } from "@/types/curriculum";
import type { Lesson } from "@/data/curriculum";
import { DiagramRenderer } from "./diagram/DiagramRenderer";

/**
 * ModuleConceptMap — how a module fits into the curriculum.
 *
 * A module page used to state a title, a description and a list of lessons.
 * That tells a reader what the module is called and what is inside it, but
 * not where it sits: what has to come first, what the module is for, what
 * the learner will actually do inside it, and what it is accountable to.
 *
 * The map is built from the live registry, so it cannot drift:
 *
 *   1. Builds on     the modules that come before this one
 *   2. This module  its learning objective, in the registry's own words
 *   3. Lessons      the published lessons, in order, with links
 *   4. Standards    the education standards the module is mapped to
 *
 * It is an HTML map rather than an SVG because every part of it is already
 * text: it reads correctly at 320px, it works without a network round trip
 * for a separate asset, and a screen reader gets the same order the eye does.
 * Where a module's own concept visual exists, it is shown with the same
 * text-equivalent treatment every other concept visual gets.
 */
export interface ModuleConceptMapProps {
  module: AIModule;
  prerequisites: readonly AIModule[];
  lessons: readonly Lesson[];
  standards: readonly AIStandard[];
}

export function ModuleConceptMap({
  module,
  prerequisites,
  lessons,
  standards,
}: ModuleConceptMapProps) {
  const conceptVisual = lessons
    .flatMap((lesson) => lesson.blocks)
    .find((block) => block.kind === "visual");

  const stageStyle = {
    borderLeft: "2px solid var(--color-border-primary)",
    paddingLeft: "var(--space-4)",
  };

  const stageLabel = {
    fontSize: "var(--text-xs)",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-secondary)",
    marginBottom: "var(--space-2)",
  };

  return (
    <section className="ai-section" aria-labelledby="module-map-heading">
      <h2 id="module-map-heading" className="ai-section-title">
        Where this module sits
      </h2>

      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gap: "var(--space-5)",
        }}
      >
        <li style={stageStyle}>
          <p style={stageLabel}>Builds on</p>
          {prerequisites.length > 0 ? (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              {prerequisites.map((prerequisite) => (
                <li key={prerequisite.id}>
                  <Link
                    href={`/curriculum/modules/${prerequisite.id}`}
                    className="ai-chip"
                  >
                    {prerequisite.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
              Nothing before this one. It is a starting point in its band.
            </p>
          )}
        </li>

        <li style={stageStyle}>
          <p style={stageLabel}>This module</p>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-primary)",
            }}
          >
            {module.learningObjective}
          </p>
          <div className="ai-chip-row" style={{ marginTop: "var(--space-3)" }}>
            {module.topics.map((topic) => (
              <span key={topic} className="ai-chip">
                {topic}
              </span>
            ))}
          </div>
        </li>

        <li style={stageStyle}>
          <p style={stageLabel}>Lessons</p>
          {lessons.length > 0 ? (
            <ol style={{ margin: 0, paddingLeft: "var(--space-4)" }}>
              {lessons.map((lesson, index) => (
                <li key={lesson.id} style={{ marginBottom: "var(--space-2)" }}>
                  <Link
                    href={`/curriculum/modules/${module.id}/lessons/${lesson.id}`}
                    className="ai-lesson-link"
                  >
                    <span className="ai-lesson-index" aria-hidden="true">
                      {index + 1}
                    </span>
                    {lesson.title}
                  </Link>{" "}
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    · {lesson.durationMin} min
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
              Not yet written. The module's outcomes and prerequisites are on
              record; its lessons are still being authored.
            </p>
          )}
        </li>

        <li style={stageStyle}>
          <p style={stageLabel}>Standards</p>
          {standards.length > 0 ? (
            <div className="ai-chip-row">
              {standards.map((standard) => (
                <span
                  key={standard.id}
                  className="ai-chip"
                  title={`${standard.source} — ${standard.gradeBand}`}
                >
                  {standard.concept}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
              Not mapped to a published standard yet.
            </p>
          )}
        </li>
      </ol>

      {conceptVisual && conceptVisual.kind === "visual" ? (
        <div style={{ marginTop: "var(--space-8)" }}>
          <p
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-3)",
            }}
          >
            Concept visual
          </p>
          <DiagramRenderer spec={conceptVisual.diagram} />
        </div>
      ) : null}
    </section>
  );
}
