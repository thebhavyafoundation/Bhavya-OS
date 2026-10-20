import Image from "next/image";
import type { DiagramManifest } from "./diagramTypes";
import { DIAGRAM_HEIGHT, DIAGRAM_WIDTH } from "./diagramRegistry";
import styles from "./editorial.module.css";

/**
 * EditorialDiagram — the branded plate a diagram sits on.
 *
 * Design decisions worth stating, because they look arbitrary otherwise:
 *
 * 1. **The plate is always ivory, in both themes.** The authored SVGs embed
 *    literal hex fills for their `minimal-light` variant. Rather than ship a
 *    second dark variant of every diagram, the diagram is presented as a
 *    light plate on a dark ground — the same convention a printed plate uses
 *    in a book. This is theme-stable, needs no per-diagram dark asset, and
 *    cannot end up unreadable when a theme changes.
 *
 * 2. **The alt text is the manifest's `accessible_text`, verbatim.** An
 *    `<img>` does not expose an SVG's internal `<title>`/`<desc>` to assistive
 *    technology, so the alt must be supplied here. It is taken from the
 *    manifest rather than written here so the text alternative has exactly
 *    one home.
 *
 * 3. **The text alternative is also exposed visibly**, inside a collapsed
 *    `<details>`. Some readers prefer the prose, and readers on a small
 *    screen benefit from a description of a 16:9 graphic they can no longer
 *    read.
 *
 * 4. **Explicit width/height** reserve the 16:9 box so the image cannot cause
 *    layout shift. `sizes` is declared so the browser can pick a sensible
 *    source on small screens.
 *
 * 5. **Source and review status are always rendered.** An institutional
 *    diagram with no stated source is an unsourced claim.
 */
export interface EditorialDiagramProps {
  manifest: DiagramManifest;
  /** Optional heading shown above the plate. Defaults to the manifest title. */
  heading?: string;
  /** Override the caption. Defaults to the manifest purpose. */
  description?: string;
  /** Show source + review line. Default true. */
  showProvenance?: boolean;
  className?: string;
  priority?: boolean;
}

export function EditorialDiagram({
  manifest,
  heading,
  description,
  showProvenance = true,
  className = "",
  priority = false,
}: EditorialDiagramProps) {
  const {
    title,
    accessible_text: accessibleText,
    production_svg: src,
    purpose,
    content_sources: contentSources,
    review,
    licensing,
  } = manifest;

  return (
    <figure className={`${styles.figure} ${className}`.trim()}>
      <figcaption className={styles.head}>
        <h3 className={styles.title}>{heading ?? title}</h3>
        <p className={styles.desc}>{description ?? purpose}</p>
      </figcaption>

      <div className={styles.plate}>
        <Image
          src={src}
          alt={accessibleText}
          width={DIAGRAM_WIDTH}
          height={DIAGRAM_HEIGHT}
          priority={priority}
          decoding="async"
          className={styles.img}
        />
      </div>

      <details className={styles.alt}>
        <summary>Read this diagram as text</summary>
        <p>{accessibleText}</p>
        {showProvenance ? (
          <dl className={styles.meta}>
            <div>
              <dt>Source</dt>
              <dd>
                {contentSources.length > 0
                  ? contentSources.join(", ")
                  : "Internal authoring"}
              </dd>
            </div>
            <div>
              <dt>Review</dt>
              <dd>
                content {review.content} · subject {review.subject} ·
                accessibility {review.accessibility}
              </dd>
            </div>
            <div>
              <dt>Generator</dt>
              <dd>
                {licensing.generator_license} · {licensing.generator_commit}
              </dd>
            </div>
          </dl>
        ) : null}
      </details>
    </figure>
  );
}
