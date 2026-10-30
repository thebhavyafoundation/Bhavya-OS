"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CurriculumCard } from "./CurriculumCard";
import { getAllModules } from "@/data/curriculum";

interface CurriculumGridProps {
  /** Modules to display; defaults to the full canonical catalog. */
  modules?: typeof getAllModules extends () => infer T ? T : never;
  /** Maximum number of cards to render. */
  limit?: number;
  /** Columns at each breakpoint (Tailwind-ish class string). */
  cols?: string;
  /** Stagger delay between card reveals (seconds). */
  stagger?: number;
  className?: string;
}

const DEFAULT_COLS = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

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
