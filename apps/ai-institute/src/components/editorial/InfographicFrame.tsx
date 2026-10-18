import type { ReactNode } from "react";
import styles from "./editorial.module.css";

/**
 * InfographicFrame — the branded frame for a numeric or charted figure.
 *
 * Deliberately not a charting library. This component is the *frame*: title,
 * claim, figure, source, and a text alternative. Charting is supplied by the
 * caller as `children`, because the repo has no chart dependency and adding
 * one is not justified by the current figure set.
 *
 * Colour discipline: series colours come from `--color-viz-*` via
 * `VIZ_SERIES`, never from a hardcoded hex and never from a gradient ramp.
 * A chart is a data display, not decoration; a gradient in a chart encodes
 * nothing.
 */
export interface InfographicFrameProps {
  /** What the figure is. */
  title: string;
  /** The single sentence the figure is arguing. Shown as the standfirst. */
  claim?: string;
  /** Where the numbers come from. Institutional figures must be traceable. */
  source?: string;
  /**
   * The text alternative. Required unless `children` is already fully
   * described by adjacent prose — a chart with no readable equivalent is
   * inaccessible, not merely undocumented.
   */
  accessibleText?: string;
  /** The figure itself. */
  children: ReactNode;
  /** Rendered under the figure, e.g. a legend or a footnote. */
  footnote?: ReactNode;
  /** Reserve an aspect ratio to prevent layout shift while the figure loads. */
  aspect?: "auto" | "16/9" | "4/3" | "1/1";
  className?: string;
}

const ASPECT: Record<NonNullable<InfographicFrameProps["aspect"]>, string> = {
  auto: "",
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export function InfographicFrame({
  title,
  claim,
  source,
  accessibleText,
  children,
  footnote,
  aspect = "auto",
  className = "",
}: InfographicFrameProps) {
  const hasAlternative = Boolean(accessibleText);

  return (
    <figure className={`${styles.figure} ${className}`.trim()}>
      <figcaption className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        {claim ? <p className={styles.claim}>{claim}</p> : null}
      </figcaption>

      <div
        className={`${styles.plate} ${ASPECT[aspect]}`.trim()}
        role={hasAlternative ? "img" : undefined}
        aria-label={hasAlternative ? accessibleText : undefined}
      >
        {children}
      </div>

      {hasAlternative ? (
        <details className={styles.alt}>
          <summary>Read these figures as text</summary>
          <p>{accessibleText}</p>
        </details>
      ) : null}

      {footnote ? <p className={styles.footnote}>{footnote}</p> : null}
      {source ? <p className={styles.source}>Source: {source}</p> : null}
    </figure>
  );
}

/**
 * Brand-compliant series palette, exposed for callers that build a figure.
 * Kept here so no chart ever invents its own colour ramp.
 */
export const VIZ_SERIES = [
  "var(--color-viz-forest)",
  "var(--color-viz-gold)",
  "var(--color-viz-earth)",
  "var(--color-viz-sage)",
  "var(--color-viz-forest-light)",
  "var(--color-viz-gold-light)",
] as const;
