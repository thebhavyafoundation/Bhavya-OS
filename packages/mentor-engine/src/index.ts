export type {
  MentorMode,
  MentorContext,
  MentorMessage,
  MentorResponse,
  KnowledgeEntry,
  MentorPersonality,
} from "./types.js";

export { mentorPersonality } from "./personality.js";
export { knowledgeBase } from "./knowledge-base.js";

export {
  detectMode,
  findRelevantKnowledge,
  generateResponse,
  suggestNextSteps,
  analyzeWeaknesses,
  getEncouragement,
} from "./engine.js";
