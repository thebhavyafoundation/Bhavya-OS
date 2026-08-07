import { contentEngine } from "./engine.js";

export interface PipelineStage {
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  assignee?: string;
  startedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export interface EditorialWorkflow {
  id: string;
  packageId: string;
  stages: PipelineStage[];
  currentStage: number;
  createdAt: Date;
  updatedAt: Date;
}

export class LessonGenerationPipeline {
  private workflows: Map<string, EditorialWorkflow> = new Map();

  async createWorkflow(packageId: string): Promise<EditorialWorkflow> {
    const id = `wf-${Date.now()}`;
    const stages: PipelineStage[] = [
      {
        name: "research",
        description: "Research and gather sources",
        status: "pending",
      },
      {
        name: "knowledge-extraction",
        description: "Extract key concepts and knowledge",
        status: "pending",
      },
      {
        name: "curriculum-mapping",
        description: "Map to curriculum standards",
        status: "pending",
      },
      {
        name: "lesson-draft",
        description: "Create initial lesson content",
        status: "pending",
      },
      {
        name: "technical-review",
        description: "Technical accuracy review",
        status: "pending",
      },
      {
        name: "educational-review",
        description: "Pedagogical effectiveness review",
        status: "pending",
      },
      {
        name: "constitution-validation",
        description: "Validate against constitutional standards",
        status: "pending",
      },
      {
        name: "interactive-assets",
        description: "Create interactive learning assets",
        status: "pending",
      },
      {
        name: "publication",
        description: "Publish to production",
        status: "pending",
      },
      {
        name: "versioning",
        description: "Create version snapshot",
        status: "pending",
      },
      {
        name: "continuous-improvement",
        description: "Monitor and improve",
        status: "pending",
      },
    ];

    const workflow: EditorialWorkflow = {
      id,
      packageId,
      stages,
      currentStage: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.workflows.set(id, workflow);
    return workflow;
  }

  async advanceStage(
    workflowId: string,
    notes?: string,
  ): Promise<EditorialWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    const currentStage = workflow.stages[workflow.currentStage];
    if (currentStage.status !== "completed") {
      throw new Error(`Current stage ${currentStage.name} is not completed`);
    }

    if (workflow.currentStage >= workflow.stages.length - 1) {
      throw new Error("Workflow is already at the last stage");
    }

    workflow.currentStage += 1;
    workflow.stages[workflow.currentStage].status = "in_progress";
    workflow.stages[workflow.currentStage].startedAt = new Date();
    workflow.updatedAt = new Date();

    if (notes) {
      workflow.stages[workflow.currentStage].notes = notes;
    }

    return workflow;
  }

  async completeStage(
    workflowId: string,
    notes?: string,
  ): Promise<EditorialWorkflow> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    const currentStage = workflow.stages[workflow.currentStage];
    if (currentStage.status !== "in_progress") {
      throw new Error(`Current stage ${currentStage.name} is not in progress`);
    }

    currentStage.status = "completed";
    currentStage.completedAt = new Date();
    if (notes) {
      currentStage.notes = notes;
    }

    workflow.updatedAt = new Date();
    return workflow;
  }

  async getWorkflow(id: string): Promise<EditorialWorkflow | undefined> {
    return this.workflows.get(id);
  }

  async getWorkflowsByPackage(packageId: string): Promise<EditorialWorkflow[]> {
    return Array.from(this.workflows.values()).filter(
      (wf) => wf.packageId === packageId,
    );
  }

  async validateConstitutionalCompliance(
    packageId: string,
  ): Promise<{ compliant: boolean; issues: string[] }> {
    const pkg = await contentEngine.getPackage(packageId);
    if (!pkg) throw new Error(`Package ${packageId} not found`);

    const issues: string[] = [];

    if (
      !pkg.metadata.learningOutcomes ||
      pkg.metadata.learningOutcomes.length === 0
    ) {
      issues.push("Missing learning outcomes");
    }

    if (
      !pkg.metadata.prerequisites ||
      pkg.metadata.prerequisites.length === 0
    ) {
      issues.push("Missing prerequisites");
    }

    if (!pkg.content.sections || pkg.content.sections.length === 0) {
      issues.push("Missing content sections");
    }

    if (!pkg.assessment.quiz || pkg.assessment.quiz.questions.length === 0) {
      issues.push("Missing quiz questions");
    }

    if (
      !pkg.resources.researchPapers ||
      pkg.resources.researchPapers.length === 0
    ) {
      issues.push("Missing research paper references");
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }
}

export const lessonPipeline = new LessonGenerationPipeline();
