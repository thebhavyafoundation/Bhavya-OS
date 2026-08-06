/**
 * Automation Library
 * Bhavya Ecosystem v1.0
 * 
 * Reusable workflows:
 * - Publish article
 * - Approve policy
 * - Create project
 * - Register volunteer
 * - Generate report
 * - Release application
 * - Deploy website
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'ecosystem', 'automation', 'data');

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'governance' | 'project' | 'volunteer' | 'report' | 'release' | 'deployment';
  steps: WorkflowStep[];
  triggers: Trigger[];
  status: 'active' | 'inactive' | 'draft';
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
  };
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'notification' | 'approval';
  config: Record<string, any>;
  nextStepId?: string;
}

interface Trigger {
  type: 'manual' | 'schedule' | 'event' | 'webhook';
  config: Record<string, any>;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startedAt: string;
  completedAt?: string;
  steps: StepExecution[];
  input: Record<string, any>;
  output?: Record<string, any>;
}

interface StepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  input?: any;
  output?: any;
  error?: string;
}

export class AutomationLibrary {
  private workflows: Workflow[] = [];
  private executions: WorkflowExecution[] = [];
  private dataDir: string;

  constructor() {
    this.dataDir = DATA_DIR;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const workflowsFile = join(this.dataDir, 'workflows.json');
    if (existsSync(workflowsFile)) {
      this.workflows = JSON.parse(readFileSync(workflowsFile, 'utf-8'));
    }

    const executionsFile = join(this.dataDir, 'executions.json');
    if (existsSync(executionsFile)) {
      this.executions = JSON.parse(readFileSync(executionsFile, 'utf-8'));
    }
  }

  private saveData(): void {
    writeFileSync(join(this.dataDir, 'workflows.json'), JSON.stringify(this.workflows, null, 2));
    writeFileSync(join(this.dataDir, 'executions.json'), JSON.stringify(this.executions, null, 2));
  }

  /**
   * Create workflow
   */
  createWorkflow(workflow: Omit<Workflow, 'id' | 'metadata'>): Workflow {
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...workflow,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    this.workflows.push(newWorkflow);
    this.saveData();
    return newWorkflow;
  }

  /**
   * Get workflow
   */
  getWorkflow(id: string): Workflow | undefined {
    return this.workflows.find(w => w.id === id);
  }

  /**
   * Get all workflows
   */
  getAllWorkflows(): Workflow[] {
    return this.workflows;
  }

  /**
   * Get workflows by category
   */
  getWorkflowsByCategory(category: Workflow['category']): Workflow[] {
    return this.workflows.filter(w => w.category === category);
  }

  /**
   * Execute workflow
   */
  executeWorkflow(workflowId: string, input: Record<string, any>): WorkflowExecution {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      status: 'running',
      startedAt: new Date().toISOString(),
      steps: workflow.steps.map(step => ({
        stepId: step.id,
        status: 'pending'
      })),
      input
    };

    this.executions.push(execution);
    this.saveData();
    return execution;
  }

  /**
   * Complete step
   */
  completeStep(executionId: string, stepId: string, output: any): void {
    const execution = this.executions.find(e => e.id === executionId);
    if (execution) {
      const step = execution.steps.find(s => s.stepId === stepId);
      if (step) {
        step.status = 'completed';
        step.completedAt = new Date().toISOString();
        step.output = output;

        const allCompleted = execution.steps.every(s => s.status === 'completed');
        if (allCompleted) {
          execution.status = 'completed';
          execution.completedAt = new Date().toISOString();
          execution.output = output;
        }

        this.saveData();
      }
    }
  }

  /**
   * Get execution
   */
  getExecution(id: string): WorkflowExecution | undefined {
    return this.executions.find(e => e.id === id);
  }

  /**
   * Get executions by workflow
   */
  getExecutionsByWorkflow(workflowId: string): WorkflowExecution[] {
    return this.executions.filter(e => e.workflowId === workflowId);
  }

  /**
   * Get automation summary
   */
  getSummary(): {
    totalWorkflows: number;
    byCategory: Record<string, number>;
    totalExecutions: number;
    activeExecutions: number;
  } {
    const byCategory: Record<string, number> = {};
    for (const workflow of this.workflows) {
      byCategory[workflow.category] = (byCategory[workflow.category] || 0) + 1;
    }

    return {
      totalWorkflows: this.workflows.length,
      byCategory,
      totalExecutions: this.executions.length,
      activeExecutions: this.executions.filter(e => e.status === 'running').length
    };
  }
}

// Singleton instance
let instance: AutomationLibrary | null = null;

export function getAutomationLibrary(): AutomationLibrary {
  if (!instance) {
    instance = new AutomationLibrary();
  }
  return instance;
}
