/**
 * @bhavya/types — Knowledge Object Types
 *
 * Canonical types for Knowledge Objects, Knowledge Packages, and related entities.
 */

/** Knowledge Object — a unit of educational content */
export interface KnowledgeObject {
  id: string;
  title: string;
  domain: string;
  subject?: string;
  gradeLevel?: string;
  description?: string;
  sourceType: SourceType;
  sourceContent?: string;
  sourceUrl?: string;
  concepts: Concept[];
  definitions: Definition[];
  examples: Example[];
  misconceptions: Misconception[];
  exercises: Exercise[];
  metadata: Record<string, unknown>;
  status: EntityStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/** A concept within a Knowledge Object */
export interface Concept {
  name: string;
  description: string;
  difficulty: Difficulty;
}

/** A definition within a Knowledge Object */
export interface Definition {
  term: string;
  definition: string;
}

/** An example within a Knowledge Object */
export interface Example {
  title: string;
  description: string;
}

/** A misconception addressed by the Knowledge Object */
export interface Misconception {
  misconception: string;
  correction: string;
}

/** An exercise within a Knowledge Object */
export interface Exercise {
  prompt: string;
  type: ExerciseType;
  difficulty: Difficulty;
  answer?: string;
}

/** Knowledge Package — a compiled bundle of artifacts */
export interface KnowledgePackage {
  id: string;
  version: string;
  status: EntityStatus;
  title: string;
  description?: string;
  domain?: string;
  subject?: string;
  gradeLevel?: string;
  koId: string;
  userId: string;
  lesson?: Lesson;
  assessment?: Assessment;
  teacherGuide?: TeacherGuide;
  workbook?: Workbook;
  visualSpec?: VisualSpec;
  video?: VideoSpec;
  website?: Website;
  publicationStatus: PublicationStatus;
  publishedAt?: string;
  approvedBy?: string;
  immutableHash?: string;
  previousVersion?: string;
  createdAt: string;
  updatedAt: string;
}

/** Lesson content */
export interface Lesson {
  title: string;
  sections: LessonSection[];
  learningOutcomes: string[];
  vocabulary: Vocabulary[];
}

/** A section within a lesson */
export interface LessonSection {
  title: string;
  content: string;
  duration?: number;
}

/** Vocabulary term */
export interface Vocabulary {
  term: string;
  definition: string;
}

/** Assessment content */
export interface Assessment {
  title: string;
  questions: Question[];
}

/** A question in an assessment */
export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  marks?: number;
}

/** Teacher guide */
export interface TeacherGuide {
  title: string;
  objectives: string[];
  materials: string[];
  discussionPrompts: string[];
  timingGuide: TimingGuide;
}

/** Timing guide for lesson delivery */
export interface TimingGuide {
  totalMinutes: number;
  sections: TimingSection[];
}

/** A timing section */
export interface TimingSection {
  title: string;
  minutes: number;
}

/** Workbook content */
export interface Workbook {
  title: string;
  pages: WorkbookPage[];
}

/** A page in the workbook */
export interface WorkbookPage {
  title: string;
  content: string;
  exercises?: Exercise[];
}

/** Visual specification for video */
export interface VisualSpec {
  scenes: Scene[];
  palette: string[];
  totalDuration: number;
}

/** A scene in the visual spec */
export interface Scene {
  id: string;
  title: string;
  duration: number;
  elements: VisualElement[];
}

/** A visual element in a scene */
export interface VisualElement {
  type: string;
  content: string;
  position?: { x: number; y: number };
  style?: Record<string, unknown>;
}

/** Video specification */
export interface VideoSpec {
  compositions: VideoComposition[];
  totalDuration: number;
  resolution: { width: number; height: number };
}

/** A video composition */
export interface VideoComposition {
  id: string;
  duration: number;
  scenes: string[];
}

/** Website content */
export interface Website {
  pages: WebsitePage[];
}

/** A page on the website */
export interface WebsitePage {
  title: string;
  slug: string;
  content: string;
}

// ─── Enums ────────────────────────────────────────

export type SourceType = "text" | "pdf" | "docx" | "markdown" | "url" | "api";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type EntityStatus = "draft" | "review" | "published" | "archived";
export type PublicationStatus = "draft" | "pending" | "published" | "archived";
export type QuestionType = "mcq" | "short-answer" | "reflection" | "practical";
export type ExerciseType = "short-answer" | "mcq" | "reflection" | "practical";
