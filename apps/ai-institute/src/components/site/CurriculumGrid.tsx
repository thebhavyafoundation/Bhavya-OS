"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CurriculumCard } from "./CurriculumCard";
import { getAllModules } from "@/data/curriculum";

interface CurriculumGridProps {
  /** Modules to display; defaults to the full canonical catalog. */
  modules?: typeof getAllModules extends () => infer T ? T : never;
  /** Maximum number of cards to render. */
  limit?: number;
  /**
   * Columns for the grid, as a CSS `grid-template-columns` value.
   *
   * The value has to be a real CSS value. It used to be a list of Tailwind
   * utilities assigned to the inline `gridTemplateColumns` style, which is
   * not CSS: the declaration was dropped, the grid fell back to an implicit
   * auto column, and an auto column is sized to its content's max-content
   * width. The grid then refused to shrink below that and pushed the page
   * into horizontal overflow on a phone.
   *
   * `minmax(min(100%, 260px), 1fr)` is used rather than a fixed track so
   * that the column can always shrink to fit the container.
   */
  cols?: string;
  /** Stagger delay between card reveals (seconds). */
  stagger?: number;
  className?: string;
}

const DEFAULT_COLS = "repeat(auto-fit, minmax(min(100%, 260px), 1fr))";

/**
 * CurriculumGrid — a responsive grid of CurriculumCard, each revealed on scroll
 * via ScrollReveal (the repo's lightest approved motion path: WAAPI +
 * apple-springs, gated by prefers-reduced-motion). No new animation library is
 * introduced.
 *
 * @module site/components/CurriculumGrid
 */
export function CurriculumGrid({
  modules: modulesProp,
  limit,
  cols = DEFAULT_COLS,
  stagger = 0.08,
  className = "",
}: CurriculumGridProps) {
  const modules = (modulesProp ?? getAllModules()).slice(0, limit);

  return (
    <section
      className={`curriculum-grid ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: cols,
        gap: "var(--space-6)",
      }}
      aria-label="Curriculum modules"
    >
      {modules.map((module, index) => (
        <ScrollReveal
          key={module.id}
          direction="up"
          delay={index * stagger}
          distance={16}
          once
          className="curriculum-card-wrapper"
        >
          <CurriculumCard module={module} />
        </ScrollReveal>
      ))}
    </section>
  );
}
