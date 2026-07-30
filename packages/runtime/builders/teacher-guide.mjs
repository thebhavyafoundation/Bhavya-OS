export async function execute(input, context = {}) {
  const start = Date.now();
  const errors = [];
  const warnings = [];

  const lesson = input.lesson || input;
  const title = lesson.title || "Untitled Lesson";
  const outcomes = lesson.learningOutcomes || [];
  const sections = lesson.sections || [];
  const vocabulary = lesson.vocabulary || [];
  const exercises = (input.knowledgeObject?.exercises || lesson.exercises) || [];
  const ko = input.knowledgeObject || {};
  const koConcepts = ko.concepts || [];
  const koDefinitions = ko.definitions || [];
  const subject = lesson.subject || "general";
  const grade = lesson.grade || 9;

  const objectives = outcomes.map(o => o.description);

  // Dynamic materials based on subject and grade
  const isSTEM = ["math", "science", "physics", "chemistry", "biology", "technology", "computer", "engineering"].some(s => subject.toLowerCase().includes(s));
  const isHumanities = ["history", "geography", "language", "literature", "art", "music", "social"].some(s => subject.toLowerCase().includes(s));
  const lowerGrade = grade <= 5;
  const upperGrade = grade >= 10;

  const materials = [
    isSTEM ? (lowerGrade ? "Interactive whiteboard with visual aids" : "Projector for demonstrations and simulations") : "Projector or smart board",
    isSTEM ? (upperGrade ? "Scientific calculators or graphing tools" : "Counters and manipulatives") : "Whiteboard and markers",
    "Student notebooks or digital devices",
    isHumanities ? "Printed reading passages and handouts" : "Printed handouts and worksheets",
    isSTEM ? (upperGrade ? "Lab materials or simulation software" : "Simple experiment materials") : "Reference books or articles",
  ].slice(0, lowerGrade ? 4 : 5);

  // Subject-specific discussion prompts referencing concepts
  const conceptNames = koConcepts.map(c => c.name).filter(Boolean);
  const discussionPrompts = sections.map(s => {
    const relevantConcepts = conceptNames.filter(c =>
      s.content?.toLowerCase().includes(c.toLowerCase()) ||
      s.title?.toLowerCase().includes(c.toLowerCase())
    );
    const conceptHint = relevantConcepts.length > 0
      ? ` Focus on ${relevantConcepts.slice(0, 2).join(" and ")}.`
      : "";
    if (s.type === "introduction") {
      return `What do you already know about ${title}? Share an experience related to this topic.${conceptHint}`;
    }
    if (s.type === "key-concepts") {
      return `Can you explain the key concepts from "${s.title}" in your own words?${conceptHint} How do they connect to what we learned before?`;
    }
    if (s.type === "visual-explanation") {
      return `What did the demonstration in "${s.title}" show you?${conceptHint} Can you think of another way to represent this?`;
    }
    if (s.type === "examples") {
      const concept = relevantConcepts[0] || "this topic";
      return `Can you think of a real-world example of ${concept}? How does it differ from the examples we discussed?`;
    }
    if (s.type === "exercises") {
      return `Which exercise challenged you the most?${conceptHint} What strategy did you use to solve it?`;
    }
    return `What did you learn from "${s.title}"? Can you give an example from your own experience?${conceptHint}`;
  });

  const commonMisconceptions = input.knowledgeObject?.misconceptions?.map(m => `${m.belief} → ${m.correction}`) || [];

  // Timing guide — varied by section type and grade
  const timingGuide = sections.map(s => {
    const base = s.type === "introduction" ? 5 : s.type === "summary" ? 5 : s.type === "exercises" ? 15 : 10;
    const gradeAdjust = grade >= 8 ? 0 : 2;
    return {
      section: s.title,
      duration: base + gradeAdjust,
      activity: s.type === "introduction" ? "Hook activity, prior knowledge activation, and lesson overview" :
               s.type === "key-concepts" ? "Direct instruction with guided note-taking and examples" :
               s.type === "visual-explanation" ? "Demonstration with guided observation and discussion" :
               s.type === "examples" ? "Collaborative analysis of examples in small groups" :
               s.type === "exercises" ? "Independent or pair practice with teacher facilitation" :
               s.type === "misconceptions" ? "Address common misconceptions through discussion and correction" :
               "Review key takeaways, Q&A, and exit ticket",
    };
  });

  if (timingGuide.length === 0) {
    warnings.push({ message: "No sections found. Timing guide will be empty." });
  }

  const answerKeys = exercises.map((ex, i) => ({
    questionId: `ex-${i + 1}`,
    question: ex.prompt || "",
    expectedAnswer: ex.solution || "Answers will vary. Look for evidence of understanding.",
    rubric: ex.type === "mcq" ? "Check for correct option selection" :
            ex.type === "short-answer" ? "Look for key concepts and clear explanation" :
            "Evaluate based on depth of thought and application",
  }));

  // Vocabulary with definitions where available
  const vocabWithDefs = koDefinitions.length > 0
    ? koDefinitions.map(d => `${d.term}: ${d.definition}`)
    : vocabulary;

  return {
    success: errors.length === 0,
    output: {
      teacherGuide: {
        id: `guide-${Date.now()}`,
        lessonId: lesson.id || `lesson-${Date.now()}`,
        title: `Teacher Guide: ${title}`,
        objectives,
        vocabulary: [...new Set(vocabWithDefs.length > 0 ? vocabWithDefs : vocabulary)],
        materials,
        discussionPrompts,
        commonMisconceptions,
        answerKeys,
        timingGuide,
        totalDuration: timingGuide.reduce((sum, t) => sum + t.duration, 0),
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
  if (!lesson.sections?.length) errors.push({ field: "sections", message: "Lesson has no sections" });
  return { valid: errors.length === 0, errors };
}

export async function preview(output) {
  if (!output?.teacherGuide) return null;
  return {
    title: output.teacherGuide.title,
    objectives: output.teacherGuide.objectives.length,
    vocabulary: output.teacherGuide.vocabulary.length,
    sections: output.teacherGuide.timingGuide.length,
    totalDuration: output.teacherGuide.totalDuration,
  };
}

export async function status(execId) {
  return { builder: "teacher-guide", executionId: execId, available: true };
}

export async function cancel(execId) {
  return { builder: "teacher-guide", executionId: execId, cancelled: true };
}

export async function resume(execId, state) {
  return { builder: "teacher-guide", executionId: execId, resumed: true, state };
}

export default { execute, validate, preview, status, cancel, resume };
