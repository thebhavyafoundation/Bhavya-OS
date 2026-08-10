/**
 * Bhavya Video Engine — Curriculum-to-Video Pipeline
 *
 * Converts curriculum content (lessons, concepts, assessments) into
 * VideoComposition objects that can be rendered by HyperFrame.
 *
 * This is the core bridge between the Academy data and the Video Engine.
 */

import type {
  VideoComposition,
  VideoScene,
  TitleScene,
  ConceptScene,
  DefinitionScene,
  ProcessScene,
  AssessmentScene,
  SummaryScene,
  ChapterMarkerScene,
  CompositionMetadata,
} from "./types";

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface CurriculumLesson {
  id: string;
  title: string;
  order: number;
  reading?: string;
  keyConcepts?: Array<{ term: string; description: string }>;
  examples?: Array<{ title: string; description: string }>;
  exercises?: string[];
  reflection?: string;
}

export interface CurriculumCourse {
  id: string;
  title: string;
  modules: Array<{
    id: string;
    title: string;
    lessons: CurriculumLesson[];
  }>;
}

export interface PipelineOptions {
  /** Include chapter markers between modules */
  includeChapterMarkers?: boolean;
  /** Include assessment questions at end of lesson */
  includeAssessments?: boolean;
  /** Include summary at end of lesson */
  includeSummary?: boolean;
  /** Default scene duration in seconds */
  defaultDuration?: number;
  /** Title scene duration in seconds */
  titleDuration?: number;
}

const DEFAULT_OPTIONS: Required<PipelineOptions> = {
  includeChapterMarkers: true,
  includeAssessments: true,
  includeSummary: true,
  defaultDuration: 8,
  titleDuration: 5,
};

// ═══════════════════════════════════════════════════════════════════
// PIPELINE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Convert a single curriculum lesson into a VideoComposition.
 */
export function lessonToComposition(
  course: CurriculumCourse,
  moduleIndex: number,
  lesson: CurriculumLesson,
  options: PipelineOptions = {}
): VideoComposition {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const scenes: VideoScene[] = [];
  const module = course.modules[moduleIndex];

  // 1. Chapter marker (if first lesson in module)
  const isFirstLesson = module.lessons[0]?.id === lesson.id;
  if (opts.includeChapterMarkers && isFirstLesson) {
    scenes.push({
      id: `chapter-${module.id}`,
      type: "chapter-marker",
      duration: 4,
      chapterNumber: moduleIndex + 1,
      chapterTitle: module.title,
      transition: "fade",
    } as ChapterMarkerScene);
  }

  // 2. Title scene
  scenes.push({
    id: `title-${lesson.id}`,
    type: "title",
    duration: opts.titleDuration,
    title: lesson.title,
    courseTitle: course.title,
    moduleTitle: module.title,
    lessonNumber: lesson.order,
    transition: "fade",
  } as TitleScene);

  // 3. Key concepts as individual scenes
  if (lesson.keyConcepts && lesson.keyConcepts.length > 0) {
    for (const concept of lesson.keyConcepts) {
      scenes.push({
        id: `concept-${lesson.id}-${concept.term}`,
        type: "concept",
        duration: opts.defaultDuration,
        concept: concept.term,
        description: concept.description,
        transition: "slide-left",
      } as ConceptScene);
    }
  }

  // 4. Reading content split into chunks
  if (lesson.reading) {
    const chunks = splitIntoChunks(lesson.reading, 3);
    for (let i = 0; i < chunks.length; i++) {
      scenes.push({
        id: `reading-${lesson.id}-${i}`,
        type: "concept",
        duration: Math.max(opts.defaultDuration, chunks[i].length / 20),
        concept: i === 0 ? "Deep Dive" : `Deep Dive (continued)`,
        description: chunks[i],
        transition: "dissolve",
      } as ConceptScene);
    }
  }

  // 5. Examples
  if (lesson.examples && lesson.examples.length > 0) {
    for (const example of lesson.examples) {
      scenes.push({
        id: `example-${lesson.id}-${example.title}`,
        type: "case-study",
        duration: opts.defaultDuration + 2,
        title: example.title,
        scenario: example.description,
        question: "How does this illustrate the concept?",
        transition: "slide-right",
      });
    }
  }

  // 6. Process steps (if exercises exist)
  if (lesson.exercises && lesson.exercises.length > 0) {
    scenes.push({
      id: `process-${lesson.id}`,
      type: "process",
      duration: opts.defaultDuration + 4,
      title: "Practice Steps",
      steps: lesson.exercises.map((ex, i) => ({
        number: i + 1,
        title: `Step ${i + 1}`,
        description: ex,
      })),
      layout: "linear",
      transition: "slide-left",
    } as ProcessScene);
  }

  // 7. Assessment (if enabled)
  if (opts.includeAssessments && lesson.keyConcepts && lesson.keyConcepts.length > 0) {
    const concept = lesson.keyConcepts[0];
    scenes.push({
      id: `assessment-${lesson.id}`,
      type: "assessment",
      duration: 10,
      question: `Which of the following best describes "${concept.term}"?`,
      options: [
        concept.description,
        "A completely unrelated concept",
        "The opposite of the correct definition",
        "A partially correct but incomplete definition",
      ],
      correctIndex: 0,
      explanation: concept.description,
      transition: "dissolve",
    } as AssessmentScene);
  }

  // 8. Summary (if enabled)
  if (opts.includeSummary) {
    const keyPoints = [
      ...(lesson.keyConcepts?.map((c) => c.term) ?? []),
      ...(lesson.exercises?.slice(0, 2) ?? []),
    ];
    if (keyPoints.length > 0) {
      scenes.push({
        id: `summary-${lesson.id}`,
        type: "summary",
        duration: 6,
        title: "What We Learned",
        keyPoints: keyPoints.slice(0, 5),
        transition: "fade",
      } as SummaryScene);
    }
  }

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  return {
    id: `composition-${course.id}-${lesson.id}`,
    title: `${course.title} — ${lesson.title}`,
    description: `Video composition for ${lesson.title}`,
    scenes,
    metadata: {
      courseId: course.id,
      lessonId: lesson.id,
      totalDuration,
      sceneCount: scenes.length,
      createdAt: new Date().toISOString(),
      version: 1,
    },
  };
}

/**
 * Convert an entire course into multiple VideoCompositions (one per lesson).
 */
export function courseToCompositions(
  course: CurriculumCourse,
  options: PipelineOptions = {}
): VideoComposition[] {
  const compositions: VideoComposition[] = [];

  course.modules.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson) => {
      compositions.push(
        lessonToComposition(course, moduleIndex, lesson, options)
      );
    });
  });

  return compositions;
}

/**
 * Merge multiple compositions into a single long-form video.
 */
export function mergeCompositions(
  compositions: VideoComposition[],
  title?: string
): VideoComposition {
  const allScenes = compositions.flatMap((c) => c.scenes);
  const totalDuration = allScenes.reduce((sum, s) => sum + s.duration, 0);

  return {
    id: `merged-${Date.now()}`,
    title: title ?? `Merged Course (${compositions.length} lessons)`,
    description: `Combined video from ${compositions.length} lesson compositions`,
    scenes: allScenes,
    metadata: {
      courseId: compositions[0]?.metadata.courseId ?? "unknown",
      lessonId: "merged",
      totalDuration,
      sceneCount: allScenes.length,
      createdAt: new Date().toISOString(),
      version: 1,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Split text into roughly equal chunks by paragraph breaks.
 */
function splitIntoChunks(text: string, maxChunks: number): string[] {
  const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0);
  const chunkSize = Math.ceil(paragraphs.length / maxChunks);
  const chunks: string[] = [];

  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    chunks.push(paragraphs.slice(i, i + chunkSize).join("\n\n"));
  }

  return chunks.length > 0 ? chunks : [text];
}

/**
 * Generate a HyperFrame-compatible HTML representation of a composition.
 * This is a simple export for documentation/preview purposes.
 */
export function compositionToHTML(composition: VideoComposition): string {
  const sceneHTML = composition.scenes
    .map(
      (scene) => `
    <section class="scene scene-${scene.type}" data-duration="${scene.duration}">
      <h2>${scene.type}</h2>
      <pre>${JSON.stringify(scene, null, 2)}</pre>
    </section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${composition.title}</title>
  <style>
    body { font-family: Inter, sans-serif; background: #f5f1e6; margin: 0; padding: 40px; }
    .scene { background: white; border-radius: 12px; padding: 32px; margin-bottom: 24px; }
    h1 { font-family: 'Playfair Display', serif; color: #1a3a2a; }
    pre { background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>${composition.title}</h1>
  <p>${composition.description}</p>
  <p>Total duration: ${composition.metadata.totalDuration}s | Scenes: ${composition.metadata.sceneCount}</p>
  ${sceneHTML}
</body>
</html>`;
}
