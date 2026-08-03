/**
 * @bhavya/types — Artifact Types
 *
 * Canonical types for artifacts, outputs, and generated content.
 */

/** An artifact produced by a pipeline or workflow */
export interface Artifact {
  id: string;
  type: ArtifactType;
  data: unknown;
  capabilityId?: string;
  skillId?: string;
  agentId?: string;
  koId?: string;
  packageId?: string;
  createdAt: string;
}

/** Artifact type */
export type ArtifactType =
  | "lesson"
  | "assessment"
  | "teacher-guide"
  | "workbook"
  | "visual-spec"
  | "video"
  | "website"
  | "research"
  | "report"
  | "custom";

/** Artifact metadata */
export interface ArtifactMetadata {
  id: string;
  type: ArtifactType;
  filename?: string;
  mimeType?: string;
  size?: number;
  checksum?: string;
  createdBy: string;
  createdAt: string;
}
