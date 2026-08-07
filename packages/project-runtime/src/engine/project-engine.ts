import type {
  Project,
  Milestone,
  ProjectTask as Task,
  Reflection,
  ProjectPortfolio,
  RepositoryStructure,
} from "../types";

export class ProjectEngine {
  private projects: Map<string, Project> = new Map();

  createProject(data: Omit<Project, "id" | "status" | "createdAt" | "updatedAt">): Project {
    const project: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      status: "not-started",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(project.id, project);
    this.saveToStorage();
    return project;
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  startProject(id: string): Project | undefined {
    const project = this.projects.get(id);
    if (!project) return undefined;
    project.status = "in-progress";
    project.updatedAt = new Date().toISOString();
    // Unlock first milestone
    const firstMilestone = project.milestones.find((m) => m.order === 1);
    if (firstMilestone) firstMilestone.status = "available";
    this.saveToStorage();
    return project;
  }

  completeMilestone(projectId: string, milestoneId: string, evidence?: string): Project | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return undefined;
    milestone.status = "completed";
    milestone.evidence = evidence;
    // Unlock next milestone
    const nextMilestone = project.milestones.find((m) => m.order === milestone.order + 1);
    if (nextMilestone) nextMilestone.status = "available";
    // Check if all milestones completed
    const allCompleted = project.milestones.every((m) => m.status === "completed");
    if (allCompleted) {
      project.status = "completed";
    }
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  completeTask(projectId: string, milestoneId: string, taskId: string, output?: string): Project | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return undefined;
    const task = milestone.tasks.find((t) => t.id === taskId);
    if (!task) return undefined;
    task.status = "completed";
    task.output = output;
    milestone.status = "in-progress";
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  addReflection(projectId: string, milestoneId: string, reflection: Omit<Reflection, "id" | "timestamp">): Project | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    const milestone = project.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return undefined;
    milestone.reflection = {
      ...reflection,
      id: `refl-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    project.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return project;
  }

  getProgress(projectId: string): { completed: number; total: number; percentage: number } | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    const completed = project.milestones.filter((m) => m.status === "completed").length;
    const total = project.milestones.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  generatePortfolio(projectId: string): ProjectPortfolio | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    return {
      projectId: project.id,
      title: project.title,
      problem: project.problem,
      architecture: this.generateArchitectureDescription(project),
      skillsDemonstrated: this.extractSkills(project),
      knowledgePackagesUsed: project.knowledgePackages.map((kp) => kp.id),
      reflection: project.milestones
        .filter((m) => m.reflection)
        .map((m) => m.reflection!),
      futureImprovements: this.extractImprovements(project),
      exportDate: new Date().toISOString(),
    };
  }

  generateRepository(projectId: string): RepositoryStructure | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;
    const portfolio = this.generatePortfolio(projectId);
    if (!portfolio) return undefined;
    return {
      name: project.title.toLowerCase().replace(/\s+/g, "-"),
      description: project.problem,
      readme: this.generateReadme(project, portfolio),
      architecture: this.generateArchitectureDoc(project),
      learningJournal: this.generateLearningJournal(project),
      knowledgePackageRefs: project.knowledgePackages.map((kp) => kp.id),
      portfolioMetadata: portfolio,
    };
  }

  private generateArchitectureDescription(project: Project): string {
    const tasks = project.milestones.flatMap((m) => m.tasks);
    const buildTasks = tasks.filter((t) => t.type === "build");
    const designTasks = tasks.filter((t) => t.type === "design");
    return `Architecture based on ${designTasks.length} design decisions and ${buildTasks.length} implementation tasks across ${project.milestones.length} milestones.`;
  }

  private extractSkills(project: Project): string[] {
    const skills = new Set<string>();
    project.milestones.forEach((m) => {
      m.tasks.forEach((t) => {
        if (t.type === "build") skills.add("Implementation");
        if (t.type === "design") skills.add("Architecture Design");
        if (t.type === "research") skills.add("Research");
        if (t.type === "test") skills.add("Testing");
        if (t.type === "document") skills.add("Documentation");
      });
    });
    return Array.from(skills);
  }

  private extractImprovements(project: Project): string[] {
    const improvements: string[] = [];
    project.milestones.forEach((m) => {
      if (m.reflection?.whatRedesign) {
        improvements.push(m.reflection.whatRedesign);
      }
    });
    return improvements.length > 0 ? improvements : ["Continue iterating on the implementation"];
  }

  private generateReadme(project: Project, portfolio: ProjectPortfolio): string {
    return `# ${project.title}

${project.problem}

## Objectives

${project.objectives.map((o) => `- ${o}`).join("\n")}

## Architecture

${portfolio.architecture}

## Skills Demonstrated

${portfolio.skillsDemonstrated.map((s) => `- ${s}`).join("\n")}

## Knowledge Packages

${project.knowledgePackages.map((kp) => `- [${kp.title}](${kp.url || "#"}) — ${kp.relevance}`).join("\n")}

## Learning Journal

${project.milestones.map((m) => `### ${m.title}\n${m.reflection?.whatDifficult || "No reflection yet"}`).join("\n\n")}

## Future Improvements

${portfolio.futureImprovements.map((i) => `- ${i}`).join("\n")}

---

Built with [Bhavya AI Institute](https://github.com/bhavya-foundation)
`;
  }

  private generateArchitectureDoc(project: Project): string {
    return `# Architecture — ${project.title}

## Overview

${project.problem}

## Milestones

${project.milestones.map((m) => `### ${m.order}. ${m.title}\n${m.description}\n\nTasks:\n${m.tasks.map((t) => `- [${t.status}] ${t.title}: ${t.description}`).join("\n")}`).join("\n\n")}

## Knowledge Packages

${project.knowledgePackages.map((kp) => `- **${kp.title}** (${kp.type}): ${kp.description}`).join("\n")}
`;
  }

  private generateLearningJournal(project: Project): string {
    return `# Learning Journal — ${project.title}

${project.milestones.map((m) => `## ${m.title}\n\n${m.reflection ? `**What was difficult:** ${m.reflection.whatDifficult}\n\n**What changed:** ${m.reflection.whatChanged}\n\n**What I would redesign:** ${m.reflection.whatRedesign}\n\n**Which AI suggestion helped:** ${m.reflection.whichSuggestionHelped}\n\n**Which suggestion I rejected:** ${m.reflection.whichSuggestionRejected}` : "No reflection yet."}`).join("\n\n---\n\n")}`;
  }

  private saveToStorage() {
    if (typeof window === "undefined") return;
    const data = Array.from(this.projects.entries());
    localStorage.setItem("bhavya-projects", JSON.stringify(data));
  }

  loadFromStorage() {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("bhavya-projects");
    if (raw) {
      try {
        const data = JSON.parse(raw) as [string, Project][];
        this.projects = new Map(data);
      } catch {
        // ignore
      }
    }
  }
}
