import type {
  Project,
  Milestone,
  ProjectTask as Task,
  AIProjectCoachResponse,
  ProjectKnowledgePackage as KnowledgePackage,
} from "../types";

export class AIProjectCoach {
  async coach(
    project: Project,
    currentMilestone: Milestone,
    currentTask?: Task
  ): Promise<AIProjectCoachResponse> {
    const milestoneIndex = project.milestones.findIndex(
      (m) => m.id === currentMilestone.id
    );
    const completedMilestones = project.milestones.filter(
      (m) => m.status === "completed"
    ).length;
    const totalMilestones = project.milestones.length;
    const progress = completedMilestones / totalMilestones;

    // First milestone, first task — clarify the problem
    if (milestoneIndex === 0 && !currentTask) {
      return {
        type: "clarify",
        content:
          "Let's start by understanding the problem. What exactly are we building? " +
          "Who will use it? What problem does it solve for them? " +
          "Take a moment to write down your understanding before we start building.",
        milestoneId: currentMilestone.id,
      };
    }

    // During a task — suggest next steps
    if (currentTask && currentTask.status === "in-progress") {
      return {
        type: "suggest",
        content:
          `You're working on "${currentTask.title}". ` +
          "What's the next concrete step you can take? " +
          "Break it down into something you can do in the next 15 minutes.",
        milestoneId: currentMilestone.id,
        taskId: currentTask.id,
      };
    }

    // Task completed — review
    if (currentTask && currentTask.status === "completed") {
      return {
        type: "review",
        content:
          `Great work completing "${currentTask.title}". ` +
          "Take a moment to review what you built. Does it work as expected? " +
          "What would you improve?",
        milestoneId: currentMilestone.id,
        taskId: currentTask.id,
      };
    }

    // Milestone completed — encourage reflection
    if (currentMilestone.status === "completed") {
      return {
        type: "encourage",
        content:
          `You completed "${currentMilestone.title}"! ` +
          "That's real progress. Before moving on, reflect: " +
          "What was difficult? What would you redesign? " +
          "This reflection becomes part of your portfolio.",
        milestoneId: currentMilestone.id,
      };
    }

    // Early progress — recommend knowledge packages
    if (progress < 0.3) {
      const relevantKPs = project.knowledgePackages.filter(
        (kp) => kp.type === "repository" || kp.type === "pattern"
      );
      return {
        type: "recommend",
        content:
          "As you work through this milestone, consider exploring these resources. " +
          "They might give you ideas or patterns you can use.",
        milestoneId: currentMilestone.id,
        knowledgePackageIds: relevantKPs.map((kp) => kp.id),
      };
    }

    // Mid progress — ask reflective questions
    if (progress >= 0.3 && progress < 0.7) {
      return {
        type: "question",
        content:
          "You're making good progress. Let me ask you something: " +
          "If you had to explain your architecture to a friend, how would you describe it? " +
          "Understanding your own design helps you improve it.",
        milestoneId: currentMilestone.id,
      };
    }

    // Late progress — point to open source
    if (progress >= 0.7) {
      return {
        type: "suggest",
        content:
          "You're almost done! When this project is complete, consider " +
          "sharing it as an open-source contribution. " +
          "Your project could help other students learn. " +
          "Think about what you'd want to share.",
        milestoneId: currentMilestone.id,
      };
    }

    // Default
    return {
      type: "question",
      content:
        "What's on your mind? Are you stuck on something, or ready to move forward?",
      milestoneId: currentMilestone.id,
    };
  }

  async reviewArchitecture(architecture: string): Promise<AIProjectCoachResponse> {
    const hasComponents = /component|module|class|function/i.test(architecture);
    hasComponents; // used for scoring
    const hasFlow = /flow|sequence|step|process/i.test(architecture);
    hasFlow; // used for scoring
    const hasInterfaces = /interface|api|endpoint|contract/i.test(architecture);
    hasInterfaces; // used for scoring

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (hasComponents) strengths.push("Clear component structure");
    else improvements.push("Consider breaking the solution into components");

    if (hasFlow) strengths.push("Defined flow or sequence");
    else improvements.push("Add a flow or sequence diagram");

    if (hasInterfaces) strengths.push("Defined interfaces");
    else improvements.push("Define how components communicate");

    return {
      type: "review",
      content:
        (strengths.length > 0
          ? "Strengths: " + strengths.join(", ") + ". "
          : "") +
        (improvements.length > 0
          ? "To improve: " + improvements.join(". ") + "."
          : "Your architecture looks solid."),
    };
  }

  async reviewPrompt(prompt: string): Promise<AIProjectCoachResponse> {
    const words = prompt.split(/\s+/).length;
    const hasContext = /for|when|because|given|based on/i.test(prompt);
    const hasFormat = /json|list|step|format|structure/i.test(prompt);
    const hasExample = /example|like|such as|for instance/i.test(prompt);

    const suggestions: string[] = [];
    if (words < 10) suggestions.push("Try adding more detail");
    if (!hasContext) suggestions.push("Add context about when or why");
    if (!hasFormat) suggestions.push("Specify the format you want");
    if (!hasExample) suggestions.push("Include an example");

    if (suggestions.length === 0) {
      return {
        type: "encourage",
        content: "That's a well-structured prompt. You're getting the hang of this.",
      };
    }

    return {
      type: "suggest",
      content: `Your prompt could be stronger. Try: ${suggestions.join(", ")}.`,
    };
  }
}
