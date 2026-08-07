import {
  MentorMode,
  MentorContext,
  MentorMessage,
  MentorResponse,
  KnowledgeEntry,
} from "./types.js";
import { mentorPersonality } from "./personality.js";
import { knowledgeBase } from "./knowledge-base.js";

const modeKeywords: Record<MentorMode, string[]> = {
  teach: [
    "what is",
    "explain",
    "how does",
    "describe",
    "tell me about",
    "define",
    "meaning of",
    "introduction",
    "basics",
    "learn",
    "understand",
    "concept",
    "tutorial",
    "guide",
  ],
  question: [
    "why",
    "how would you",
    "what if",
    "can you think",
    "do you think",
    "is it possible",
    "what happens",
    "challenge",
    "debate",
  ],
  coach: [
    "help me practice",
    "quiz me",
    "test me",
    "give me an exercise",
    "what should i study",
    "improve",
    "challenge me",
    "next level",
    "harder",
    "drill",
  ],
  encourage: [
    "i'm stuck",
    "this is hard",
    "i don't understand",
    "frustrated",
    "confused",
    "give up",
    "too difficult",
    "i can't",
    "help me",
    "motivation",
  ],
};

export function detectMode(message: string): MentorMode {
  const lower = message.toLowerCase();
  let bestMode: MentorMode = "teach";
  let bestScore = 0;

  for (const [mode, keywords] of Object.entries(modeKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMode = mode as MentorMode;
    }
  }

  if (bestScore === 0) {
    const questionIndicators = [
      "?",
      "what",
      "how",
      "why",
      "when",
      "where",
      "who",
    ];
    if (questionIndicators.some((i) => lower.includes(i))) {
      return "question";
    }
    return "teach";
  }

  return bestMode;
}

export function findRelevantKnowledge(
  message: string,
  context: MentorContext,
): KnowledgeEntry[] {
  const lower = message.toLowerCase();
  const scored: Array<{ entry: KnowledgeEntry; score: number }> = [];

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) {
        score += pattern.length;
      }
    }
    for (const concept of entry.relatedConcepts) {
      if (lower.includes(concept)) {
        score += concept.length * 0.5;
      }
    }
    if (context.recentTopics.includes(entry.topic.toLowerCase())) {
      score += 2;
    }
    if (context.weaknesses.includes(entry.topic.toLowerCase())) {
      score += 3;
    }
    if (score > 0) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.entry);
}

const encourageMessages = [
  "Every expert was once a beginner. You're on the right track!",
  "Struggling with a concept means you're pushing your boundaries — that's growth!",
  "The fact that you're asking shows you're engaged. That matters more than getting it right immediately.",
  "Learning AI is like climbing a mountain — the view from each milestone is worth the effort.",
  "Your persistence is building a strong foundation. Keep going!",
  "It's okay to not know — that's why we learn. What specifically is confusing?",
  "Break it into smaller pieces. You've already understood harder things than this!",
  "Progress isn't always linear. Some days you plateau, then suddenly everything clicks.",
];

const followUpSuggestions: Record<MentorMode, string[]> = {
  teach: [
    "Try a practice exercise on this topic",
    "Explore related concepts",
    "Review the key terms",
    "Move to the next subtopic",
  ],
  question: [
    "Think about a real-world example",
    "Try explaining it to someone else",
    "Consider edge cases",
    "Challenge your own understanding",
  ],
  coach: [
    "Complete the practice quiz",
    "Work on a hands-on project",
    "Review weak areas",
    "Set a learning goal",
  ],
  encourage: [
    "Take a short break and come back",
    "Revisit the fundamentals",
    "Ask about a specific part that's unclear",
    "Try a simpler example first",
  ],
};

function generateTeachResponse(
  knowledge: KnowledgeEntry[],
  context: MentorContext,
): string {
  if (knowledge.length === 0) {
    return `That's a great question! Let me help you explore this topic. Based on what you're currently learning in ${context.currentModule || "your module"}, I'd suggest breaking this down step by step. What specific aspect would you like me to explain first?`;
  }

  const primary = knowledge[0];
  let response = primary.answer;

  if (context.studentProgress > 50) {
    response += `\n\nSince you've already made good progress (${context.studentProgress}%), you might appreciate the deeper connection: this relates to ${primary.relatedConcepts.join(", ")}.`;
  }

  if (knowledge.length > 1) {
    response += `\n\nRelated topics you might find interesting: ${knowledge
      .slice(1)
      .map((k) => k.subtopic)
      .join(", ")}.`;
  }

  return response;
}

function generateQuestionResponse(
  knowledge: KnowledgeEntry[],
  context: MentorContext,
): string {
  if (knowledge.length === 0) {
    return `Interesting question! Before I answer — what do you think? Walk me through your reasoning. There are no wrong answers here; thinking through it is what builds understanding.`;
  }

  const primary = knowledge[0];
  const followUps = primary.followUpQuestions;

  let response = `Great question. Let me ask you this first: ${followUps[0]}`;

  if (context.weaknesses.some((w) => primary.topic.toLowerCase().includes(w))) {
    response += `\n\nThis touches on an area you're still building strength in. Let's work through it together.`;
  }

  response += `\n\n${primary.answer}`;
  return response;
}

function generateCoachResponse(
  knowledge: KnowledgeEntry[],
  context: MentorContext,
): string {
  let response = "";

  if (context.weaknesses.length > 0) {
    response = `Let's focus on strengthening your weak areas: ${context.weaknesses.join(", ")}. `;
  }

  if (context.streak > 0) {
    response += `You're on a ${context.streak}-day streak! Let's keep that momentum going. `;
  }

  if (knowledge.length > 0) {
    response += `Here's a challenge: based on what we just covered, try to ${knowledge[0].followUpQuestions[1] || "apply this concept to a new problem"}. Think about it and come back with your answer.`;
  } else {
    response += `What topic would you like to practice? I can quiz you, give you exercises, or set a challenge at your level (${context.level}).`;
  }

  return response;
}

function generateEncourageResponse(context: MentorContext): string {
  const base =
    encourageMessages[Math.floor(Math.random() * encourageMessages.length)];

  let response = base;

  if (context.streak > 3) {
    response += `\n\nYour ${context.streak}-day streak shows real commitment. That consistency is what separates those who learn from those who don't.`;
  }

  if (context.studentProgress > 30) {
    response += `\n\nYou've already completed ${context.studentProgress}% of the material. You're doing better than you think!`;
  }

  const suggestions = followUpSuggestions.coach;
  response += `\n\nHere's what I suggest: ${suggestions[Math.floor(Math.random() * suggestions.length)]}`;

  return response;
}

export function generateResponse(
  message: MentorMessage,
  context: MentorContext,
  mode?: MentorMode,
): MentorResponse {
  const resolvedMode = mode || detectMode(message.content);
  const knowledge = findRelevantKnowledge(message.content, context);

  let content: string;
  switch (resolvedMode) {
    case "teach":
      content = generateTeachResponse(knowledge, context);
      break;
    case "question":
      content = generateQuestionResponse(knowledge, context);
      break;
    case "coach":
      content = generateCoachResponse(knowledge, context);
      break;
    case "encourage":
      content = generateEncourageResponse(context);
      break;
  }

  const relatedTopics = knowledge.flatMap((k) => k.relatedConcepts).slice(0, 5);
  const suggestedActions = followUpSuggestions[resolvedMode];

  return {
    content,
    mode: resolvedMode,
    suggestedActions,
    relatedTopics,
  };
}

export function suggestNextSteps(context: MentorContext): string[] {
  const steps: string[] = [];

  if (context.weaknesses.length > 0) {
    steps.push(`Review and practice: ${context.weaknesses[0]}`);
  }

  if (context.currentModule) {
    steps.push(`Continue with the next lesson in ${context.currentModule}`);
  }

  if (context.studentProgress < 30) {
    steps.push("Focus on foundational concepts before moving forward");
  } else if (context.studentProgress < 70) {
    steps.push("Mix theory with hands-on practice");
  } else {
    steps.push("Explore advanced topics and real-world projects");
  }

  if (context.streak === 0) {
    steps.push("Start a learning streak — even 15 minutes a day helps");
  } else if (context.streak > 5) {
    steps.push("Consider tackling a bigger project to solidify your skills");
  }

  steps.push(`Practice with a quiz on your recent topics`);

  return steps;
}

export function analyzeWeaknesses(progress: Record<string, number>): string[] {
  const weaknesses: string[] = [];

  for (const [topic, score] of Object.entries(progress)) {
    if (score < 50) {
      weaknesses.push(topic);
    }
  }

  return weaknesses;
}

export function getEncouragement(context: MentorContext): string {
  return generateEncourageResponse(context);
}
