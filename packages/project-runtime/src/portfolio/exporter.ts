import type { Project, ProjectPortfolio, RepositoryStructure } from "../types";
import { ProjectEngine } from "../engine/project-engine";

export class PortfolioExporter {
  private engine: ProjectEngine;

  constructor(engine: ProjectEngine) {
    this.engine = engine;
  }

  exportAsJSON(projectId: string): string | null {
    const portfolio = this.engine.generatePortfolio(projectId);
    if (!portfolio) return null;
    return JSON.stringify(portfolio, null, 2);
  }

  exportAsMarkdown(projectId: string): string | null {
    const project = this.engine.getProject(projectId);
    const portfolio = this.engine.generatePortfolio(projectId);
    if (!project || !portfolio) return null;

    return `# ${portfolio.title}

## Problem
${portfolio.problem}

## Architecture
${portfolio.architecture}

## Skills Demonstrated
${portfolio.skillsDemonstrated.map((s) => `- ${s}`).join("\n")}

## Knowledge Packages Used
${portfolio.knowledgePackagesUsed.map((kp) => `- ${kp}`).join("\n")}

## Reflection
${portfolio.reflection.map((r) => `### Reflection\n- **What was difficult:** ${r.whatDifficult}\n- **What changed:** ${r.whatChanged}\n- **What I would redesign:** ${r.whatRedesign}\n- **Which AI suggestion helped:** ${r.whichSuggestionHelped}\n- **Which suggestion I rejected:** ${r.whichSuggestionRejected}`).join("\n\n")}

## Future Improvements
${portfolio.futureImprovements.map((i) => `- ${i}`).join("\n")}

## GitHub Repository
${portfolio.githubRepository || "[Link not yet available]"}

---
*Exported from Bhavya AI Institute on ${portfolio.exportDate}*
`;
  }

  exportAsLinkedInPost(projectId: string): string | null {
    const project = this.engine.getProject(projectId);
    const portfolio = this.engine.generatePortfolio(projectId);
    if (!project || !portfolio) return null;

    const skills = portfolio.skillsDemonstrated.slice(0, 3).join(", ");
    return `Just completed "${portfolio.title}" at Bhavya AI Institute!

What I built: ${portfolio.problem}

Skills gained: ${skills}

Key learning: ${portfolio.reflection[0]?.whatChanged || "Building with AI requires clear thinking and iteration."}

The project taught me that the best way to learn AI is by building real things, not just reading about them.

#AI #BuildingWithAI #BhavyaFoundation #ProjectBasedLearning`;
  }

  exportForGitHub(projectId: string): RepositoryStructure | null {
    return this.engine.generateRepository(projectId) || null;
  }
}
