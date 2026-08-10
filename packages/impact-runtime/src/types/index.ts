// Impact Runtime — Core Types

export type ProblemCategory =
  | "education"
  | "accessibility"
  | "healthcare"
  | "agriculture"
  | "environment"
  | "local-government"
  | "small-business"
  | "ngos"
  | "open-source"
  | "bhavya-foundation";

export interface Problem {
  id: string;
  title: string;
  category: ProblemCategory;
  statement: string;
  stakeholders: string[];
  background: string;
  constraints: string[];
  successCriteria: string[];
  knowledgePackages: string[];
  relatedRepositories: string[];
  suggestedAITechniques: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDuration: string;
  openSourceOpportunity: string;
  origin: "library" | "student-research" | "community";
}

export interface Research {
  id: string;
  problemId: string;
  articles: ResearchItem[];
  knowledgePackages: ResearchItem[];
  repositories: ResearchItem[];
  documentation: ResearchItem[];
  datasets: ResearchItem[];
  mcpCapabilities: ResearchItem[];
  aiTools: ResearchItem[];
  insights: string[];
  timestamp: string;
}

export interface ResearchItem {
  id: string;
  title: string;
  url?: string;
  description: string;
  relevance: string;
  type: "article" | "knowledge-package" | "repository" | "documentation" | "dataset" | "mcp" | "ai-tool";
}

export interface SolutionCanvas {
  id: string;
  problemId: string;
  problem: string;
  users: string;
  goals: string[];
  nonGoals: string[];
  constraints: string[];
  risks: string[];
  aiOpportunities: string[];
  ethics: string[];
  successMetrics: string[];
  designDecisions: DesignDecision[];
}

export interface DesignDecision {
  id: string;
  question: string;
  decision: string;
  rationale: string;
  knowledgePackageRefs: string[];
  alternatives: string[];
  timestamp: string;
}

export interface ImpactEvidence {
  id: string;
  problemId: string;
  whoBenefits: string;
  whatChanged: string;
  whatRemainsUnsolved: string;
  canBecomeOpenSource: boolean;
  canBeExtended: boolean;
  canBeDeployed: boolean;
  evidenceItems: EvidenceItem[];
  timestamp: string;
}

export interface EvidenceItem {
  id: string;
  type: "code" | "documentation" | "user-feedback" | "metric" | "screenshot" | "testimonial";
  description: string;
  content: string;
}

export interface OpenSourcePath {
  id: string;
  problemId: string;
  contributionType: "improve-repo" | "create-plugin" | "submit-docs" | "fix-issue" | "publish-component" | "new-project";
  targetRepository?: string;
  description: string;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedEffort: string;
}

export interface ImpactProject {
  id: string;
  problem: Problem;
  research: Research | null;
  canvas: SolutionCanvas | null;
  evidence: ImpactEvidence | null;
  openSourcePath: OpenSourcePath | null;
  status: "problem-selected" | "researching" | "planning" | "building" | "evidence" | "complete";
  createdAt: string;
  updatedAt: string;
}

export interface ImpactPortfolio {
  projectId: string;
  problemAddressed: string;
  usersHelped: string;
  researchPerformed: string[];
  knowledgePackagesUsed: string[];
  designDecisions: DesignDecision[];
  impactAchieved: string;
  openSourceContribution: string;
  lessonsLearned: string[];
  futureWork: string[];
  exportDate: string;
}

export interface ImpactDashboard {
  problemsInProgress: ImpactProject[];
  completedProjects: ImpactProject[];
  openSourceContributions: OpenSourcePath[];
  knowledgeGenerated: number;
  communitiesServed: string[];
}
