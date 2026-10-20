/**
 * Diagram registry — the single place the app resolves a diagram id to its
 * authored manifest.
 *
 * Why this exists: `content/diagrams/manifests/*.json` is the source of truth
 * (title, accessible text, content sources, review status, licensing). Six
 * manifests and six production SVGs already exist. This registry does not
 * restate any of that content — it statically imports the manifests so the
 * bundler traces them, and exposes a typed lookup by id.
 *
 * Adding a diagram therefore means: author the manifest, export the SVG,
 * add one line here. Never hand-copy the title or the alt text.
 */

import type { DiagramManifest } from "./diagramTypes";

import bhavyaOsArchitecture from "../../../../../content/diagrams/manifests/bhavya-os-architecture.json";
import b2SecuredDataFlow from "../../../../../content/diagrams/manifests/b2-secured-data-flow.json";
import curriculumLearningPathway from "../../../../../content/diagrams/manifests/curriculum-learning-pathway.json";
import environmentalSystem from "../../../../../content/diagrams/manifests/environmental-system.json";
import foundationGovernanceStructure from "../../../../../content/diagrams/manifests/foundation-governance-structure.json";
import responsibleAiLifecycle from "../../../../../content/diagrams/manifests/responsible-ai-lifecycle.json";

export type { DiagramManifest } from "./diagramTypes";

const REGISTRY: Record<string, DiagramManifest> = {
  "bhavya-os-architecture": bhavyaOsArchitecture as DiagramManifest,
  "b2-secured-data-flow": b2SecuredDataFlow as DiagramManifest,
  "curriculum-learning-pathway": curriculumLearningPathway as DiagramManifest,
  "environmental-system": environmentalSystem as DiagramManifest,
  "foundation-governance-structure":
    foundationGovernanceStructure as DiagramManifest,
  "responsible-ai-lifecycle": responsibleAiLifecycle as DiagramManifest,
};

/** All registered diagram ids, sorted, for audits and design proofs. */
export const DIAGRAM_IDS = Object.keys(REGISTRY).sort();

/**
 * Look up a diagram by id.
 *
 * Returns `undefined` for an unknown id rather than throwing: a missing
 * diagram must degrade to "this section did not render", never to a 500 on a
 * public page. Callers are expected to handle `undefined` by omitting the
 * block, and the DiagramBlock component does exactly that.
 */
export function getDiagram(id: string): DiagramManifest | undefined {
  return REGISTRY[id];
}

/**
 * The SVG is authored at 960x540 (16:9). Every diagram in the registry uses
 * this viewport, and the SVG carries its own viewBox, so the rendered size is
 * a layout reservation only — the image scales fluidly inside it.
 */
export const DIAGRAM_WIDTH = 960;
export const DIAGRAM_HEIGHT = 540;
