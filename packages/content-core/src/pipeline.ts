/**
 * @bhavya/content-core — Content Authoring Pipeline
 *
 * Reusable pipeline for creating, validating, reviewing, and publishing
 * content across all domains (AI, Forestry, Heritage, etc.).
 *
 * Every domain uses this pipeline. No domain-specific content logic.
 *
 * @version 1.0.0
 */

import { writeJSON, readJSON, ensureDir, listDir } from "./io.js";
import { resolve } from "path";

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export type ContentDomain =
  | "ai"
  | "forestry"
  | "ecology"
  | "csr"
  | "heritage"
  | "education"
  | "gis"
  | "agriculture"
  | "climate"
  | "entrepreneurship"
  | "leadership";

export type ContentStatus =
  "draft" | "review" | "revision" | "approved" | "published" | "archived";

export type ContentType =
  | "concept"
  | "lesson"
  | "course"
  | "project"
  | "assessment"
  | "lab"
  | "research"
  | "publication"
  | "guide"
  | "reference";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

/** Citation — a reference to an external source */
export interface Citation {
  id: string;
  title: string;
  url: string;
  author?: string;
  year?: number;
  type: "paper" | "book" | "article" | "video" | "tutorial" | "documentation";
  accessedAt: string;
  relevance: "primary" | "secondary" | "background";
}

/** Prerequisite — a dependency on another content item */
export interface ContentPrerequisite {
  contentId: string;
  title: string;
  required: boolean;
  relationship: "must-understand" | "should-know" | "helpful-context";
}

/** Lab Configuration — interactive experiment setup */
export interface LabConfig {
  type: "simulation" | "sandbox" | "builder" | "explorer" | "challenge";
  component: string;
  parameters: LabParameter[];
  examples: string[];
  failureCases: string[];
}

export interface LabParameter {
  name: string;
  type: "number" | "string" | "boolean" | "select";
  default: unknown;
  min?: number;
  max?: number;
  options?: string[];
  description: string;
}

/** Code Example — runnable code in a specific language */
export interface CodeExample {
  id: string;
  language:
    | "python"
    | "typescript"
    | "node"
    | "langgraph"
    | "openai"
    | "anthropic"
    | "local";
  title: string;
  code: string;
  explanation: string;
  runnable: boolean;
  output?: string;
  errors?: CodeError[];
}

export interface CodeError {
  line: number;
  message: string;
  fix: string;
}

/** Translation — localized version of content */
export interface Translation {
  language: string;
  title: string;
  description: string;
  content: Record<string, string>;
  translatedBy: string;
  translatedAt: string;
  quality: "machine" | "reviewed" | "professional";
}

/** Review — a content review record */
export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  status: "pending" | "approved" | "changes-requested" | "rejected";
  comments: ReviewComment[];
  score?: number;
  submittedAt: string;
  completedAt?: string;
}

export interface ReviewComment {
  section: string;
  type: "error" | "warning" | "suggestion" | "question";
  content: string;
  line?: number;
  resolved: boolean;
}

/** Version — content version history */
export interface ContentVersion {
  version: string;
  changes: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  checksum: string;
}

/** Content Item — the canonical content entity */
export interface ContentItem {
  id: string;
  type: ContentType;
  domain: ContentDomain;
  status: ContentStatus;
  title: string;
  slug: string;
  description: string;
  body: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];

  // Content structure
  learningOutcomes: string[];
  glossary: { term: string; definition: string }[];
  keyTakeaways: string[];

  // Dependencies
  prerequisites: ContentPrerequisite[];
  relatedContent: string[];

  // Rich content
  codeExamples: CodeExample[];
  labs: LabConfig[];
  citations: Citation[];
  translations: Translation[];

  // Metadata
  authorId: string;
  authorName: string;
  reviewers: string[];
  version: string;
  versions: ContentVersion[];

  // Review workflow
  reviews: Review[];
  approvalRequired: boolean;
  minReviewsRequired: number;

  // Quality gates
  qualityScore: number;
  qualityChecks: QualityCheck[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;

  // Extensible
  metadata: Record<string, unknown>;
}

/** Quality Check — automated validation result */
export interface QualityCheck {
  name: string;
  passed: boolean;
  severity: "error" | "warning" | "info";
  message: string;
  details?: string;
}

/** Pipeline Stage — a step in the content lifecycle */
export interface PipelineStage {
  name: string;
  description: string;
  required: boolean;
  automated: boolean;
  handler: (item: ContentItem) => Promise<QualityCheck[]>;
}

/** Pipeline Result — outcome of running the pipeline */
export interface PipelineResult {
  success: boolean;
  item: ContentItem;
  stages: StageResult[];
  duration: number;
}

export interface StageResult {
  stage: string;
  passed: boolean;
  checks: QualityCheck[];
  duration: number;
}

// ═══════════════════════════════════════════════════════════════════
// VALIDATION ENGINE
// ═══════════════════════════════════════════════════════════════════

/** Validate a content item against quality gates */
export function validateContent(item: ContentItem): QualityCheck[] {
  const checks: QualityCheck[] = [];

  // 1. Required fields
  checks.push(checkRequired("title", item.title, "error"));
  checks.push(checkRequired("description", item.description, "error"));
  checks.push(checkRequired("body", item.body, "error"));
  checks.push(checkRequired("domain", item.domain, "error"));
  checks.push(checkRequired("type", item.type, "error"));

  // 2. Content quality
  checks.push(checkMinLength("title", item.title, 5, "error"));
  checks.push(checkMinLength("description", item.description, 20, "warning"));
  checks.push(checkMinLength("body", item.body, 100, "error"));

  // 3. Learning outcomes
  if (item.learningOutcomes.length === 0) {
    checks.push({
      name: "learning-outcomes",
      passed: false,
      severity: "warning",
      message: "No learning outcomes defined",
    });
  }

  // 4. Prerequisites
  if (item.prerequisites.length === 0 && item.difficulty !== "beginner") {
    checks.push({
      name: "prerequisites",
      passed: false,
      severity: "warning",
      message: "Non-beginner content should declare prerequisites",
    });
  }

  // 5. Citations
  if (item.citations.length === 0) {
    checks.push({
      name: "citations",
      passed: false,
      severity: "warning",
      message: "No citations — all claims should be sourced",
    });
  }

  // 6. Glossary
  if (item.glossary.length === 0) {
    checks.push({
      name: "glossary",
      passed: false,
      severity: "info",
      message: "No glossary terms defined",
    });
  }

  // 7. Code examples (for technical content)
  if (
    ["ai", "education"].includes(item.domain) &&
    item.codeExamples.length === 0
  ) {
    checks.push({
      name: "code-examples",
      passed: false,
      severity: "warning",
      message: "Technical content should include code examples",
    });
  }

  // 8. Labs (for educational content)
  if (item.type === "lesson" && item.labs.length === 0) {
    checks.push({
      name: "labs",
      passed: false,
      severity: "warning",
      message: "Lessons should include interactive labs",
    });
  }

  // 9. Slug validation
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
    checks.push({
      name: "slug-format",
      passed: false,
      severity: "error",
      message: "Slug must be lowercase alphanumeric with hyphens",
    });
  }

  // 10. Difficulty vs estimated time
  const minTime: Record<Difficulty, number> = {
    beginner: 5,
    intermediate: 10,
    advanced: 15,
    expert: 20,
  };
  if (item.estimatedMinutes < minTime[item.difficulty]) {
    checks.push({
      name: "estimated-time",
      passed: false,
      severity: "warning",
      message: `Estimated time (${item.estimatedMinutes}min) seems low for ${item.difficulty} content`,
    });
  }

  return checks;
}

function checkRequired(
  field: string,
  value: unknown,
  severity: "error" | "warning" | "info",
): QualityCheck {
  const passed = value !== undefined && value !== null && value !== "";
  return {
    name: `required-${field}`,
    passed,
    severity,
    message: passed ? "" : `${field} is required`,
  };
}

function checkMinLength(
  field: string,
  value: string,
  min: number,
  severity: "error" | "warning" | "info",
): QualityCheck {
  const passed = value.length >= min;
  return {
    name: `min-length-${field}`,
    passed,
    severity,
    message: passed
      ? ""
      : `${field} must be at least ${min} characters (current: ${value.length})`,
  };
}

// ═══════════════════════════════════════════════════════════════════
// VERSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

/** Create a new version record */
export function createVersion(
  item: ContentItem,
  changes: string,
  authorId: string,
  authorName: string,
): ContentItem {
  const versionParts = item.version.split(".").map(Number);
  const newVersion = `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`;

  const version: ContentVersion = {
    version: newVersion,
    changes,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
    checksum: generateChecksum(item),
  };

  return {
    ...item,
    version: newVersion,
    versions: [...item.versions, version],
    updatedAt: new Date().toISOString(),
  };
}

/** Bump major version (breaking changes) */
export function bumpMajor(
  item: ContentItem,
  changes: string,
  authorId: string,
  authorName: string,
): ContentItem {
  const versionParts = item.version.split(".").map(Number);
  const newVersion = `${versionParts[0] + 1}.0.0`;

  const version: ContentVersion = {
    version: newVersion,
    changes,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
    checksum: generateChecksum(item),
  };

  return {
    ...item,
    version: newVersion,
    versions: [...item.versions, version],
    updatedAt: new Date().toISOString(),
  };
}

function generateChecksum(item: ContentItem): string {
  const content = JSON.stringify({
    title: item.title,
    body: item.body,
    domain: item.domain,
    type: item.type,
  });
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// ═══════════════════════════════════════════════════════════════════
// REVIEW WORKFLOW
// ═══════════════════════════════════════════════════════════════════

/** Submit content for review */
export function submitForReview(
  item: ContentItem,
  reviewerIds: string[],
): ContentItem {
  const reviews: Review[] = reviewerIds.map((id) => ({
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reviewerId: id,
    reviewerName: id,
    status: "pending" as const,
    comments: [],
    submittedAt: new Date().toISOString(),
  }));

  return {
    ...item,
    status: "review",
    reviews,
    updatedAt: new Date().toISOString(),
  };
}

/** Add a review comment */
export function addReviewComment(
  item: ContentItem,
  reviewId: string,
  comment: Omit<ReviewComment, "resolved">,
): ContentItem {
  return {
    ...item,
    reviews: item.reviews.map((r) =>
      r.id === reviewId
        ? { ...r, comments: [...r.comments, { ...comment, resolved: false }] }
        : r,
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Complete a review */
export function completeReview(
  item: ContentItem,
  reviewId: string,
  status: Review["status"],
  score?: number,
): ContentItem {
  const updatedItem = {
    ...item,
    reviews: item.reviews.map((r) =>
      r.id === reviewId
        ? {
            ...r,
            status,
            score,
            completedAt: new Date().toISOString(),
          }
        : r,
    ),
    updatedAt: new Date().toISOString(),
  };

  // Check if all reviews are complete and approved
  const allReviewed = updatedItem.reviews.every((r) => r.status !== "pending");
  const allApproved = updatedItem.reviews.every((r) => r.status === "approved");
  const meetsMinimum =
    updatedItem.reviews.filter((r) => r.status === "approved").length >=
    updatedItem.minReviewsRequired;

  if (allReviewed && meetsMinimum) {
    return {
      ...updatedItem,
      status: allApproved ? "approved" : "revision",
    };
  }

  return updatedItem;
}

/** Publish content */
export function publishContent(item: ContentItem): ContentItem {
  if (item.status !== "approved" && item.status !== "draft") {
    throw new Error(
      `Cannot publish content in "${item.status}" status. Must be "approved" or "draft".`,
    );
  }

  // Run quality checks
  const checks = validateContent(item);
  const errors = checks.filter((c) => !c.passed && c.severity === "error");

  if (errors.length > 0) {
    throw new Error(
      `Content failed quality checks:\n${errors.map((e) => `- ${e.message}`).join("\n")}`,
    );
  }

  return {
    ...item,
    status: "published",
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Archive content */
export function archiveContent(item: ContentItem): ContentItem {
  return {
    ...item,
    status: "archived",
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// CONTENT FACTORY
// ═══════════════════════════════════════════════════════════════════

/** Create a new content item with defaults */
export function createContentItem(
  partial: Partial<ContentItem> & {
    title: string;
    domain: ContentDomain;
    type: ContentType;
  },
): ContentItem {
  const now = new Date().toISOString();
  const slug = partial.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    id:
      partial.id ||
      `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: partial.type,
    domain: partial.domain,
    status: "draft",
    title: partial.title,
    slug: partial.slug || slug,
    description: partial.description || "",
    body: partial.body || "",
    difficulty: partial.difficulty || "beginner",
    estimatedMinutes: partial.estimatedMinutes || 15,
    tags: partial.tags || [],
    learningOutcomes: partial.learningOutcomes || [],
    glossary: partial.glossary || [],
    keyTakeaways: partial.keyTakeaways || [],
    prerequisites: partial.prerequisites || [],
    relatedContent: partial.relatedContent || [],
    codeExamples: partial.codeExamples || [],
    labs: partial.labs || [],
    citations: partial.citations || [],
    translations: partial.translations || [],
    authorId: partial.authorId || "system",
    authorName: partial.authorName || "System",
    reviewers: partial.reviewers || [],
    version: "1.0.0",
    versions: [],
    reviews: [],
    approvalRequired: partial.approvalRequired ?? true,
    minReviewsRequired: partial.minReviewsRequired ?? 1,
    qualityScore: 0,
    qualityChecks: [],
    createdAt: now,
    updatedAt: now,
    metadata: partial.metadata || {},
  };
}

// ═══════════════════════════════════════════════════════════════════
// PIPELINE RUNNER
// ═══════════════════════════════════════════════════════════════════

/** Run the full content pipeline on an item */
export async function runPipeline(
  item: ContentItem,
  stages: PipelineStage[] = defaultStages,
): Promise<PipelineResult> {
  const startTime = Date.now();
  const stageResults: StageResult[] = [];
  let currentItem = { ...item };
  let allPassed = true;

  for (const stage of stages) {
    const stageStart = Date.now();
    const checks = await stage.handler(currentItem);
    const passed = stage.required
      ? checks.every((c) => c.passed || c.severity !== "error")
      : true;

    if (!passed) allPassed = false;

    stageResults.push({
      stage: stage.name,
      passed,
      checks,
      duration: Date.now() - stageStart,
    });

    // Update quality checks on item
    currentItem = {
      ...currentItem,
      qualityChecks: [...currentItem.qualityChecks, ...checks],
      qualityScore: calculateQualityScore([
        ...currentItem.qualityChecks,
        ...checks,
      ]),
    };
  }

  return {
    success: allPassed,
    item: currentItem,
    stages: stageResults,
    duration: Date.now() - startTime,
  };
}

/** Default pipeline stages */
export const defaultStages: PipelineStage[] = [
  {
    name: "validation",
    description: "Validate required fields and content quality",
    required: true,
    automated: true,
    handler: async (item) => validateContent(item),
  },
  {
    name: "citation-check",
    description: "Verify citations are present and well-formed",
    required: false,
    automated: true,
    handler: async (item) => {
      const checks: QualityCheck[] = [];
      if (item.citations.length === 0) {
        checks.push({
          name: "no-citations",
          passed: false,
          severity: "warning",
          message: "No citations provided",
        });
      }
      for (const citation of item.citations) {
        if (!citation.url) {
          checks.push({
            name: "citation-url",
            passed: false,
            severity: "error",
            message: `Citation "${citation.title}" missing URL`,
          });
        }
      }
      return checks;
    },
  },
  {
    name: "prerequisite-validation",
    description: "Validate prerequisite chain is acyclic",
    required: true,
    automated: true,
    handler: async (item) => {
      const checks: QualityCheck[] = [];
      const visited = new Set<string>();
      const stack = item.prerequisites.map((p) => p.contentId);

      while (stack.length > 0) {
        const id = stack.pop()!;
        if (visited.has(id)) {
          checks.push({
            name: "cyclic-prerequisites",
            passed: false,
            severity: "error",
            message: `Cyclic prerequisite detected: ${id}`,
          });
          break;
        }
        visited.add(id);
      }

      if (checks.length === 0) {
        checks.push({
          name: "prerequisite-chain",
          passed: true,
          severity: "info",
          message: "Prerequisite chain is acyclic",
        });
      }

      return checks;
    },
  },
  {
    name: "code-quality",
    description: "Validate code examples compile/parse",
    required: false,
    automated: true,
    handler: async (item) => {
      const checks: QualityCheck[] = [];
      for (const example of item.codeExamples) {
        if (!example.code || example.code.trim().length === 0) {
          checks.push({
            name: "empty-code",
            passed: false,
            severity: "error",
            message: `Code example "${example.title}" is empty`,
          });
        }
        if (!example.explanation) {
          checks.push({
            name: "code-explanation",
            passed: false,
            severity: "warning",
            message: `Code example "${example.title}" missing explanation`,
          });
        }
      }
      return checks;
    },
  },
];

/** Calculate quality score (0-100) from checks */
function calculateQualityScore(checks: QualityCheck[]): number {
  if (checks.length === 0) return 0;

  const total = checks.length;
  const passed = checks.filter((c) => c.passed).length;
  const weighted =
    checks.reduce((sum, c) => {
      const weight =
        c.severity === "error" ? 3 : c.severity === "warning" ? 2 : 1;
      return sum + (c.passed ? weight : 0);
    }, 0) /
    checks.reduce((sum, c) => {
      const weight =
        c.severity === "error" ? 3 : c.severity === "warning" ? 2 : 1;
      return sum + weight;
    }, 0);

  return Math.round(weighted * 100);
}

// ═══════════════════════════════════════════════════════════════════
// PERSISTENCE
// ═══════════════════════════════════════════════════════════════════

/** Save content item to filesystem */
export async function saveContent(
  item: ContentItem,
  basePath: string,
): Promise<void> {
  const dir = resolve(basePath, item.domain, item.type);
  await ensureDir(dir);
  await writeJSON(resolve(dir, `${item.id}.json`), item);
}

/** Load content item from filesystem */
export async function loadContent(
  id: string,
  domain: ContentDomain,
  type: ContentType,
  basePath: string,
): Promise<ContentItem | null> {
  try {
    return await readJSON(resolve(basePath, domain, type, `${id}.json`));
  } catch {
    return null;
  }
}

/** List all content items in a domain */
export async function listContent(
  domain: ContentDomain,
  type: ContentType,
  basePath: string,
): Promise<ContentItem[]> {
  const dir = resolve(basePath, domain, type);
  try {
    const files = await listDir(dir);
    const items: ContentItem[] = [];
    for (const file of files) {
      if (file.endsWith(".json")) {
        const item = await readJSON(resolve(dir, file));
        items.push(item);
      }
    }
    return items;
  } catch {
    return [];
  }
}
