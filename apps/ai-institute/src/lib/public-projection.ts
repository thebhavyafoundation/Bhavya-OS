/**
 * Bhavya Foundation — Public Projection Layer
 *
 * The boundary between internal institutional data and public representation.
 *
 * Architecture:
 *   Internal Data → Classification → Projection → Public DTO
 *
 * Rules:
 *   1. Public pages consume ONLY public DTOs
 *   2. Adding an internal field cannot silently expose it publicly
 *   3. Deny by default — only explicitly projected fields appear
 *   4. Classification determines eligibility for public exposure
 *   5. Projection determines which fields are exposed
 *
 * This file contains:
 *   - Classification types and constants
 *   - Public DTO types for all entities
 *   - Projection functions for each entity
 *   - Utility functions for public data access
 */

import type { KnowledgeObject } from "./knowledge-repository";

// ── Classification System ──────────────────────────────────────

/**
 * Data classification levels.
 * Determines whether an entity is eligible for public exposure.
 */
export type DataClassification =
  | "PUBLIC" // Explicitly approved for public consumption
  | "COMMUNITY" // Visible to authenticated community members
  | "INTERNAL" // Visible only within the institution
  | "RESTRICTED" // Requires specific authorization
  | "PRIVATE"; // Never exposed outside the owning entity

/**
 * Publication status for content entities.
 * Only PUBLISHED entities may appear on public pages.
 */
export type PublicationStatus =
  | "draft" // Not yet submitted for review
  | "review" // Under review
  | "approved" // Approved but not yet published
  | "published" // Publicly visible
  | "archived"; // No longer publicly visible

/**
 * Check if an entity is eligible for public exposure.
 */
export function isPublicEligible(status: PublicationStatus): boolean {
  return status === "published";
}

/**
 * Check if a classification level allows public exposure.
 */
export function isPublicClassification(
  classification: DataClassification,
): boolean {
  return classification === "PUBLIC";
}

/**
 * Check if a Knowledge Object summary is eligible for public projection.
 * Requires status="published" AND provenance="institutional".
 * Used by both the stats API and the full projection functions.
 */
export function isKOPublicEligible(summary: {
  status?: string;
  provenance?: string;
}): boolean {
  const status = summary.status || "draft";
  const provenance = summary.provenance || "institutional";
  return status === "published" && provenance === "institutional";
}

// ── Public DTO Types ───────────────────────────────────────────

/**
 * Public representation of a Knowledge Object.
 * Contains only intentionally public fields.
 */
export interface PublicKnowledgeObject {
  id: string;
  title: string;
  description: string;
  domain: string;
  grade: number;
  subject: string;
  concepts: PublicConcept[];
  definitions: PublicDefinition[];
  examples: PublicExample[];
  exercises: PublicExercise[];
  prerequisites: string[];
  related: string[];
  publishedAt: string;
}

export interface PublicConcept {
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface PublicDefinition {
  term: string;
  definition: string;
}

export interface PublicExample {
  title: string;
  description: string;
  localContext?: string;
}

export interface PublicExercise {
  prompt: string;
  type: "mcq" | "short-answer" | "reflection" | "project";
  // NOTE: solution is intentionally excluded from public projection
}

/**
 * Public representation of a Course.
 */
export interface PublicCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  level: string;
  modules: PublicModule[];
  totalLessons: number;
  duration: string;
  tags: string[];
}

export interface PublicModule {
  id: string;
  title: string;
  description: string;
  lessons: PublicLessonSummary[];
}

export interface PublicLessonSummary {
  id: string;
  title: string;
  duration: number;
}

/**
 * Public representation of a Lesson.
 */
export interface PublicLesson {
  id: string;
  courseId: string;
  title: string;
  subject: string;
  grade: number;
  duration: number;
  learningOutcomes: string[];
  sections: PublicLessonSection[];
  // NOTE: assessment, teacherGuide, workbook are excluded from public
}

export interface PublicLessonSection {
  title: string;
  content: string;
  type: "reading" | "exercise" | "reflection";
}

/**
 * Public representation of a Mentor Agent.
 * System prompts and internal configuration are excluded.
 */
export interface PublicMentorAgent {
  id: string;
  name: string;
  description: string;
  specialties: string[];
  personality: string;
  // NOTE: systemPrompt is intentionally excluded
}

/**
 * Public representation of Research.
 */
export interface PublicResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  year: number;
  tags: string[];
  url?: string;
}

/**
 * Public representation of Impact data.
 */
export interface PublicImpactStat {
  label: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "stable";
}

/**
 * Public representation of a Mission.
 */
export interface PublicMission {
  id: string;
  name: string;
  slug: string;
  purpose: string;
  icon: string;
  color: string;
  stats?: PublicImpactStat[];
}

// ── Projection Functions ───────────────────────────────────────

/**
 * Project a Knowledge Object to its public representation.
 * Strips internal metadata, unpublished content, and sensitive fields.
 */
export function projectKnowledgeObject(
  ko: KnowledgeObject,
): PublicKnowledgeObject {
  return {
    id: ko.id,
    title: ko.title,
    description: ko.description,
    domain: ko.domain,
    grade: ko.grade,
    subject: ko.subject,
    concepts: (ko.concepts || []).map((c) => ({
      name: c.name,
      description: c.description,
      difficulty: c.difficulty,
    })),
    definitions: (ko.definitions || []).map((d) => ({
      term: d.term,
      definition: d.definition,
    })),
    examples: (ko.examples || []).map((e) => ({
      title: e.title,
      description: e.description,
      localContext: e.localContext,
    })),
    exercises: (ko.exercises || []).map((ex) => ({
      prompt: ex.prompt,
      type: ex.type,
      // NOTE: solution is intentionally excluded
    })),
    prerequisites: ko.prerequisites || [],
    related: ko.related || [],
    publishedAt: ko.updatedAt,
  };
}

/**
 * Project a list of Knowledge Objects to public representations.
 */
export function projectKnowledgeObjects(
  kos: KnowledgeObject[],
): PublicKnowledgeObject[] {
  return kos.map(projectKnowledgeObject);
}

/**
 * Project a Mentor Agent to its public representation.
 * Excludes system prompts and internal configuration.
 */
export function projectMentorAgent(agent: {
  id: string;
  name: string;
  description?: string;
  specialties?: string[];
  personality?: string;
  systemPrompt?: string;
}): PublicMentorAgent {
  return {
    id: agent.id,
    name: agent.name,
    description: agent.description || "",
    specialties: agent.specialties || [],
    personality: agent.personality || "",
    // NOTE: systemPrompt is intentionally excluded
  };
}

/**
 * Project a list of Mentor Agents to public representations.
 */
export function projectMentorAgents(
  agents: Array<{
    id: string;
    name: string;
    description?: string;
    specialties?: string[];
    personality?: string;
    systemPrompt?: string;
  }>,
): PublicMentorAgent[] {
  return agents.map(projectMentorAgent);
}

// ── Public Data Access ─────────────────────────────────────────

/**
 * Get public-safe Knowledge Objects from the repository.
 * Only returns published, institutional-eligible records.
 * Filters out drafts, test-seeded, and imported KOs.
 */
export async function getPublicKnowledgeObjects(): Promise<
  PublicKnowledgeObject[]
> {
  const { listKOs, getKO } = await import("./knowledge-repository");
  const kos = await listKOs();
  const eligible = kos.filter(isKOPublicEligible);
  const fullKOs = await Promise.all(eligible.map((s) => getKO(s.id)));
  return fullKOs
    .filter((ko): ko is KnowledgeObject => ko !== null)
    .map(projectKnowledgeObject);
}

/**
 * Get a single public-safe Knowledge Object by ID.
 * Only returns the KO if it is published AND institutional.
 * Draft, test-seeded, and imported KOs are excluded.
 */
export async function getPublicKnowledgeObject(
  id: string,
): Promise<PublicKnowledgeObject | null> {
  const { getKO } = await import("./knowledge-repository");
  const ko = await getKO(id);
  if (!ko) return null;

  // Enforce publication eligibility: must be published + institutional
  const status = ko.status || "draft";
  const provenance = ko.provenance || "institutional";
  if (status !== "published" || provenance !== "institutional") {
    return null;
  }

  return projectKnowledgeObject(ko);
}

// ── Lesson Projections ─────────────────────────────────────────

/**
 * Internal lesson structure from the database.
 */
interface InternalLesson {
  id: string;
  courseId: string | null;
  title: string;
  subject: string;
  grade: number;
  duration: number;
  status: string;
  learningOutcomes: string[];
  sections: unknown[];
  assessment: unknown;
  teacherGuide: unknown;
  workbook: unknown;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Project a lesson to its public representation.
 * Strips assessment, teacherGuide, and workbook.
 */
export function projectLesson(lesson: InternalLesson): PublicLesson {
  return {
    id: lesson.id,
    courseId: lesson.courseId || "",
    title: lesson.title,
    subject: lesson.subject,
    grade: lesson.grade,
    duration: lesson.duration,
    learningOutcomes: lesson.learningOutcomes || [],
    sections: (lesson.sections || []).map((s: unknown) => {
      const section = s as Record<string, unknown>;
      return {
        title: (section.title as string) || "",
        content: (section.content as string) || "",
        type:
          (section.type as "reading" | "exercise" | "reflection") || "reading",
      };
    }),
    // NOTE: assessment, teacherGuide, workbook are intentionally excluded
  };
}

/**
 * Project a list of lessons to public representations.
 */
export function projectLessons(lessons: InternalLesson[]): PublicLesson[] {
  return lessons.map(projectLesson);
}

// ── Course Projections ─────────────────────────────────────────

/**
 * Get public-safe courses from Studio SQLite.
 * Only returns published courses. Draft courses are excluded.
 */
export async function getPublicCourses(): Promise<PublicCourse[]> {
  try {
    const { ensureStudioDb } = await import("./studio/db");
    await ensureStudioDb();
    const { getDb } = await import("./db");
    const rows = getDb()
      .prepare(
        "SELECT * FROM studio_courses WHERE status = 'published' ORDER BY updated_at DESC",
      )
      .all() as Array<{
      id: string;
      title: string;
      description: string;
      subject: string;
      grade: number;
      lessons: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>;

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject,
      grade: row.grade,
      level: "beginner" as const,
      modules: [],
      totalLessons: JSON.parse(row.lessons || "[]").length,
      duration: "0h",
      tags: [],
    }));
  } catch {
    return [];
  }
}

/**
 * Get a single public-safe course by ID.
 * Only returns the course if it is published.
 */
export async function getPublicCourse(
  id: string,
): Promise<PublicCourse | null> {
  try {
    const { ensureStudioDb } = await import("./studio/db");
    await ensureStudioDb();
    const { getDb } = await import("./db");
    const row = getDb()
      .prepare(
        "SELECT * FROM studio_courses WHERE id = ? AND status = 'published'",
      )
      .get(id) as
      | {
          id: string;
          title: string;
          description: string;
          subject: string;
          grade: number;
          lessons: string;
          status: string;
        }
      | undefined;

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      subject: row.subject,
      grade: row.grade,
      level: "beginner",
      modules: [],
      totalLessons: JSON.parse(row.lessons || "[]").length,
      duration: "0h",
      tags: [],
    };
  } catch {
    return null;
  }
}
