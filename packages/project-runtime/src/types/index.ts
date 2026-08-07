// Project Runtime — Core Types

export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  objectives: string[];
  milestones: Milestone[];
  knowledgePackages: ProjectKnowledgePackage[];
  resources: Resource[];
  status: "not-started" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  order: number;
  title: string;
  description: string;
  tasks: Task[];
  reflection?: Reflection;
  status: "locked" | "available" | "in-progress" | "completed";
  evidence?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "research" | "design" | "build" | "test" | "document" | "reflect";
  status: "pending" | "in-progress" | "completed";
  output?: string;
  notes?: string;
  knowledgePackageIds?: string[];
}

export interface Reflection {
  id: string;
  milestoneId?: string;
  whatDifficult: string;
  whatChanged: string;
  whatRedesign: string;
  whichSuggestionHelped: string;
  whichSuggestionRejected: string;
  timestamp: string;
}

export interface ProjectKnowledgePackage {
  id: string;
  title: string;
  type: "repository" | "pattern" | "mcp" | "cli" | "article" | "lesson" | "lab";
  url?: string;
  relevance: string;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  type: "repository" | "tool" | "documentation" | "example";
  url: string;
  description: string;
}

export interface ProjectDNA {
  mission: string;
  realWorldProblem: string;
  learningObjectives: string[];
  skillsGained: string[];
  knowledgePackagesUsed: string[];
  engineeringPatterns: string[];
  aiCapabilitiesPracticed: string[];
  portfolioOutcome: string;
  openSourceContributionPath: string;
  extensionIdeas: string[];
}

export interface ProjectPortfolio {
  projectId: string;
  title: string;
  problem: string;
  architecture: string;
  skillsDemonstrated: string[];
  knowledgePackagesUsed: string[];
  reflection: Reflection[];
  githubRepository?: string;
  futureImprovements: string[];
  exportDate: string;
}

export interface RepositoryStructure {
  name: string;
  description: string;
  readme: string;
  architecture: string;
  learningJournal: string;
  knowledgePackageRefs: string[];
  portfolioMetadata: ProjectPortfolio;
}

export interface AIProjectCoachResponse {
  type: "clarify" | "suggest" | "review" | "encourage" | "question" | "recommend";
  content: string;
  milestoneId?: string;
  taskId?: string;
  knowledgePackageIds?: string[];
}
