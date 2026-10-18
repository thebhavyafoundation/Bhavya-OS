import { EditorialDiagram } from "./EditorialDiagram";
import { getDiagram } from "./diagramRegistry";

/**
 * DiagramBlock — page-level usage of a diagram.
 *
 * Contract:
 * - Takes a diagram id only. Title, description, alt text and provenance are
 *   all read from the authored manifest, never passed in at the call site.
 * - Returns `null` for an unknown id. A typo in a diagram id must leave a
 *   page slightly emptier, not broken. Silent omission is acceptable here
 *   because the registry is static and exhaustive; an unknown id is a
 *   compile-time authoring mistake, caught by the audit in
 *   `DIAGRAM_IDS`, not a runtime data condition.
 * - The text alternative is always present — see `EditorialDiagram`.
 */
export interface DiagramBlockProps {
  id: string;
  heading?: string;
  description?: string;
  showProvenance?: boolean;
  priority?: boolean;
  className?: string;
}

export function DiagramBlock({
  id,
  heading,
  description,
  showProvenance = true,
  priority = false,
  className = "",
}: DiagramBlockProps) {
  const manifest = getDiagram(id);
  if (!manifest) return null;

  return (
    <EditorialDiagram
      manifest={manifest}
      heading={heading}
      description={description}
      showProvenance={showProvenance}
      priority={priority}
      className={className}
    />
  );
}
