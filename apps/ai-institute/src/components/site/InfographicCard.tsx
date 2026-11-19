"use client";

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Card } from "@bhavya/platform-ui";
import { DiagramRenderer } from "@/components/curriculum/diagram/DiagramRenderer";
import type { DiagramSpec } from "@/data/curriculum";

interface InfographicCardProps {
  spec: DiagramSpec;
  heading?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HEIGHTS = { sm: 260, md: 320, lg: 420 };

/**
 * InfographicCard — a DiagramSpec rendered as bespoke, token-driven SVG inside
 * a Bhavya Card, revealed on scroll via ScrollReveal. All SVG ink, borders,
 * typography and radii resolve to tokens.css; nothing is hardcoded.
 *
 * @module site/components/InfographicCard
 */
export function InfographicCard({
  spec,
  heading,
  description,
  size = "md",
  className = "",
}: InfographicCardProps) {
  return (
    <Card padding="md" className={className}>
      {heading && (
        <h2 className="font-display text-[var(--text-xl)] font-light text-text-primary leading-1.2 mb-3">
          {heading}
        </h2>
      )}
      {description && (
        <p className="mb-4 text-[var(--text-sm)] text-text-secondary leading-1.6">
          {description}
        </p>
      )}
      <div
        className="infographic-wrap"
        style={{
          height: HEIGHTS[size],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-surface)",
          border: `1px solid var(--color-border-primary)`,
          borderRadius: "var(--radius-lg)",
        }}
      >
        <DiagramRenderer spec={spec} />
      </div>
    </Card>
  );
}

/**
 * RevealInfographicCard — InfographicCard wrapped in ScrollReveal so the
 * diagram enters progressively as the user scrolls. Reduced-motion safe.
 *
 * @module site/components/InfographicCard
 */
export function RevealInfographicCard({
  spec,
  heading,
  description,
  size = "md",
  delay = 0,
  className = "",
}: InfographicCardProps & { delay?: number }) {
  return (
    <ScrollReveal
      direction="up"
      delay={delay}
      distance={16}
      once
      className={className}
    >
      <InfographicCard
        spec={spec}
        heading={heading}
        description={description}
        size={size}
      />
    </ScrollReveal>
  );
}
