"use client";

import Link from "next/link";
import { BookOpen, RefreshCw, Target } from "lucide-react";
import { Card } from "@bhavya/platform-ui";
import type { CurriculumModule } from "@/data/curriculum";

interface CurriculumCardProps {
  module: CurriculumModule;
}

/** Label map for module level. */
const LEVEL_LABEL: Record<string, string> = {
  "0": "Foundation",
  "1": "Core I",
  "2": "Core II",
  "3": "Applied",
  "4": "Practice",
  "5": "Systems",
  "6": "Advanced",
  "7": "Expert",
  "8": "Research",
  "9": "Publishing",
  "10": "Venture",
  "11": "Teaching",
  "12": "Institutional",
};

/**
 * CurriculumCard — a single curriculum module presented as a Bhavya token-driven
 * card. All color, radius, shadow, typography and spacing resolve to
 * tokens.css; nothing here is hardcoded. It is a presentational component with
 * no animation of its own — scroll reveal is applied by CurriculumGrid so the
 * card stays reduced-motion-safe.
 *
 * @module site/components/CurriculumCard
 */
export function CurriculumCard({ module }: CurriculumCardProps) {
  const levelLabel = LEVEL_LABEL[module.level] ?? `Level ${module.level}`;
  const handsOn = `${module.handsOnPercent}%`;

  return (
    <Link
      href={`/curriculum/modules/${module.level}/${module.id}`}
      className="group block text-decoration-none"
      aria-label={`Open ${module.title}`}
    >
      <Card
        hover
        padding="md"
        className="group-hover:border-accent-gold/40 group-hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-full)] bg-surface-2 px-2.5 py-0.5 text-[var(--text-xs)] font-medium text-text-secondary border border-border-secondary"
            aria-hidden="true"
          >
            <BookOpen size={12} className="shrink-0" />
            {levelLabel}
          </span>
          <span
            className="ml-auto inline-flex items-center gap-1 rounded-[var(--radius-full)] bg-bg-hover px-2.5 py-0.5 text-[var(--text-xs)] font-medium text-text-gold border border-border-gold/30"
            aria-hidden="true"
          >
            <Target size={12} className="shrink-0" />
            {module.difficulty}
          </span>
        </div>

        <h3 className="mb-2 font-display text-[var(--text-xl)] font-light text-text-primary leading-1.2">
          {module.title}
        </h3>

        <p className="mb-4 text-[var(--text-sm)] text-text-secondary leading-1.6 line-clamp-2">
          {module.mission}
        </p>

        <dl className="grid grid-cols-2 gap-3 mb-4 border-t border-border-secondary pt-3">
          <div className="flex flex-col gap-0.5">
            <dt className="text-[var(--text-xs)] font-semibold uppercase tracking-wider text-text-muted">
              Duration
            </dt>
            <dd className="text-[var(--text-sm)] text-text-primary">
              {module.duration}
            </dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-[var(--text-xs)] font-semibold uppercase tracking-wider text-text-muted">
              Hands-on
            </dt>
            <dd className="text-[var(--text-sm)] text-text-primary">
              {handsOn}
            </dd>
          </div>
        </dl>

        <div className="flex items-center gap-2 text-[var(--text-xs)] text-text-tertiary mt-auto">
          <RefreshCw size={12} className="shrink-0" />
          <span>
            {module.projects.length} project
            {module.projects.length === 1 ? "" : "s"}
          </span>
        </div>
      </Card>
    </Link>
  );
}
