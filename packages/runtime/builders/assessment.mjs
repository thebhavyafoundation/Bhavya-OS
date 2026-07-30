export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];

  const lesson = input.lesson || input;
  const outcomes = lesson.learningOutcomes || [];
  const sections = (lesson.sections || []).filter(s => s.type !== "summary");
  const ko = input.knowledgeObject || {};
  const koExercises = ko.exercises || [];
  const koConcepts = ko.concepts || [];
  const koDefinitions = ko.definitions || [];
  const koMisconceptions = ko.misconceptions || [];
  const koExamples = ko.examples || [];

  const questions = [];
  let totalPoints = 0;

  // Pick random index helper
  function randIdx(len) { return Math.floor(Math.random() * len); }

  // Pick N random items from array
  function pickN(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  // 1. MCQ from outcomes — use real definitions as options
  outcomes.forEach((outcome, i) => {
    if (questions.length >= 5) return;
    const matchingDefs = koDefinitions.filter(d =>
      outcome.description.toLowerCase().includes(d.term.toLowerCase())
    );
    const options = [];
    if (matchingDefs.length > 0) {
      options.push(matchingDefs[0].definition);
    } else {
      options.push(`Correct: ${outcome.description}`);
    }
    const misconceptionTexts = koMisconceptions.map(m => m.belief);
    const usedDistractors = pickN(misconceptionTexts.length > 0 ? misconceptionTexts : koDefinitions.map(d => d.definition).filter(Boolean), 3);
    while (options.length < 4 && usedDistractors.length > 0) {
      const d = usedDistractors.shift();
      if (!options.includes(d)) options.push(d);
    }
    while (options.length < 4) {
      const fallbacks = [
        `${outcome.description} is not related to this topic`,
        `A common misinterpretation of ${outcome.description}`,
        `This describes a different concept entirely`,
      ];
      for (const f of fallbacks) {
        if (options.length >= 4) break;
        if (!options.includes(f)) options.push(f);
      }
    }
    const correctIdx = randIdx(options.length);
    questions.push({
      id: `q-mcq-${i + 1}`,
      type: "mcq",
      prompt: `Which statement best describes ${outcome.description}?`,
      options,
      correctAnswer: correctIdx,
      bloomLevel: outcome.bloomLevel || "understand",
      difficulty: outcome.bloomLevel === "remember" ? "easy" : outcome.bloomLevel === "analyze" || outcome.bloomLevel === "evaluate" ? "hard" : "medium",
    });
    totalPoints += 5;
  });

  // 2. MCQ from misconceptions — test correction knowledge
  koMisconceptions.forEach((m, i) => {
    if (questions.length >= 8) return;
    const correct = m.correction;
    const distractors = koMisconceptions
      .filter((_, j) => j !== i)
      .slice(0, 3)
      .map(x => x.correction);
    const options = [correct, ...distractors];
    while (options.length < 4) {
      options.push(`An unrelated explanation`);
    }
    const correctIdx = 0;
    questions.push({
      id: `q-misc-${i + 1}`,
      type: "mcq",
      prompt: `Which of the following corrects this misconception: "${m.belief}"?`,
      options,
      correctAnswer: correctIdx,
      bloomLevel: "analyze",
      difficulty: "medium",
    });
    totalPoints += 5;
  });

  // 3. Short-answer from sections — with content-specific rubrics
  sections.forEach((section, i) => {
    if (questions.length >= 10) return;
    const relevantConcepts = koConcepts.filter(c =>
      section.content.toLowerCase().includes(c.name.toLowerCase())
    );
    const rubricParts = [];
    if (relevantConcepts.length > 0) {
      rubricParts.push(`Must correctly discuss: ${relevantConcepts.map(c => c.name).join(", ")}`);
    }
    rubricParts.push("Clear explanation with examples");
    rubricParts.push("Demonstrates understanding of key ideas");
    questions.push({
      id: `q-sa-${i + 1}`,
      type: "short-answer",
      prompt: `Explain the key ideas from "${section.title}" in your own words. Include specific details about what you learned.`,
      rubric: rubricParts.join(". "),
      bloomLevel: "understand",
      difficulty: "medium",
    });
    totalPoints += 10;
  });

  // 4. Reflection from KO exercises
  koExercises.forEach((ex, i) => {
    if (questions.length >= 12) return;
    if (ex.type === "reflection") {
      questions.push({
        id: `q-ref-${i + 1}`,
        type: "long-answer",
        prompt: ex.prompt || "Reflect on what you learned and how it connects to your own experience.",
        rubric: "Personal connection, evidence of understanding, thoughtful response with specific examples.",
        bloomLevel: "evaluate",
        difficulty: "medium",
      });
      totalPoints += 15;
    }
  });

  // 5. Practical from advanced concepts with KO examples as reference
  koConcepts.forEach((c, i) => {
    if (questions.length >= 15) return;
    const relatedExamples = koExamples.filter(e =>
      e.title.toLowerCase().includes(c.name.toLowerCase()) ||
      e.description.toLowerCase().includes(c.name.toLowerCase())
    );
    const exampleHint = relatedExamples.length > 0
      ? ` Consider the example: "${relatedExamples[0].title}."`
      : "";
    questions.push({
      id: `q-prac-${i + 1}`,
      type: "practical",
      prompt: c.difficulty === "advanced"
        ? `Create a practical demonstration of ${c.name}.${exampleHint} Explain your approach and what it shows.`
        : `Give a real-world example of ${c.name} from your own experience.`,
      rubric: `Correct application of ${c.name}, creativity, and clear explanation of how it demonstrates the concept.`,
      bloomLevel: "create",
      difficulty: c.difficulty === "advanced" ? "hard" : "medium",
    });
    totalPoints += c.difficulty === "advanced" ? 20 : 10;
  });

  if (questions.length < 3) {
    warnings.push({ message: "Fewer than 3 questions generated. Add more content to improve assessment quality." });
  }

  const lessonId = lesson.id || `lesson-${Date.now()}`;

  return {
    success: errors.length === 0,
    output: {
      assessment: {
        id: `assessment-${Date.now()}`,
        lessonId,
        title: `Assessment: ${lesson.title || "Lesson"}`,
        questions,
        totalPoints,
        passingScore: Math.round(totalPoints * 0.6),
        questionCount: questions.length,
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
  const lesson = input.lesson || input;
  if (!lesson.id) errors.push({ field: "id", message: "Lesson missing ID" });
  if (!lesson.learningOutcomes?.length) errors.push({ field: "learningOutcomes", message: "Lesson has no learning outcomes" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.assessment) return null;
  return {
    title: output.assessment.title,
    questions: output.assessment.questionCount,
    totalPoints: output.assessment.totalPoints,
    passingScore: output.assessment.passingScore,
  };
}

export async function status(execId) {
  return { builder: "assessment", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "assessment", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "assessment", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
