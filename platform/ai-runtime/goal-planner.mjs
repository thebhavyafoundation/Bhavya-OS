/**
 * Bhavya OS v3 — Goal Planner
 * Input: Natural language objective
 * Chief Architect → Task decomposition → Dependency graph →
 * Execution graph → Worker assignment → Review graph → Release graph
 */

import { EventBus, EventTypes } from "./event-bus.mjs";
import { EngineeringBacklog, TaskPriority, TaskStatus } from "./engineering-backlog.mjs";
import { ChiefArchitect } from "./chief-architect.mjs";

export class GoalPlanner {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.backlog = config.backlog || new EngineeringBacklog({ eventBus: this.eventBus });
    this.chiefArchitect = config.chiefArchitect || new ChiefArchitect({ eventBus: this.eventBus });
    this.plans = new Map();
  }

  // ── Plan Goal ──────────────────────────────────────────────

  async planGoal(goal, context = {}) {
    const planId = `PLAN-${Date.now().toString(36).toUpperCase()}`;
    const startTime = Date.now();

    this.eventBus.emit("planner.goal.received", {
      planId, goal, context,
    }, "goal-planner");

    // Step 1: Chief Architect analyzes goal
    const analysis = this.analyzeGoal(goal, context);

    // Step 2: Decompose into tasks
    const tasks = this.decomposeIntoTasks(goal, analysis, context);

    // Step 3: Build dependency graph
    const dependencyGraph = this.buildDependencyGraph(tasks);

    // Step 4: Determine execution order (topological sort)
    const executionGraph = this.topologicalSort(dependencyGraph);

    // Step 5: Assign workers
    const assignments = this.assignWorkers(executionGraph);

    // Step 6: Create review graph
    const reviewGraph = this.createReviewGraph(tasks);

    // Step 7: Create release graph
    const releaseGraph = this.createReleaseGraph(tasks, assignments);

    const plan = {
      id: planId,
      goal,
      context,
      analysis,
      tasks,
      dependencyGraph,
      executionGraph,
      assignments,
      reviewGraph,
      releaseGraph,
      status: "created",
      createdAt: new Date().toISOString(),
      duration: Date.now() - startTime,
      totalTasks: tasks.length,
      estimatedMinutes: tasks.reduce((sum, t) => sum + (t.metrics?.estimatedMinutes || 30), 0),
    };

    this.plans.set(planId, plan);

    // Submit tasks to backlog
    for (const task of tasks) {
      this.backlog.createTask(task);
    }

    this.eventBus.emit("planner.goal.planned", {
      planId, goal, taskCount: tasks.length, duration: plan.duration,
    }, "goal-planner");

    return plan;
  }

  // ── Analyze Goal ───────────────────────────────────────────

  analyzeGoal(goal, context) {
    const goalLower = goal.toLowerCase();
    const analysis = {
      type: "feature",
      scope: "module",
      complexity: "medium",
      affectedAreas: [],
      requiredSkills: [],
      estimatedEffort: "medium",
    };

    // Detect type
    if (goalLower.includes("fix") || goalLower.includes("bug") || goalLower.includes("error")) {
      analysis.type = "bugfix";
    } else if (goalLower.includes("refactor") || goalLower.includes("improve") || goalLower.includes("optimize")) {
      analysis.type = "refactor";
    } else if (goalLower.includes("test") || goalLower.includes("coverage")) {
      analysis.type = "testing";
    } else if (goalLower.includes("document") || goalLower.includes("readme")) {
      analysis.type = "documentation";
    } else if (goalLower.includes("deploy") || goalLower.includes("release")) {
      analysis.type = "deployment";
    } else if (goalLower.includes("security") || goalLower.includes("vulnerability")) {
      analysis.type = "security";
    }

    // Detect scope
    if (goalLower.includes("entire") || goalLower.includes("all") || goalLower.includes("system")) {
      analysis.scope = "system";
      analysis.complexity = "high";
    } else if (goalLower.includes("package") || goalLower.includes("module")) {
      analysis.scope = "module";
    } else if (goalLower.includes("component") || goalLower.includes("ui")) {
      analysis.scope = "component";
    } else if (goalLower.includes("file") || goalLower.includes("single")) {
      analysis.scope = "file";
      analysis.complexity = "low";
    }

    // Detect affected areas
    if (goalLower.includes("frontend") || goalLower.includes("ui") || goalLower.includes("react") || goalLower.includes("component")) {
      analysis.affectedAreas.push("frontend");
      analysis.requiredSkills.push("frontend");
    }
    if (goalLower.includes("backend") || goalLower.includes("api") || goalLower.includes("server")) {
      analysis.affectedAreas.push("backend");
      analysis.requiredSkills.push("backend");
    }
    if (goalLower.includes("test") || goalLower.includes("spec")) {
      analysis.affectedAreas.push("testing");
      analysis.requiredSkills.push("testing");
    }
    if (goalLower.includes("deploy") || goalLower.includes("ci") || goalLower.includes("cd")) {
      analysis.affectedAreas.push("devops");
      analysis.requiredSkills.push("devops");
    }
    if (goalLower.includes("doc") || goalLower.includes("readme")) {
      analysis.affectedAreas.push("documentation");
      analysis.requiredSkills.push("documentation");
    }

    return analysis;
  }

  // ── Decompose Into Tasks ───────────────────────────────────

  decomposeIntoTasks(goal, analysis, context) {
    const tasks = [];
    const type = analysis.type;

    switch (type) {
      case "feature":
        tasks.push(
          { title: `Design: ${goal}`, type: "design", priority: TaskPriority.HIGH, estimatedMinutes: 30, tags: ["design"], acceptanceCriteria: ["Design document created", "Architecture reviewed"] },
          { title: `Implement: ${goal}`, type: "implementation", priority: TaskPriority.HIGH, estimatedMinutes: 60, tags: ["implementation"], acceptanceCriteria: ["Code implemented", "Unit tests written"] },
          { title: `Test: ${goal}`, type: "testing", priority: TaskPriority.NORMAL, estimatedMinutes: 30, tags: ["testing"], acceptanceCriteria: ["All tests pass", "Coverage > 80%"] },
          { title: `Review: ${goal}`, type: "review", priority: TaskPriority.NORMAL, estimatedMinutes: 20, tags: ["review"], acceptanceCriteria: ["Code review approved", "No critical issues"] },
          { title: `Document: ${goal}`, type: "documentation", priority: TaskPriority.LOW, estimatedMinutes: 15, tags: ["documentation"], acceptanceCriteria: ["README updated", "API docs generated"] },
        );
        break;
      case "bugfix":
        tasks.push(
          { title: `Diagnose: ${goal}`, type: "diagnosis", priority: TaskPriority.HIGH, estimatedMinutes: 20, tags: ["diagnosis"], acceptanceCriteria: ["Root cause identified", "Reproduction steps documented"] },
          { title: `Fix: ${goal}`, type: "implementation", priority: TaskPriority.HIGH, estimatedMinutes: 40, tags: ["fix"], acceptanceCriteria: ["Bug fixed", "No regressions"] },
          { title: `Test fix: ${goal}`, type: "testing", priority: TaskPriority.HIGH, estimatedMinutes: 20, tags: ["testing"], acceptanceCriteria: ["Bug regression test added", "All tests pass"] },
          { title: `Review fix: ${goal}`, type: "review", priority: TaskPriority.NORMAL, estimatedMinutes: 15, tags: ["review"], acceptanceCriteria: ["Fix reviewed and approved"] },
        );
        break;
      case "refactor":
        tasks.push(
          { title: `Analyze: ${goal}`, type: "analysis", priority: TaskPriority.NORMAL, estimatedMinutes: 20, tags: ["analysis"], acceptanceCriteria: ["Current state documented", "Improvements identified"] },
          { title: `Plan: ${goal}`, type: "design", priority: TaskPriority.NORMAL, estimatedMinutes: 15, tags: ["planning"], acceptanceCriteria: ["Refactoring plan created", "Risk assessment done"] },
          { title: `Implement: ${goal}`, type: "implementation", priority: TaskPriority.HIGH, estimatedMinutes: 50, tags: ["refactor"], acceptanceCriteria: ["Code refactored", "Tests still pass"] },
          { title: `Verify: ${goal}`, type: "testing", priority: TaskPriority.HIGH, estimatedMinutes: 20, tags: ["testing"], acceptanceCriteria: ["All tests pass", "No performance regression"] },
          { title: `Review: ${goal}`, type: "review", priority: TaskPriority.NORMAL, estimatedMinutes: 15, tags: ["review"], acceptanceCriteria: ["Refactoring reviewed"] },
        );
        break;
      default:
        tasks.push(
          { title: goal, type: type, priority: TaskPriority.NORMAL, estimatedMinutes: 40, tags: [], acceptanceCriteria: ["Task completed successfully"] },
        );
    }

    // Add dependency chains
    for (let i = 1; i < tasks.length; i++) {
      tasks[i].dependencies = [tasks[i - 1].title]; // Will be resolved to IDs later
    }

    return tasks;
  }

  // ── Dependency Graph ───────────────────────────────────────

  buildDependencyGraph(tasks) {
    const nodes = tasks.map(t => ({ id: t.title, type: t.type }));
    const edges = [];

    for (const task of tasks) {
      for (const dep of task.dependencies || []) {
        edges.push({ from: dep, to: task.title, type: "finish-to-start" });
      }
    }

    return { nodes, edges };
  }

  // ── Topological Sort ───────────────────────────────────────

  topologicalSort(graph) {
    const visited = new Set();
    const order = [];

    function visit(nodeId) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      for (const edge of graph.edges) {
        if (edge.from === nodeId) visit(edge.to);
      }
      order.push(nodeId);
    }

    for (const node of graph.nodes) {
      visit(node.id);
    }

    return order;
  }

  // ── Worker Assignment ──────────────────────────────────────

  assignWorkers(executionGraph) {
    const workerMap = {
      design: "frontend-engineer",
      implementation: "backend-engineer",
      testing: "qa-engineer",
      review: "qa-engineer",
      documentation: "documentation",
      diagnosis: "backend-engineer",
      analysis: "backend-engineer",
      "security": "security-engineer",
      devops: "devops-engineer",
    };

    return executionGraph.map(taskTitle => ({
      task: taskTitle,
      worker: workerMap[taskTitle.split(":")[0]?.trim().toLowerCase()] || "backend-engineer",
    }));
  }

  // ── Review Graph ───────────────────────────────────────────

  createReviewGraph(tasks) {
    return tasks.filter(t => t.type === "review").map(t => ({
      task: t.title,
      reviewer: "qa-engineer",
      gates: ["typecheck", "lint", "test", "architecture"],
    }));
  }

  // ── Release Graph ──────────────────────────────────────────

  createReleaseGraph(tasks, assignments) {
    const completedTasks = tasks.filter(t => t.type === "implementation" || t.type === "review");
    return {
      branch: `task/${Date.now().toString(36)}`,
      mergeStrategy: "squash",
      requiredReviews: 1,
      gates: ["typecheck", "lint", "build", "test"],
      tasks: completedTasks.map(t => t.title),
    };
  }

  // ── Query ──────────────────────────────────────────────────

  getPlan(planId) { return this.plans.get(planId); }
  listPlans() { return [...this.plans.values()]; }
}
