export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];

  const lesson = input.lesson || input;
  const title = lesson.title || "Untitled Lesson";
  const sections = lesson.sections || [];
  const exercises = input.knowledgeObject?.exercises || [];
  const ko = input.knowledgeObject || {};
  const koDefinitions = ko.definitions || [];
  const koExamples = ko.examples || [];
  const koConcepts = ko.concepts || [];
  const conceptNames = koConcepts.map(c => c.name).filter(Boolean);

  const pages = [];

  // Cover page
  pages.push({
    type: "cover",
    title: `Workbook: ${title}`,
    instructions: "Complete all exercises in this workbook. Show your work where applicable.",
  });

  // Key terms page — with definitions where available
  if (koDefinitions.length > 0 || conceptNames.length > 0) {
    const defMap = {};
    koDefinitions.forEach(d => { defMap[d.term.toLowerCase()] = d.definition; });
    const items = conceptNames.length > 0 ? conceptNames : koDefinitions.map(d => d.term);
    pages.push({
      type: "key-terms",
      title: "Key Terms",
      items: items.map(term => {
        const def = defMap[term.toLowerCase()];
        return def ? `${term}: ${def}` : term;
      }),
      instructions: conceptNames.length > 0
        ? "Review each term below. For terms without a definition, write your own based on what you learned."
        : "Review the following terms and their definitions.",
    });
  }

  // Section exercises — with KO examples and concept-specific questions
  const nonSummarySections = sections.filter(s => s.type !== "summary");
  nonSummarySections.forEach((section, i) => {
    const sectionExercises = exercises.filter((_, ei) => ei % Math.max(nonSummarySections.length, 1) === i);
    const relevantExamples = koExamples.filter(e =>
      section.content?.toLowerCase().includes(e.title.toLowerCase()) ||
      section.title?.toLowerCase().includes(e.title.toLowerCase())
    );
    const questions = [
      { prompt: `Summarize the main ideas from "${section.title}" in 3-4 sentences.`, type: "short-answer", points: 5 },
    ];
    if (section.type === "examples" && relevantExamples.length > 0) {
      questions.push({
        prompt: `Review the example "${relevantExamples[0].title}": ${relevantExamples[0].description}. Can you think of another example from your own experience?`,
        type: "reflection",
        points: 5,
      });
    } else if (section.type === "key-concepts") {
      questions.push({
        prompt: `Draw a diagram or mind map showing how the concepts in "${section.title}" connect to each other.`,
        type: "project",
        points: 10,
      });
    } else {
      questions.push({
        prompt: `How does "${section.title}" connect to what you already know? Give a specific example.`,
        type: "reflection",
        points: 5,
      });
    }
    sectionExercises.forEach((ex, ei) => {
      questions.push({
        prompt: ex.prompt || `Exercise ${ei + 1}`,
        type: ex.type || "short-answer",
        points: ex.type === "reflection" ? 5 : 10,
      });
    });
    pages.push({
      type: "section",
      title: section.title,
      sectionType: section.type,
      content: `Read and review "${section.title}" before completing the exercises below.`,
      questions,
    });
  });

  // Reflection page — content-specific
  const reflectionPrompts = [
    { prompt: `What was the most important concept you learned about ${title}? Why does it matter?`, type: "reflection", points: 5 },
    { prompt: "What questions do you still have about this topic? What would you like to learn next?", type: "reflection", points: 5 },
    conceptNames.length > 0
      ? { prompt: `How can you apply ${conceptNames.slice(0, 2).join(" and ")} in your daily life or future studies?`, type: "reflection", points: 5 }
      : { prompt: "How can you apply what you learned in your daily life?", type: "reflection", points: 5 },
  ];
  pages.push({
    type: "reflection",
    title: "Reflection",
    questions: reflectionPrompts,
  });

  if (pages.length < 2) {
    warnings.push({ message: "Workbook has fewer than 2 pages. Add more content." });
  }

  return {
    success: errors.length === 0,
    output: {
      workbook: {
        id: `workbook-${Date.now()}`,
        lessonId: lesson.id || `lesson-${Date.now()}`,
        title: `Workbook: ${title}`,
        pages,
        totalPages: pages.length,
        totalPoints: pages.reduce((sum, p) => sum + (p.questions || []).reduce((s, q) => s + (q.points || 0), 0), 0),
        formats: ["pdf", "html"],
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
  const lesson = input.lesson || input;
  const errors = [];
  if (!lesson.title) errors.push({ field: "title", message: "Lesson missing title" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.workbook) return null;
  return {
    title: output.workbook.title,
    pages: output.workbook.totalPages,
    totalPoints: output.workbook.totalPoints,
  };
}

export async function status(execId) {
  return { builder: "workbook", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "workbook", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "workbook", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
