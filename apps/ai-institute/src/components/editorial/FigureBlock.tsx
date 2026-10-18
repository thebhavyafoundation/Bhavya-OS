import type { DiagramSpec } from "@/data/curriculum";
import { DiagramRenderer } from "@/components/curriculum/diagram/DiagramRenderer";

interface FigureBlockProps {
  spec: DiagramSpec;
  /** Shown as the visible caption. Falls back to the spec title. */
  caption?: string;
  /**
   * Plain-language equivalent of what the diagram shows. Required: a diagram
   * that carries meaning must be readable without seeing it.
   */
  textEquivalent?: string;
  /** Provenance, e.g. "Bhavya Foundation, 2026". */
  source?: string;
}

/**
 * A diagram presented as a figure: titled, captioned, sourced, and readable
 * without sight.
 *
 * The text equivalent is not optional decoration. It is rendered as visible
 * supporting prose rather than hidden behind a screen-reader-only class, because
 * a learner scanning the page benefits from it too, and visible text cannot be
 * lost by a broken assistive-technology tree.
 */
export function FigureBlock({
  spec,
  caption,
  textEquivalent,
  source,
}: FigureBlockProps) {
  const title = spec.title?.trim() || caption?.trim() || "Diagram";
  const describedBy = textEquivalent ? `${slug(title)}-desc` : undefined;

  return (
    <figure className="bhv-figure">
      <div className="bhv-figure-canvas">
        <DiagramRenderer spec={spec} />
      </div>
      <figcaption className="bhv-figure-caption">
        <span className="bhv-figure-title">{title}</span>
        {caption && caption.trim() !== title ? (
          <span className="bhv-figure-text"> {caption}</span>
        ) : null}
        {source ? (
          <span className="bhv-figure-source"> Source: {source}</span>
        ) : null}
      </figcaption>
      {textEquivalent ? (
        <p className="bhv-figure-desc" id={describedBy}>
          {textEquivalent}
        </p>
      ) : null}
    </figure>
  );
}

function slug(value: string): string {
  return (
    "bhv-figure-" +
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}
