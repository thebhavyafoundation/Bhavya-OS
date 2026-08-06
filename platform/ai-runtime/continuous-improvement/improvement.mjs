/**
 * Continuous Improvement
 * Bhavya OS v6.0 — Autonomous Product Studio
 * 
 * Weekly evaluation and improvement plans:
 * - Performance review
 * - Quality review
 * - Process improvement
 * - Technical debt reduction
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'continuous-improvement', 'data');

interface ImprovementPlan {
  id: string;
  week: string;
  startDate: string;
  endDate: string;
  evaluations: Evaluation[];
  improvements: Improvement[];
  status: 'planned' | 'in-progress' | 'completed';
}

interface Evaluation {
  category: string;
  score: number;
  issues: string[];
  recommendations: string[];
}

interface Improvement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  assignee?: string;
  completedAt?: string;
}

export class ContinuousImprovement {
  private plans: ImprovementPlan[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadPlans();
  }

  private loadPlans(): void {
    const plansFile = join(this.dataDir, 'plans.json');
    if (existsSync(plansFile)) {
      this.plans = JSON.parse(readFileSync(plansFile, 'utf-8'));
    }
  }

  private savePlans(): void {
    writeFileSync(
      join(this.dataDir, 'plans.json'),
      JSON.stringify(this.plans, null, 2)
    );
  }

  /**
   * Create improvement plan
   */
  createPlan(week: string, startDate: string, endDate: string): ImprovementPlan {
    const plan: ImprovementPlan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      week,
      startDate,
      endDate,
      evaluations: [],
      improvements: [],
      status: 'planned'
    };

    this.plans.push(plan);
    this.savePlans();
    return plan;
  }

  /**
   * Add evaluation
   */
  addEvaluation(planId: string, evaluation: Evaluation): void {
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      plan.evaluations.push(evaluation);
      this.savePlans();
    }
  }

  /**
   * Add improvement
   */
  addImprovement(planId: string, improvement: Improvement): void {
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      plan.improvements.push(improvement);
      this.savePlans();
    }
  }

  /**
   * Complete improvement
   */
  completeImprovement(planId: string, improvementId: string): void {
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      const improvement = plan.improvements.find(i => i.id === improvementId);
      if (improvement) {
        improvement.status = 'completed';
        improvement.completedAt = new Date().toISOString();
        this.savePlans();
      }
    }
  }

  /**
   * Get all plans
   */
  getAllPlans(): ImprovementPlan[] {
    return this.plans;
  }

  /**
   * Get latest plan
   */
  getLatestPlan(): ImprovementPlan | undefined {
    return this.plans[this.plans.length - 1];
  }

  /**
   * Get summary
   */
  getSummary(): {
    totalPlans: number;
    totalImprovements: number;
    completedImprovements: number;
    avgScore: number;
  } {
    const totalImprovements = this.plans.reduce((sum, p) => sum + p.improvements.length, 0);
    const completedImprovements = this.plans.reduce(
      (sum, p) => sum + p.improvements.filter(i => i.status === 'completed').length,
      0
    );

    const allScores = this.plans.flatMap(p => p.evaluations.map(e => e.score));
    const avgScore = allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 0;

    return {
      totalPlans: this.plans.length,
      totalImprovements,
      completedImprovements,
      avgScore
    };
  }
}

// Singleton instance
let instance: ContinuousImprovement | null = null;

export function getContinuousImprovement(): ContinuousImprovement {
  if (!instance) {
    instance = new ContinuousImprovement();
  }
  return instance;
}
