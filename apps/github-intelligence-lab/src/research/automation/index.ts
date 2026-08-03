// Automation Research — Internal module of GitHub Intelligence Lab
// Promotes to packages/automation-research when another app consumes it.

export type AutomationType =
  | "ci"
  | "cd"
  | "release"
  | "testing"
  | "documentation"
  | "dependency"
  | "security"
  | "code_generation"
  | "deployment";

export interface GitHubAction {
  name: string;
  repository: string;
  url: string;
  description: string;
  type: AutomationType;
  stars: number;
  usageCount: number;
  lastUpdated: string;
  isReusable: boolean;
  inputs: ActionInput[];
  outputs: string[];
  triggers: string[];
  maintenanceStatus: "active" | "maintained" | "unmaintained" | "deprecated";
  bhavyaScore: number;
}

export interface ActionInput {
  name: string;
  description: string;
  required: boolean;
  defaultValue: string | null;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  actions: string[];
  steps: string[];
  estimatedSetupTime: string;
  complexity: "simple" | "moderate" | "complex";
  reusable: boolean;
  sourceRepo: string;
}

export interface ReusableTemplate {
  id: string;
  name: string;
  type: AutomationType;
  workflow: string;
  description: string;
  setupGuide: string;
  sourceActions: string[];
}

export class AutomationResearcher {
  private actions = new Map<string, GitHubAction>();
  private workflows: AutomationWorkflow[] = [];
  private templates: ReusableTemplate[] = [];

  addAction(action: GitHubAction): void {
    this.actions.set(action.name, action);
  }
  getAction(name: string): GitHubAction | undefined {
    return this.actions.get(name);
  }
  listActions(filter?: {
    type?: AutomationType;
    minScore?: number;
  }): GitHubAction[] {
    let results = Array.from(this.actions.values());
    if (filter?.type) results = results.filter((a) => a.type === filter.type);
    if (filter?.minScore !== undefined)
      results = results.filter((a) => a.bhavyaScore >= filter.minScore!);
    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  addWorkflow(workflow: AutomationWorkflow): void {
    this.workflows.push(workflow);
  }
  listWorkflows(): AutomationWorkflow[] {
    return [...this.workflows];
  }

  addTemplate(template: ReusableTemplate): void {
    this.templates.push(template);
  }
  listTemplates(): ReusableTemplate[] {
    return [...this.templates];
  }

  async discover(): Promise<GitHubAction[]> {
    try {
      const url =
        "https://api.github.com/search/repositories?q=github-actions+reusable+stars:>100&sort=stars&order=desc&per_page=15";
      const res = await fetch(url, {
        headers: {
          "User-Agent": "BhavyaOS-GIL/1.0",
          Accept: "application/vnd.github+json",
        },
      });
      if (!res.ok) return [];
      const data = (await res.json()) as {
        items: Array<{
          full_name: string;
          description: string;
          html_url: string;
          stargazers_count: number;
        }>;
      };
      return data.items.map((r) => ({
        name: r.full_name,
        repository: r.full_name,
        url: r.html_url,
        description: r.description || "",
        type: "ci" as const,
        stars: r.stargazers_count,
        usageCount: 0,
        lastUpdated: new Date().toISOString(),
        isReusable: true,
        inputs: [],
        outputs: [],
        triggers: ["push", "pull_request"],
        maintenanceStatus: "active" as const,
        bhavyaScore: Math.min(100, Math.floor(r.stargazers_count / 50)),
      }));
    } catch {
      return [];
    }
  }

  recommend(action: GitHubAction): string {
    if (action.bhavyaScore >= 80) return "adopt_immediately";
    if (action.bhavyaScore >= 60) return "pilot";
    if (action.bhavyaScore >= 40) return "study";
    return "monitor";
  }
}
