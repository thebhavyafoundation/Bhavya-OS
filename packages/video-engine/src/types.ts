/**
 * Bhavya Video Engine — Type Definitions
 *
 * Canonical types for educational video scene composition.
 * These types define the contract between curriculum content and video rendering.
 *
 * @module video-engine/types
 */

// ═══════════════════════════════════════════════════════════════════
// SCENE TYPES
// ═══════════════════════════════════════════════════════════════════

export type SceneType =
  | "title"
  | "concept"
  | "definition"
  | "diagram"
  | "timeline"
  | "process"
  | "code"
  | "math"
  | "comparison"
  | "knowledge-graph"
  | "case-study"
  | "summary"
  | "assessment"
  | "chapter-marker";

export interface SceneBase {
  id: string;
  type: SceneType;
  duration: number; // seconds
  transition?: TransitionType;
  narration?: string;
  notes?: string;
  accentColor?: string;
}

export type TransitionType =
  | "fade"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "zoom-in"
  | "zoom-out"
  | "cut"
  | "dissolve";

// ═══════════════════════════════════════════════════════════════════
// SCENE INTERFACES
// ═══════════════════════════════════════════════════════════════════

export interface TitleScene extends SceneBase {
  type: "title";
  title: string;
  subtitle?: string;
  courseTitle?: string;
  moduleTitle?: string;
  lessonNumber?: number;
  background?: "solid" | "gradient" | "image";
  accentColor?: string;
}

export interface ConceptScene extends SceneBase {
  type: "concept";
  concept: string;
  description: string;
  icon?: string;
  bulletPoints?: string[];
  visual?: VisualElement;
}

export interface DefinitionScene extends SceneBase {
  type: "definition";
  term: string;
  definition: string;
  pronunciation?: string;
  etymology?: string;
  examples?: string[];
  visual?: VisualElement;
}

export interface DiagramScene extends SceneBase {
  type: "diagram";
  title: string;
  diagramType: "flowchart" | "cycle" | "hierarchy" | "network" | "timeline";
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface DiagramNode {
  id: string;
  label: string;
  description?: string;
  position?: { x: number; y: number };
  color?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  type?: "solid" | "dashed" | "dotted";
}

export interface TimelineScene extends SceneBase {
  type: "timeline";
  title: string;
  events: TimelineEvent[];
  orientation?: "horizontal" | "vertical";
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ProcessScene extends SceneBase {
  type: "process";
  title: string;
  steps: ProcessStep[];
  layout?: "linear" | "circular" | "grid";
}

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon?: string;
}

export interface CodeScene extends SceneBase {
  type: "code";
  title: string;
  language: string;
  code: string;
  highlights?: number[];
  annotations?: CodeAnnotation[];
}

export interface CodeAnnotation {
  line: number;
  text: string;
}

export interface MathScene extends SceneBase {
  type: "math";
  title: string;
  expression: string;
  explanation?: string;
  steps?: string[];
}

export interface ComparisonScene extends SceneBase {
  type: "comparison";
  title: string;
  left: ComparisonItem;
  right: ComparisonItem;
}

export interface ComparisonItem {
  title: string;
  points: string[];
  color?: string;
}

export interface KnowledgeGraphScene extends SceneBase {
  type: "knowledge-graph";
  title: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlightNode?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "concept" | "skill" | "assessment";
  mastery?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: "prerequisite" | "related" | "builds-on";
}

export interface CaseStudyScene extends SceneBase {
  type: "case-study";
  title: string;
  scenario: string;
  question: string;
  analysis?: string;
  takeaways?: string[];
}

export interface SummaryScene extends SceneBase {
  type: "summary";
  title: string;
  keyPoints: string[];
  nextTopic?: string;
}

export interface AssessmentScene extends SceneBase {
  type: "assessment";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterMarkerScene extends SceneBase {
  type: "chapter-marker";
  chapterNumber: number;
  chapterTitle: string;
  lessonTitle?: string;
}

// ═══════════════════════════════════════════════════════════════════
// COMPOSITION TYPES
// ═══════════════════════════════════════════════════════════════════

export type VideoScene =
  | TitleScene
  | ConceptScene
  | DefinitionScene
  | DiagramScene
  | TimelineScene
  | ProcessScene
  | CodeScene
  | MathScene
  | ComparisonScene
  | KnowledgeGraphScene
  | CaseStudyScene
  | SummaryScene
  | AssessmentScene
  | ChapterMarkerScene;

export interface VideoComposition {
  id: string;
  title: string;
  description: string;
  scenes: VideoScene[];
  metadata: CompositionMetadata;
}

export interface CompositionMetadata {
  courseId: string;
  lessonId: string;
  totalDuration: number;
  sceneCount: number;
  createdAt: string;
  version: number;
}

// ═══════════════════════════════════════════════════════════════════
// VISUAL ELEMENTS
// ═══════════════════════════════════════════════════════════════════

export interface VisualElement {
  type: "icon" | "image" | "chart" | "animation";
  source: string;
  alt?: string;
  caption?: string;
}

// ═══════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════

export interface VideoTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    heading: string;
    body: string;
    code: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
}

export const defaultTheme: VideoTheme = {
  colors: {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    accent: "#8a7359",
    background: "#f5f1e6",
    surface: "#ffffff",
    text: "#1a3a2a",
    textSecondary: "#1a3a2a99",
  },
  typography: {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
    code: "JetBrains Mono, monospace",
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 32,
  },
};
