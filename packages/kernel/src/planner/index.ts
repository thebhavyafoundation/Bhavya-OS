// Bhavya Kernel — Planner Module
// Goal → Plan → Tasks conversion.

import type { Goal, Plan, PlanStep, Task } from '../types/index.js';
import type { MemoryEngine } from '../memory/index.js';
import type { EventBus } from '../events/index.js';
import type { Scheduler } from '../scheduler/index.js';

export interface PlannerConfig {
  memory: MemoryEngine;
  events: EventBus;
  scheduler: Scheduler;
}

export class Planner {
  private config: PlannerConfig;
  private plans = new Map<string, Plan>();

  constructor(config: PlannerConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Planner ready
  }

  async createPlan(goal: Goal): Promise<Plan> {
    const plan: Plan = {
      id: `plan:${crypto.randomUUID()}`,
      goalId: goal.id,
      steps: [],
      status: 'draft',
      createdAt: new Date(),
    };

    this.plans.set(plan.id, plan);

    await this.config.events.emit('planner.plan.created', {
      planId: plan.id,
      goalId: goal.id,
    });

    return plan;
  }

  async addStep(planId: string, step: Omit<PlanStep, 'task'> & { task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }): Promise<PlanStep | undefined> {
    const plan = this.plans.get(planId);
    if (!plan) return undefined;

    const task: Task = {
      id: `task:${crypto.randomUUID()}`,
      ...step.task,
      status: 'pending',
      dependencies: [],
      events: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const planStep: PlanStep = {
      name: step.name,
      task,
      dependencies: step.dependencies,
      estimatedDuration: step.estimatedDuration,
    };

    plan.steps.push(planStep);
    return planStep;
  }

  async approve(planId: string): Promise<boolean> {
    const plan = this.plans.get(planId);
    if (!plan) return false;

    plan.status = 'approved';
    await this.config.events.emit('planner.plan.approved', { planId });
    return true;
  }

  async execute(planId: string): Promise<boolean> {
    const plan = this.plans.get(planId);
    if (!plan || plan.status !== 'approved') return false;

    plan.status = 'executing';
    await this.config.events.emit('planner.plan.executing', { planId });

    // Enqueue all tasks
    for (const step of plan.steps) {
      await this.config.scheduler.enqueue(step.task);
    }

    return true;
  }

  getPlan(planId: string): Plan | undefined {
    return this.plans.get(planId);
  }

  getAllPlans(): Plan[] {
    return Array.from(this.plans.values());
  }

  async shutdown(): Promise<void> {
    this.plans.clear();
  }
}
