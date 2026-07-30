function sceneGraphFromVisualSpec(vs) {
  if (!vs) return null;
  return {
    compositions: vs.scenes.map((scene, i) => ({
      id: scene.id,
      component: scene.type === "title-card" ? "TitleCard" :
                 scene.type === "diagram" ? "DiagramScene" :
                 scene.type === "comparison" ? "ComparisonScene" :
                 scene.type === "outro" ? "OutroCard" : "ContentScene",
      durationInFrames: Math.round(scene.duration / 1000 * 30),
      fps: 30,
      width: 1920,
      height: 1080,
      props: {
        elements: scene.elements.map(el => ({
          type: el.type,
          content: el.content,
          style: el.style,
          animation: el.animation,
          enterAt: Math.round((el.timing?.start || 0) / 1000 * 30),
          exitAt: Math.round((el.timing?.end || scene.duration) / 1000 * 30),
        })),
        palette: vs.colors,
        typography: vs.typography,
        transition: scene.transition ? {
          type: scene.transition.type,
          direction: scene.transition.direction,
          durationInFrames: Math.round(scene.transition.duration / 1000 * 30),
        } : null,
      },
    })),
    palette: vs.colors,
    typography: vs.typography,
    totalDurationInFrames: vs.scenes.reduce((sum, s) => sum + Math.round(s.duration / 1000 * 30), 0),
    fps: 30,
    width: 1920,
    height: 1080,
    renderUrl: null,
  };
}

export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];

  const lesson = input.lesson || {};
  const visualSpec = input.visualSpec || input;

  const sceneGraph = sceneGraphFromVisualSpec(visualSpec);

  if (!sceneGraph) {
    errors.push({ gate: "video-builder", message: "No valid visual spec provided" });
  }

  return {
    success: errors.length === 0,
    output: {
      video: {
        id: `video-${Date.now()}`,
        lessonId: lesson.id || `lesson-${Date.now()}`,
        title: `Video: ${lesson.title || "Untitled"}`,
        sceneGraph,
        compositions: sceneGraph?.compositions?.length || 0,
        totalFrames: sceneGraph?.totalDurationInFrames || 0,
        durationSeconds: sceneGraph ? Math.round(sceneGraph.totalDurationInFrames / sceneGraph.fps) : 0,
        width: 1920,
        height: 1080,
        fps: 30,
        formats: ["mp4", "webm"],
        createdAt: new Date().toISOString(),
        version: "0.1.0",
      },
    },
    errors,
    warnings,
    duration: Date.now() - start,
  };
}

export async function validate(input) {
  const errors = [];
  const vs = input.visualSpec || input;
  if (!vs.scenes?.length) errors.push({ field: "scenes", message: "Visual spec has no scenes" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.video) return null;
  return {
    title: output.video.title,
    compositions: output.video.compositions,
    duration: output.video.durationSeconds + "s",
    resolution: `${output.video.width}x${output.video.height}`,
  };
}

export async function status(execId) {
  return { builder: "video", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "video", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "video", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
