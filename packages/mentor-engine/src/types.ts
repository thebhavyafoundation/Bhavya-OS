export type MentorMode = "teach" | "question" | "coach" | "encourage";

export interface MentorContext {
  currentLesson?: string;
  currentModule?: string;
  currentCourse?: string;
  studentProgress: number;
  strengths: string[];
  weaknesses: string[];
  recentTopics: string[];
  streak: number;
  level: number;
}

export interface MentorMessage {
  id: string;
  role: "student" | "mentor";
  content: string;
  timestamp: Date;
  mode?: MentorMode;
  context?: string;
}

export interface MentorResponse {
  content: string;
  mode: MentorMode;
  suggestedActions: string[];
  relatedTopics: string[];
}

export interface KnowledgeEntry {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  patterns: string[];
  answer: string;
  followUpQuestions: string[];
  relatedConcepts: string[];
}

export interface MentorPersonality {
  name: string;
  avatar: string;
  greeting: string;
  styles: Record<
    MentorMode,
    {
      description: string;
      tone: string;
      techniques: string[];
    }
  >;
  guidelines: string[];
}
