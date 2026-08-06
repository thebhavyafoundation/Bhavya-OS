/**
 * Engineering Swarm
 * Bhavya OS v7.0 — Universal Autonomous Engineering System
 * 
 * Create specialized workers dynamically:
 * - React Worker
 * - Next.js Worker
 * - Node Worker
 * - Python Worker
 * - Rust Worker
 * - Documentation Worker
 * - Security Worker
 * - Performance Worker
 * - Testing Worker
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface Worker {
  id: string;
  type: WorkerType;
  name: string;
  description: string;
  capabilities: string[];
  requirements: string[];
  status: 'idle' | 'busy' | 'offline';
  currentTask?: string;
  completedTasks: number;
  failedTasks: number;
  createdAt: string;
  lastActive: string;
}

export type WorkerType = 
  | 'react' 
  | 'nextjs' 
  | 'node' 
  | 'python' 
  | 'rust' 
  | 'documentation' 
  | 'security' 
  | 'performance' 
  | 'testing'
  | 'general';

export interface WorkerTask {
  id: string;
  workerId: string;
  type: string;
  description: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface SwarmConfiguration {
  id: string;
  name: string;
  workers: WorkerType[];
  maxWorkers: number;
  taskQueue: WorkerTask[];
  status: 'active' | 'inactive';
}

export class EngineeringSwarm {
  private workers: Map<string, Worker> = new Map();
  private tasks: Map<string, WorkerTask> = new Map();
  private configurations: Map<string, SwarmConfiguration> = new Map();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
    this.loadData();
  }

  private loadData(): void {
    const workersFile = join(this.dataDir, 'workers.json');
    if (existsSync(workersFile)) {
      const data = JSON.parse(readFileSync(workersFile, 'utf-8'));
      for (const [id, worker] of Object.entries(data)) {
        this.workers.set(id, worker as Worker);
      }
    }

    const tasksFile = join(this.dataDir, 'worker-tasks.json');
    if (existsSync(tasksFile)) {
      const data = JSON.parse(readFileSync(tasksFile, 'utf-8'));
      for (const [id, task] of Object.entries(data)) {
        this.tasks.set(id, task as WorkerTask);
      }
    }
  }

  private saveData(): void {
    const workersData: Record<string, Worker> = {};
    for (const [id, worker] of this.workers) {
      workersData[id] = worker;
    }
    writeFileSync(join(this.dataDir, 'workers.json'), JSON.stringify(workersData, null, 2));

    const tasksData: Record<string, WorkerTask> = {};
    for (const [id, task] of this.tasks) {
      tasksData[id] = task;
    }
    writeFileSync(join(this.dataDir, 'worker-tasks.json'), JSON.stringify(tasksData, null, 2));
  }

  /**
   * Create worker
   */
  createWorker(type: WorkerType, name?: string): Worker {
    const worker: Worker = {
      id: `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      name: name || `${type}-worker`,
      description: this.getWorkerDescription(type),
      capabilities: this.getWorkerCapabilities(type),
      requirements: this.getWorkerRequirements(type),
      status: 'idle',
      completedTasks: 0,
      failedTasks: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    this.workers.set(worker.id, worker);
    this.saveData();
    return worker;
  }

  private getWorkerDescription(type: WorkerType): string {
    const descriptions: Record<WorkerType, string> = {
      react: 'Specialized in React component development',
      nextjs: 'Specialized in Next.js application development',
      node: 'Specialized in Node.js backend development',
      python: 'Specialized in Python development',
      rust: 'Specialized in Rust systems programming',
      documentation: 'Specialized in technical documentation',
      security: 'Specialized in security auditing and fixing',
      performance: 'Specialized in performance optimization',
      testing: 'Specialized in test writing and maintenance',
      general: 'General-purpose engineering worker'
    };
    return descriptions[type];
  }

  private getWorkerCapabilities(type: WorkerType): string[] {
    const capabilities: Record<WorkerType, string[]> = {
      react: ['Component development', 'State management', 'UI implementation', 'Hooks'],
      nextjs: ['Page routing', 'API routes', 'SSR/SSG', 'Middleware'],
      node: ['API development', 'Database integration', 'Authentication', 'File operations'],
      python: ['Scripting', 'Data processing', 'API development', 'Automation'],
      rust: ['Systems programming', 'Performance-critical code', 'CLI tools', 'WebAssembly'],
      documentation: ['README writing', 'API docs', 'Tutorials', 'Code comments'],
      security: ['Vulnerability scanning', 'Code auditing', 'Dependency checking', 'Best practices'],
      performance: ['Bundle optimization', 'Caching', 'Code splitting', 'Profiling'],
      testing: ['Unit tests', 'Integration tests', 'E2E tests', 'Test coverage'],
      general: ['Any engineering task', 'Code review', 'Bug fixing', 'Refactoring']
    };
    return capabilities[type];
  }

  private getWorkerRequirements(type: WorkerType): string[] {
    const requirements: Record<WorkerType, string[]> = {
      react: ['React', 'TypeScript', 'JSX/TSX'],
      nextjs: ['Next.js', 'React', 'TypeScript'],
      node: ['Node.js', 'JavaScript', 'TypeScript'],
      python: ['Python', 'pip'],
      rust: ['Rust', 'Cargo'],
      documentation: ['Markdown', 'Documentation tools'],
      security: ['Security tools', 'Code analysis'],
      performance: ['Performance tools', 'Profiling'],
      testing: ['Test frameworks', 'Jest', 'Vitest'],
      general: ['General programming knowledge']
    };
    return requirements[type];
  }

  /**
   * Get worker
   */
  getWorker(id: string): Worker | undefined {
    return this.workers.get(id);
  }

  /**
   * Get all workers
   */
  getAllWorkers(): Worker[] {
    return Array.from(this.workers.values());
  }

  /**
   * Get workers by type
   */
  getWorkersByType(type: WorkerType): Worker[] {
    return Array.from(this.workers.values()).filter(w => w.type === type);
  }

  /**
   * Assign task to worker
   */
  assignTask(workerId: string, task: Omit<WorkerTask, 'id' | 'workerId' | 'status'>): WorkerTask | undefined {
    const worker = this.workers.get(workerId);
    if (worker && worker.status === 'idle') {
      const workerTask: WorkerTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        workerId,
        ...task,
        status: 'running',
        startedAt: new Date().toISOString()
      };

      worker.status = 'busy';
      worker.currentTask = workerTask.id;
      worker.lastActive = new Date().toISOString();

      this.tasks.set(workerTask.id, workerTask);
      this.saveData();
      return workerTask;
    }
    return undefined;
  }

  /**
   * Complete task
   */
  completeTask(taskId: string, output: Record<string, any>): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'completed';
      task.output = output;
      task.completedAt = new Date().toISOString();

      const worker = this.workers.get(task.workerId);
      if (worker) {
        worker.status = 'idle';
        worker.currentTask = undefined;
        worker.completedTasks++;
        worker.lastActive = new Date().toISOString();
      }

      this.saveData();
    }
  }

  /**
   * Fail task
   */
  failTask(taskId: string, error: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'failed';
      task.error = error;
      task.completedAt = new Date().toISOString();

      const worker = this.workers.get(task.workerId);
      if (worker) {
        worker.status = 'idle';
        worker.currentTask = undefined;
        worker.failedTasks++;
        worker.lastActive = new Date().toISOString();
      }

      this.saveData();
    }
  }

  /**
   * Get task
   */
  getTask(id: string): WorkerTask | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): WorkerTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get swarm summary
   */
  getSummary(): {
    totalWorkers: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
  } {
    const workers = Array.from(this.workers.values());
    const byType: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const worker of workers) {
      byType[worker.type] = (byType[worker.type] || 0) + 1;
      byStatus[worker.status] = (byStatus[worker.status] || 0) + 1;
    }

    const tasks = Array.from(this.tasks.values());
    return {
      totalWorkers: workers.length,
      byType,
      byStatus,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      failedTasks: tasks.filter(t => t.status === 'failed').length
    };
  }
}

// Singleton instance
let instance: EngineeringSwarm | null = null;

export function getEngineeringSwarm(dataDir: string): EngineeringSwarm {
  if (!instance) {
    instance = new EngineeringSwarm(dataDir);
  }
  return instance;
}
