import type {
  Problem,
  Research,
  SolutionCanvas,
  ImpactEvidence,
  OpenSourcePath,
  ImpactProject,
  ImpactPortfolio,
  ImpactDashboard,
  ResearchItem,
  DesignDecision,
  EvidenceItem,
} from "../types";

export class ImpactEngine {
  private projects: Map<string, ImpactProject> = new Map();

  // Problem selection
  selectProblem(problem: Problem): ImpactProject {
    const project: ImpactProject = {
      id: `impact-${Date.now()}`,
      problem,
      research: null,
      canvas: null,
      evidence: null,
      openSourcePath: null,
      status: "problem-selected",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(project.id, project);
    this.saveToStorage();
    return project;
  }

  // Research
  addResearch(projectId: string, research: Omit<Research, "id" | "timestamp">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    project.research = {
      ...research,
      id: `research-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    project.status = "researching";
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  addResearchItem(projectId: string, category: keyof Omit<Research, "id" | "problemId" | "timestamp" | "insights">, item: Omit<ResearchItem, "id">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project || !project.research) return undefined;
    const existing = project.research[category];
    if (Array.isArray(existing)) {
      (existing as ResearchItem[]).push({ ...item, id: `ri-${Date.now()}` } as ResearchItem);
    }
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  addInsight(projectId: string, insight: string): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project || !project.research) return undefined;
    project.research.insights.push(insight);
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  // Solution Canvas
  createCanvas(projectId: string, canvas: Omit<SolutionCanvas, "id" | "problemId">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    project.canvas = {
      ...canvas,
      id: `canvas-${Date.now()}`,
      problemId: project.problem.id,
    };
    project.status = "planning";
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  addDesignDecision(projectId: string, decision: Omit<DesignDecision, "id" | "timestamp">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project || !project.canvas) return undefined;
    project.canvas.designDecisions.push({
      ...decision,
      id: `dd-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  // Evidence
  addEvidence(projectId: string, evidence: Omit<ImpactEvidence, "id" | "timestamp">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    project.evidence = {
      ...evidence,
      id: `evidence-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    project.status = "evidence";
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  addEvidenceItem(projectId: string, item: Omit<EvidenceItem, "id">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project || !project.evidence) return undefined;
    project.evidence.evidenceItems.push({ ...item, id: `ei-${Date.now()}` });
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  // Open Source Path
  defineOpenSourcePath(projectId: string, path: Omit<OpenSourcePath, "id" | "problemId">): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    project.openSourcePath = {
      ...path,
      id: `os-${Date.now()}`,
      problemId: project.problem.id,
    };
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  // Complete project
  completeProject(projectId: string): ImpactProject | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    project.status = "complete";
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  // Get project
  getProject(id: string): ImpactProject | undefined {
    return this.projects.get(id);
  }

  // Get all projects
  getAllProjects(): ImpactProject[] {
    return Array.from(this.projects.values());
  }

  // Get dashboard
  getDashboard(): ImpactDashboard {
    const projects = this.getAllProjects();
    return {
      problemsInProgress: projects.filter((p) => p.status !== "complete"),
      completedProjects: projects.filter((p) => p.status === "complete"),
      openSourceContributions: projects
        .filter((p) => p.openSourcePath)
        .map((p) => p.openSourcePath!),
      knowledgeGenerated: projects.reduce(
        (acc, p) => acc + (p.research?.insights.length || 0),
        0
      ),
      communitiesServed: [
        ...new Set(
          projects
            .filter((p) => p.evidence)
            .map((p) => p.evidence!.whoBenefits)
        ),
      ],
    };
  }

  // Generate portfolio
  generatePortfolio(projectId: string): ImpactPortfolio | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    return {
      projectId: project.id,
      problemAddressed: project.problem.statement,
      usersHelped: project.evidence?.whoBenefits || "To be determined",
      researchPerformed: project.research?.insights || [],
      knowledgePackagesUsed: project.problem.knowledgePackages,
      designDecisions: project.canvas?.designDecisions || [],
      impactAchieved: project.evidence?.whatChanged || "Impact assessment pending",
      openSourceContribution: project.openSourcePath?.description || "No open-source path defined",
      lessonsLearned: [
        ...(project.research?.insights || []),
        ...(project.evidence ? [project.evidence.whatRemainsUnsolved] : []),
      ],
      futureWork: project.evidence
        ? [
            project.evidence.whatRemainsUnsolved,
            ...(project.openSourcePath ? [project.openSourcePath.description] : []),
          ]
        : [],
      exportDate: new Date().toISOString(),
    };
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    const data = Array.from(this.projects.entries());
    localStorage.setItem("bhavya-impact-projects", JSON.stringify(data));
  }

  loadFromStorage() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("bhavya-impact-projects");
    if (raw) {
      try {
        const data = JSON.parse(raw) as [string, ImpactProject][];
        this.projects = new Map(data);
      } catch {
        // ignore
      }
    }
  }
}
