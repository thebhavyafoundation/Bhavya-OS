/**
 * Planning Engine
 *
 * Strategic planning, goal setting, resource allocation, and roadmap
 * management for Bhavya OS.
 *
 * @version 1.0
 * @license MIT
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanStatus =
  "draft" | "active" | "on-hold" | "completed" | "cancelled";

export type GoalStatus =
  "pending" | "in-progress" | "achieved" | "missed" | "cancelled";

export type GoalPriority = "critical" | "high" | "medium" | "low";

export type ResourceType = "human" | "financial" | "technical" | "temporal";

export interface Plan {
  id: string;
  name: string;
  description: string;
  status: PlanStatus;
  goals: Goal[];
  milestones: Milestone[];
  resources: Resource[];
  timeline: PlanTimeline;
  dependencies: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  status: GoalStatus;
  priority: GoalPriority;
  kpis: KPI[];
  deadline: Date;
  owner: string;
  progress: number;
  metadata: Record<string, unknown>;
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  completedAt?: Date;
  goals: string[];
  status: "pending" | "achieved" | "missed";
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  allocated: number;
  cost: number;
  unit: string;
}

export interface PlanTimeline {
  start: Date;
  end: Date;
  phases: PlanPhase[];
}

export interface PlanPhase {
  name: string;
  start: Date;
  end: Date;
  goals: string[];
}

export interface PlanningMetrics {
  totalPlans: number;
  byStatus: Record<PlanStatus, number>;
  avgGoalProgress: number;
  achievedGoals: number;
  totalGoals: number;
  resourceUtilization: number;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

export class PlanningEngine {
  private plans: Map<string, Plan> = new Map();

  /**
   * Create a new plan
   */
  async create(
    plan: Omit<Plan, "id" | "createdAt" | "updatedAt">,
  ): Promise<Plan> {
    const id = this.generateId();
    const now = new Date();

    const newPlan: Plan = {
      ...plan,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.plans.set(id, newPlan);
    return newPlan;
  }

  /**
   * Get a plan by ID
   */
  async get(id: string): Promise<Plan | null> {
    return this.plans.get(id) || null;
  }

  /**
   * Update a plan
   */
  async update(
    id: string,
    updates: Partial<Omit<Plan, "id" | "createdAt">>,
  ): Promise<Plan | null> {
    const plan = this.plans.get(id);
    if (!plan) return null;

    const updatedPlan: Plan = {
      ...plan,
      ...updates,
      updatedAt: new Date(),
    };

    this.plans.set(id, updatedPlan);
    return updatedPlan;
  }

  /**
   * Add a goal to a plan
   */
  async addGoal(planId: string, goal: Omit<Goal, "id">): Promise<Goal | null> {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const newGoal: Goal = {
      ...goal,
      id: this.generateId(),
    };

    plan.goals.push(newGoal);
    plan.updatedAt = new Date();

    return newGoal;
  }

  /**
   * Update a goal
   */
  async updateGoal(
    planId: string,
    goalId: string,
    updates: Partial<Omit<Goal, "id">>,
  ): Promise<Goal | null> {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const goal = plan.goals.find((g) => g.id === goalId);
    if (!goal) return null;

    Object.assign(goal, updates);
    plan.updatedAt = new Date();

    return goal;
  }

  /**
   * Add a milestone
   */
  async addMilestone(
    planId: string,
    milestone: Omit<Milestone, "id">,
  ): Promise<Milestone | null> {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const newMilestone: Milestone = {
      ...milestone,
      id: this.generateId(),
    };

    plan.milestones.push(newMilestone);
    plan.updatedAt = new Date();

    return newMilestone;
  }

  /**
   * Add a resource
   */
  async addResource(
    planId: string,
    resource: Omit<Resource, "id">,
  ): Promise<Resource | null> {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const newResource: Resource = {
      ...resource,
      id: this.generateId(),
    };

    plan.resources.push(newResource);
    plan.updatedAt = new Date();

    return newResource;
  }

  /**
   * Allocate resource
   */
  async allocateResource(
    planId: string,
    resourceId: string,
    amount: number,
  ): Promise<boolean> {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    const resource = plan.resources.find((r) => r.id === resourceId);
    if (!resource) return false;

    if (resource.allocated + amount > resource.capacity) {
      return false;
    }

    resource.allocated += amount;
    plan.updatedAt = new Date();

    return true;
  }

  /**
   * Get plan progress
   */
  async getProgress(
    planId: string,
  ): Promise<{ overall: number; goals: Record<string, number> } | null> {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const goalProgress: Record<string, number> = {};
    let totalProgress = 0;

    for (const goal of plan.goals) {
      goalProgress[goal.id] = goal.progress;
      totalProgress += goal.progress;
    }

    const overall =
      plan.goals.length > 0 ? totalProgress / plan.goals.length : 0;

    return { overall, goals: goalProgress };
  }

  /**
   * Get overdue goals
   */
  async getOverdueGoals(): Promise<{ planId: string; goal: Goal }[]> {
    const now = new Date();
    const overdue: { planId: string; goal: Goal }[] = [];

    for (const plan of this.plans.values()) {
      for (const goal of plan.goals) {
        if (goal.status === "in-progress" && goal.deadline < now) {
          overdue.push({ planId: plan.id, goal });
        }
      }
    }

    return overdue;
  }

  /**
   * Get planning metrics
   */
  async getMetrics(): Promise<PlanningMetrics> {
    const plans = Array.from(this.plans.values());

    const byStatus: Record<PlanStatus, number> = {
      draft: 0,
      active: 0,
      "on-hold": 0,
      completed: 0,
      cancelled: 0,
    };

    let totalGoalProgress = 0;
    let achievedGoals = 0;
    let totalGoals = 0;
    let totalCapacity = 0;
    let totalAllocated = 0;

    for (const plan of plans) {
      byStatus[plan.status]++;

      for (const goal of plan.goals) {
        totalGoalProgress += goal.progress;
        totalGoals++;
        if (goal.status === "achieved") achievedGoals++;
      }

      for (const resource of plan.resources) {
        totalCapacity += resource.capacity;
        totalAllocated += resource.allocated;
      }
    }

    return {
      totalPlans: plans.length,
      byStatus,
      avgGoalProgress: totalGoals > 0 ? totalGoalProgress / totalGoals : 0,
      achievedGoals,
      totalGoals,
      resourceUtilization:
        totalCapacity > 0 ? totalAllocated / totalCapacity : 0,
    };
  }

  // ─── Private Helpers ──────────────────────────────────────────────────────

  private generateId(): string {
    return `plan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

export default PlanningEngine;
