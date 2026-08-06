/**
 * Bhavya OS — Planner Module
 * Task planning and decomposition.
 */

export class Planner {
  constructor() {
    this.plans = new Map();
  }

  async createPlan(task) {
    const plan = {
      id: `plan-${Date.now()}`,
      task,
      status: "draft",
      steps: [],
      createdAt: new Date().toISOString(),
    };
    this.plans.set(plan.id, plan);
    return plan;
  }

  async addStep(planId, step) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);
    plan.steps.push({
      id: `step-${plan.steps.length + 1}`,
      ...step,
      status: "pending",
    });
    return plan;
  }

  async executePlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan ${planId} not found`);
    plan.status = "executing";
    for (const step of plan.steps) {
      step.status = "executing";
      // Execution handled by Execution module
    }
    return plan;
  }

  getPlan(planId) {
    return this.plans.get(planId);
  }

  listPlans() {
    return [...this.plans.values()];
  }
}
