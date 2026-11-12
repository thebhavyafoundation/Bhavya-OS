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
      /*
        `cols` is a set of Tailwind column utilities, so it belongs in the
        class list. It used to be assigned to the inline `gridTemplateColumns`
        style, which is not a CSS value: the declaration was dropped, the
        grid fell back to an implicit auto column, and that column was sized
        to the cards' max-content width. The grid then refused to shrink
        below it and pushed the page into horizontal overflow on a phone.
      */
      className={`curriculum-grid ${cols} ${className}`}
      style={{
        display: "grid",
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
