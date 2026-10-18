/**
 * Diagram manifest shape, mirroring the required fields of
 * `content/diagrams/manifests/manifest.schema.json`.
 *
 * Only the fields the app actually renders are typed. The manifest is the
 * full contract; this type is the read-model.
 */

export type DiagramType =
  | "architecture"
  | "architecture-delta"
  | "it-current-state"
  | "flowchart"
  | "sequence"
  | "state-machine"
  | "er-data-model"
  | "timeline"
  | "swimlane"
  | "quadrant"
  | "radar"
  | "polar-chart"
  | "loop"
  | "nested"
  | "tree"
  | "org-chart"
  | "layer-stack"
  | "high-level"
  | "process"
  | "data-flow"
  | "sankey"
  | "dependency-graph"
  | "user-journey";

export type DiagramReviewStatus = "draft" | "in-review" | "approved";

export interface DiagramReview {
  content: "pending" | "reviewed" | "not-applicable";
  subject: "pending" | "reviewed" | "not-applicable";
  governance: "pending" | "reviewed" | "not-applicable";
  accessibility: "pending" | "reviewed" | "not-applicable";
}

export interface DiagramLicensing {
  generator_repository: string;
  generator_commit: string;
  generator_license: string;
  embedded_icons: string[];
}

export interface DiagramManifest {
  diagram_id: string;
  title: string;
  type: DiagramType;
  variant: string;
  route: string;
  section: string;
  purpose: string;
  audience: string;
  source_html: string;
  production_svg: string;
  optional_png: string | null;
  /** The authoritative text alternative. Used as the rendered image's alt. */
  accessible_text: string;
  content_sources: string[];
  review: DiagramReview;
  licensing: DiagramLicensing;
  version: string;
  status: DiagramReviewStatus;
  updated_at: string;
}
