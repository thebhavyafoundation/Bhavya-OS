const SUBJECT_PALETTES = {
  default: { primary: "#2563eb", secondary: "#7c3aed", accent: "#f59e0b", background: "#f8fafc", text: "#1e293b", surface: "#ffffff" },
  science: { primary: "#059669", secondary: "#0284c7", accent: "#d97706", background: "#f0fdf4", text: "#1e293b", surface: "#ffffff" },
  math: { primary: "#dc2626", secondary: "#2563eb", accent: "#7c3aed", background: "#fef2f2", text: "#1e293b", surface: "#ffffff" },
  technology: { primary: "#2563eb", secondary: "#059669", accent: "#dc2626", background: "#eff6ff", text: "#1e293b", surface: "#ffffff" },
  language: { primary: "#db2777", secondary: "#7c3aed", accent: "#f59e0b", background: "#fdf2f8", text: "#1e293b", surface: "#ffffff" },
  social: { primary: "#ca8a04", secondary: "#dc2626", accent: "#2563eb", background: "#fefce8", text: "#1e293b", surface: "#ffffff" },
  art: { primary: "#db2777", secondary: "#f59e0b", accent: "#059669", background: "#fdf2f8", text: "#1e293b", surface: "#ffffff" },
};

function getPalette(subject) {
  const s = (subject || "").toLowerCase();
  for (const key of Object.keys(SUBJECT_PALETTES)) {
    if (s.includes(key) || key === "default") return SUBJECT_PALETTES[key];
  }
  return SUBJECT_PALETTES.default;
}

function getSceneType(sectionType) {
  const map = {
    introduction: "title-card",
    "key-concepts": "explanation",
    "visual-explanation": "diagram",
    examples: "showcase",
    misconceptions: "comparison",
    exercises: "interactive",
    summary: "outro",
  };
  return map[sectionType] || "content";
}

export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];

  const lesson = input.lesson || input;
  const title = lesson.title || "Untitled";
  const sections = lesson.sections || [];
  const outcomes = lesson.learningOutcomes || [];
  const subject = lesson.subject || "default";
  const duration = lesson.duration || 45;

  const palette = getPalette(subject);
  const totalDurationMs = duration * 60 * 1000;

  const scenes = [];

  // Intro scene
  scenes.push({
    id: "scene-intro",
    type: "title-card",
    duration: 8000,
    elements: [
      { type: "text", content: title, style: "heading", animation: "fade-in", timing: { start: 0, end: 4000 } },
      { type: "text", content: `${subject} | Grade ${lesson.grade || "N/A"}`, style: "subtitle", animation: "slide-up", timing: { start: 2000, end: 6000 } },
      { type: "shape", content: "accent-bar", style: "decorative", animation: "scale-in", timing: { start: 1000, end: 3000 } },
    ],
    transition: { type: "fade", duration: 500 },
  });

  // One scene per section
  sections.forEach((section, i) => {
    const sceneType = getSceneType(section.type);
    const sceneDuration = Math.max(5000, Math.min(30000, totalDurationMs / Math.max(sections.length, 1) / 4));
    const elements = [
      { type: "text", content: section.title, style: "section-title", animation: "slide-in-left", timing: { start: 0, end: 2000 } },
    ];
    if (section.content) {
      const contentPreview = section.content.length > 200 ? section.content.slice(0, 200) + "..." : section.content;
      elements.push({
        type: "text", content: contentPreview, style: "body", animation: "fade-in", timing: { start: 1500, end: sceneDuration - 1000 },
      });
    }
    if (sceneType === "diagram") {
      elements.push({
        type: "diagram", content: "concept-map", style: "visual", animation: "grow", timing: { start: 2000, end: sceneDuration - 500 },
      });
    }
    if (sceneType === "comparison") {
      elements.push({
        type: "shape", content: "split-panel", style: "comparison", animation: "slide-in-right", timing: { start: 2000, end: sceneDuration - 500 },
      });
    }
    scenes.push({
      id: `scene-${i + 1}`,
      type: sceneType,
      duration: sceneDuration,
      elements,
      transition: i < sections.length - 1 ? { type: "slide", direction: "left", duration: 400 } : undefined,
    });
  });

  // Outro scene with outcomes
  if (outcomes.length > 0) {
    scenes.push({
      id: "scene-outro",
      type: "outro",
      duration: 8000,
      elements: [
        { type: "text", content: "Key Takeaways", style: "heading", animation: "fade-in", timing: { start: 0, end: 2000 } },
        ...outcomes.slice(0, 3).map((o, i) => ({
          type: "text", content: o.description || o, style: "bullet", animation: "slide-up", timing: { start: 2000 + i * 1500, end: 2000 + i * 1500 + 1000 },
        })),
      ],
      transition: { type: "fade", duration: 500 },
    });
  }

  return {
    success: errors.length === 0,
    output: {
      visualSpec: {
        id: `vs-${Date.now()}`,
        lessonId: lesson.id || `lesson-${Date.now()}`,
        title: `Visual Spec: ${title}`,
        colors: palette,
        typography: {
          heading: "system-ui, sans-serif",
          body: "system-ui, sans-serif",
          mono: "monospace",
        },
        scenes,
        totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
        totalScenes: scenes.length,
        version: "0.1.0",
        createdAt: new Date().toISOString(),
      },
    },
    errors,
    warnings,
    duration: Date.now() - start,
  };
}

export async function validate(input) {
  const lesson = input.lesson || input;
  const errors = [];
  if (!lesson.sections?.length) errors.push({ field: "sections", message: "Lesson has no sections" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.visualSpec) return null;
  return {
    title: output.visualSpec.title,
    scenes: output.visualSpec.totalScenes,
    duration: output.visualSpec.totalDuration,
    colors: output.visualSpec.colors,
  };
}

export async function status(execId) {
  return { builder: "visual-spec", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "visual-spec", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "visual-spec", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
