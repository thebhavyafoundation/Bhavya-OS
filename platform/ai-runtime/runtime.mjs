/**
 * Bhavya OS — Runtime
 * Main runtime that ties all modules together.
 */

import { Planner } from "./planner.mjs";
import { Memory } from "./memory.mjs";
import { Execution } from "./execution.mjs";
import { Review } from "./review.mjs";
import { Workflow } from "./workflow.mjs";
import { Registry } from "./registry.mjs";
import { State } from "./state.mjs";
import { Events } from "./events.mjs";
import { Tools, builtInTools } from "./tools.mjs";

export class Runtime {
  constructor(config = {}) {
    this.planner = new Planner();
    this.memory = new Memory(config.memoryPath || "memory/engineering.json");
    this.execution = new Execution();
    this.review = new Review();
    this.workflow = new Workflow();
    this.registry = new Registry();
    this.state = new State();
    this.events = new Events();
    this.tools = new Tools();

    // Register built-in tools
    for (const tool of Object.values(builtInTools)) {
      this.tools.register(tool);
    }

    // Register built-in agents
    this.registerDefaultAgents();

    // Register default workflows
    this.registerDefaultWorkflows();
  }

  registerDefaultAgents() {
    const agents = [
      { id: "chief-architect", role: "Chief Architect", scope: "architecture" },
      { id: "project-manager", role: "Project Manager", scope: "tasks" },
      { id: "repo-intelligence", role: "Repository Intelligence", scope: "indexing" },
      { id: "frontend-engineer", role: "Frontend Engineer", scope: "apps/*" },
      { id: "backend-engineer", role: "Backend Engineer", scope: "packages/*" },
      { id: "design-system", role: "Design System", scope: "packages/platform-ui" },
      { id: "qa-engineer", role: "QA Engineer", scope: "testing" },
      { id: "security-engineer", role: "Security Engineer", scope: "security" },
      { id: "devops-engineer", role: "DevOps Engineer", scope: "deployment" },
      { id: "documentation", role: "Documentation", scope: "docs" },
    ];
    for (const agent of agents) {
      this.registry.registerAgent(agent);
    }
  }

  registerDefaultWorkflows() {
    this.workflow.registerWorkflow({
      id: "feature-development",
      name: "Feature Development",
      steps: ["plan", "implement", "test", "review", "document", "deploy"],
    });

    this.workflow.registerWorkflow({
      id: "bug-fix",
      name: "Bug Fix",
      steps: ["diagnose", "fix", "test", "review", "deploy"],
    });

    this.workflow.registerWorkflow({
      id: "architecture-review",
      name: "Architecture Review",
      steps: ["analyze", "propose", "review", "approve", "implement"],
    });
  }

  getStatus() {
    return {
      agents: this.registry.listAgents().length,
      tools: this.tools.listTools().length,
      tasks: this.execution.listTasks().length,
      reviews: this.review.listReviews().length,
      memory: this.memory.getStats(),
      state: this.state.getAll(),
    };
  }
}
