/**
 * Lesson Builder — Compiles Knowledge Objects into structured lessons
 *
 * execute(input, context) → { success, output, errors, warnings, duration }
 * validate(input)         → { valid, errors }
 * preview(output)        → Preview data
 */

export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];
  const output = {};

  try {
    const ko = input.knowledgeObject || input;
    const duration = input.duration || 45;
    const title = ko.title || input.title || "Untitled Lesson";
    const subject = ko.domain || input.subject || "General";
    const grade = input.grade || 9;

    // Generate learning outcomes from concepts
    const concepts = ko.concepts || [];
    const learningOutcomes = concepts.map((c, i) => ({
      id: `lo-${i + 1}`,
      description: c.description || `Understand ${c.name}`,
      bloomLevel: c.difficulty === "advanced" ? "analyze" : c.difficulty === "intermediate" ? "understand" : "remember",
    }));

    if (learningOutcomes.length === 0) {
      warnings.push({ message: "No concepts found in Knowledge Object. Default outcome generated." });
      learningOutcomes.push({
        id: "lo-1",
        description: `Understand ${title}`,
        bloomLevel: "remember",
      });
    }

    // Generate lesson sections
    const definitions = ko.definitions || [];
    const examples = ko.examples || [];
    const misconceptions = ko.misconceptions || [];
    const exercises = ko.exercises || [];

    const sections = [];

    sections.push({
      id: "s-intro", type: "introduction", title: `What is ${title}?`, order: 1,
      content: `${title} is a fundamental concept in ${subject}. This lesson introduces the core ideas and real-world applications.`,
    });

    if (concepts.length > 0) {
      sections.push({
        id: "s-concepts", type: "key-concepts", title: "Key Concepts", order: 2,
        content: concepts.map(c => `**${c.name}**: ${c.description}`).join("\n\n"),
      });
    }

    if (examples.length > 0) {
      sections.push({
        id: "s-examples", type: "visual-explanation", title: "Examples in Practice", order: 3,
        content: examples.map(e => `**${e.title}**: ${e.description}`).join("\n\n"),
      });
    }

    if (misconceptions.length > 0) {
      sections.push({
        id: "s-misconceptions", type: "examples", title: "Common Misconceptions", order: 4,
        content: misconceptions.map(m => `**❌ ${m.belief}** → ✅ ${m.correction}`).join("\n\n"),
      });
    }

    if (exercises.length > 0) {
      sections.push({
        id: "s-exercises", type: "exercises", title: "Practice Exercises", order: 5,
        content: exercises.map((e, i) => `${i + 1}. ${e.prompt} (${e.type})`).join("\n"),
      });
    }

    if (misconceptions.length > 0 || exercises.length > 0) {
      sections.push({
        id: "s-summary", type: "summary", title: "Summary", order: 6,
        content: `In this lesson, we explored ${title}. Key concepts include: ${concepts.map(c => c.name).join(", ")}. Practice these ideas through the exercises above.`,
      });
    }

    // Generate vocabulary
    const vocabulary = definitions.map(d => d.term);

    output.lesson = {
      id: `lesson-${Date.now()}`,
      title,
      subject,
      grade,
      duration,
      status: "draft",
      learningOutcomes,
      sections,
      vocabulary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "0.1.0",
    };

    output.ko = ko;

  } catch (err) {
    errors.push({ message: `Lesson generation failed: ${err.message}`, severity: "error" });
  }

  return {
    success: errors.length === 0,
    output,
    errors,
    warnings,
    duration: Date.now() - start,
  };
}

export async function validate(input) {
  const errors = [];
  const ko = input.knowledgeObject || input;
  if (!ko.id) errors.push({ field: "id", message: "Knowledge Object missing ID" });
  if (!ko.title) errors.push({ field: "title", message: "Knowledge Object missing title" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.lesson) return null;
  return {
    title: output.lesson.title,
    sections: output.lesson.sections.length,
    outcomes: output.lesson.learningOutcomes.length,
    duration: output.lesson.duration,
  };
}

export async function status(execId) {
  return { builder: "lesson", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "lesson", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "lesson", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
