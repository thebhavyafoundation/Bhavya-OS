export interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  lessons: LessonSummary[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  status: 'draft' | 'ready' | 'published';
  duration: number;
}

export interface KnowledgeObject {
  id: string;
  domain: string;
  title: string;
  description?: string;
  grade?: number;
  subject?: string;
  concepts: Concept[];
  definitions: Definition[];
  examples: Example[];
  misconceptions: Misconception[];
  exercises: Exercise[];
  references: Reference[];
  prerequisites: string[];
  related: string[];
}

export interface Concept {
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Example {
  title: string;
  description: string;
  localContext?: string;
}

export interface Misconception {
  belief: string;
  correction: string;
}

export interface Exercise {
  prompt: string;
  type: 'mcq' | 'short-answer' | 'reflection' | 'project';
  solution?: string;
}

export interface Reference {
  title: string;
  url?: string;
  type: 'book' | 'video' | 'article' | 'local';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  subject: string;
  grade: number;
  duration: number;
  status: 'draft' | 'ready' | 'published';
  learningOutcomes: LearningOutcome[];
  sections: LessonSection[];
  createdAt: string;
  updatedAt: string;
  version: string;
}

export interface LearningOutcome {
  id: string;
  description: string;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
}

export interface LessonSection {
  id: string;
  type: 'introduction' | 'key-concepts' | 'visual-explanation' | 'examples' | 'exercises' | 'summary';
  title: string;
  content: string;
  order: number;
}

export interface Assessment {
  id: string;
  lessonId: string;
  questions: Question[];
  totalPoints: number;
  passingScore: number;
  version: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'short-answer' | 'long-answer' | 'practical' | 'coding';
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  rubric?: string;
  bloomLevel: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TeacherGuide {
  id: string;
  lessonId: string;
  title: string;
  objectives: string[];
  vocabulary: string[];
  materials: string[];
  discussionPrompts: string[];
  commonMisconceptions: string[];
  answerKeys: AnswerKey[];
  timingGuide: TimingGuideEntry[];
  version: string;
}

export interface AnswerKey {
  questionId: string;
  expectedAnswer: string;
  rubric?: string;
}

export interface TimingGuideEntry {
  section: string;
  duration: number;
  activity: string;
}

export interface Workbook {
  id: string;
  lessonId: string;
  title: string;
  pages: WorkbookPage[];
  version: string;
}

export interface WorkbookPage {
  title: string;
  content: string;
  exercises?: Exercise[];
}

export interface VisualSpec {
  id: string;
  lessonId: string;
  title?: string;
  colors: Record<string, string>;
  typography: Record<string, string>;
  scenes: VisualScene[];
  totalDuration?: number;
  totalScenes?: number;
  version: string;
}

export interface VisualScene {
  id: string;
  type: string;
  duration: number;
  elements: SceneElement[];
  transition?: { type: string; direction?: string; duration: number };
}

export interface SceneElement {
  type: string;
  content: string;
  style?: string;
  animation?: string;
  timing?: { start: number; end: number };
}

export interface BuilderResult {
  success: boolean;
  output: Record<string, string>;
  duration: number;
  errors: BuilderError[];
  warnings: BuilderWarning[];
}

export interface BuilderError {
  gate: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface BuilderWarning {
  gate: string;
  message: string;
}

export interface Video {
  id: string;
  lessonId: string;
  title?: string;
  sceneGraph?: { compositions: Composition[]; palette: Record<string, string>; typography: Record<string, string>; totalDurationInFrames: number; fps: number; width: number; height: number; renderUrl: string | null };
  compositions: number;
  totalFrames: number;
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  formats: string[];
  version: string;
}

export interface Composition {
  id: string;
  component: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  props: {
    elements: CompositionElement[];
    palette: Record<string, string>;
    typography: Record<string, string>;
    transition: { type: string; direction?: string; durationInFrames: number } | null;
  };
}

export interface CompositionElement {
  type: string;
  content: string;
  style: string;
  animation: string;
  enterAt: number;
  exitAt: number;
}

export interface BuildStatus {
  id: string;
  capability: string;
  builder: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  steps: BuildStepStatus[];
  qualityGates: QualityGateResult[];
  result?: BuilderResult;
  startedAt?: string;
  completedAt?: string;
}

export interface BuildStepStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
}

export interface QualityGateResult {
  gate: string;
  status: 'passed' | 'warning' | 'failed';
  checks: QualityGateCheck[];
}

export interface QualityGateCheck {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  message?: string;
}

export interface PublishTarget {
  type: 'website' | 'offline' | 'usb';
  path: string;
  url?: string;
}

export interface WorkspaceContent {
  name: string;
  path: string;
  description: string;
  skills: string[];
  capabilities: string[];
}
