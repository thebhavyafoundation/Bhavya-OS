/**
 * Bhavya OS — OpenCode Integration
 * OpenCode becomes: Chief Architect, Planner, Reviewer.
 * OpenCode never edits files directly.
 * OpenCode creates execution plans. Workers execute. Reviewer validates.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { EventBus, EventTypes } from "./event-bus.mjs";
import { ChiefArchitect } from "./chief-architect.mjs";
import { EngineeringMemory } from "./engineering-memory.mjs";

const ROOT = "F:\\Bhavya Foundation";

export class OpenCodeIntegration {
  constructor(config = {}) {
    this.eventBus = config.eventBus || new EventBus();
    this.memory = config.memory || new EngineeringMemory({ eventBus: this.eventBus });
    this.chiefArchitect = config.chiefArchitect || new ChiefArchitect({
      eventBus: this.eventBus,
      memory: this.memory,
    });
    this.plans = new Map();
    this.planHistory = [];
  }

  // ── Plan Creation ───────────────────────────────────────────

  createPlan(goal, context = {}) {
    const plan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      goal,
      context,
      status: "created",
      steps: [],
      createdAt: new Date().toISOString(),
      createdBy: "opencode",
    };

    // Chief Architect decomposes the goal
    const decomposition = this.chiefArchitect.decomposeTask({
      name: goal,
      type: context.type || "feature",
      priority: context.priority || 1,
      description: context.description || goal,
    });

    plan.steps = decomposition.subtasks;
    plan.architectureRules = this.chiefArchitect.architectureRules;

    this.plans.set(plan.id, plan);
    this.planHistory.push(plan);

    this.eventBus.emit("opencode.plan.created", {
      planId: plan.id,
      goal,
      stepCount: plan.steps.length,
    }, "opencode");

    return plan;
  }

  // ── Plan Validation ─────────────────────────────────────────

  validatePlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);

    const issues = [];

    // Check dependencies form a DAG
    const visited = new Set();
    const visiting = new Set();

    function hasCycle(stepId) {
      if (visiting.has(stepId)) return true;
      if (visited.has(stepId)) return false;
      visiting.add(stepId);
      const step = plan.steps.find(s => s.id === stepId);
      if (step) {
        for (const dep of step.dependencies || []) {
          if (hasCycle(dep)) return true;
        }
      }
      visiting.delete(stepId);
      visited.add(stepId);
      return false;
    }

    for (const step of plan.steps) {
      if (hasCycle(step.id)) {
        issues.push({ type: "cycle", message: `Circular dependency detected in step ${step.id}` });
      }
    }

    // Check all dependencies exist
    for (const step of plan.steps) {
      for (const depId of step.dependencies || []) {
        if (!plan.steps.find(s => s.id === depId)) {
          issues.push({ type: "missing-dependency", message: `Step ${step.id} depends on non-existent step ${depId}` });
        }
      }
    }

    return {
      valid: issues.length === 0,
      issues,
      planId,
    };
  }

  // ── Plan Execution (delegated to workers) ───────────────────

  getExecutionPlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);

    // Return steps in execution order (respecting dependencies)
    const executed = new Set();
    const order = [];

    function getReady() {
      return plan.steps.filter(s =>
        !executed.has(s.id) &&
        (s.dependencies || []).every(d => executed.has(d))
      );
    }

    let ready = getReady();
    while (ready.length > 0) {
      for (const step of ready) {
        order.push(step);
        executed.add(step.id);
      }
      ready = getReady();
    }

    return {
      planId,
      goal: plan.goal,
      executionOrder: order,
      totalSteps: order.length,
      estimatedDuration: order.length * 30, // rough estimate in seconds
    };
  }

  // ── Review Plan ─────────────────────────────────────────────

  reviewPlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);

    const validation = this.validatePlan(planId);
    const execution = this.getExecutionPlan(planId);

    return {
      planId,
      goal: plan.goal,
      valid: validation.valid,
      issues: validation.issues,
      steps: plan.steps.length,
      executionOrder: execution.executionOrder.map(s => s.name),
      recommendation: validation.valid ? "approve" : "fix-issues",
    };
  }

  // ── Query ───────────────────────────────────────────────────

  getPlan(planId) {
    return this.plans.get(planId);
  }

  listPlans() {
    return [...this.plans.values()];
  }

  getRecentPlans(limit = 10) {
    return this.planHistory.slice(-limit);
  }
}
