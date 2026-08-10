/**
 * Bhavya Video Engine — Barrel Export
 *
 * @module video-engine
 */

// Types
export type {
  SceneType,
  TransitionType,
  SceneBase,
  TitleScene,
  ConceptScene,
  DefinitionScene,
  DiagramScene,
  DiagramNode,
  DiagramEdge,
  TimelineScene,
  TimelineEvent,
  ProcessScene,
  ProcessStep,
  CodeScene,
  CodeAnnotation,
  MathScene,
  ComparisonScene,
  ComparisonItem,
  KnowledgeGraphScene,
  GraphNode,
  GraphEdge,
  CaseStudyScene,
  SummaryScene,
  AssessmentScene,
  ChapterMarkerScene,
  VideoScene,
  VideoComposition,
  CompositionMetadata,
  VisualElement,
  VideoTheme,
} from "./types";

export { defaultTheme } from "./types";

// Components (re-exported with display names to avoid type conflicts)
export { TitleScene as TitleSceneComponent } from "./components/TitleScene";
export { ConceptScene as ConceptSceneComponent } from "./components/ConceptScene";
export { DefinitionScene as DefinitionSceneComponent } from "./components/DefinitionScene";
export { ProcessScene as ProcessSceneComponent } from "./components/ProcessScene";
export { CodeScene as CodeSceneComponent } from "./components/CodeScene";
export { DiagramScene as DiagramSceneComponent } from "./components/DiagramScene";
export { ComparisonScene as ComparisonSceneComponent } from "./components/ComparisonScene";
export { SummaryScene as SummarySceneComponent } from "./components/SummaryScene";
export { AssessmentScene as AssessmentSceneComponent } from "./components/AssessmentScene";
export { ChapterMarkerScene as ChapterMarkerSceneComponent } from "./components/ChapterMarkerScene";

// Pipeline
export {
  lessonToComposition,
  courseToCompositions,
  mergeCompositions,
  compositionToHTML,
} from "./pipeline";

export type {
  CurriculumLesson,
  CurriculumCourse,
  PipelineOptions,
} from "./pipeline";
