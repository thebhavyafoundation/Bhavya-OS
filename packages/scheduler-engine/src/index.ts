// Scheduler Engine
// Task scheduling, cron, retries, concurrency control

import type { Task, TaskId } from '@bhavya/kernel';

export interface SchedulerEngineConfig {
  maxConcurrency?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ScheduledTask {
  task: Task;
  schedule?: string;
  retryCount: number;
  maxRetries: number;
}

export class SchedulerEngine {
  private config: SchedulerEngineConfig;
  private queue: ScheduledTask[] = [];
  private running = new Map<TaskId, ScheduledTask>();
  private completed: TaskId[] = [];

  constructor(config: SchedulerEngineConfig = {}) {
    this.config = {
      maxConcurrency: config.maxConcurrency ?? 5,
      retryAttempts: config.retryAttempts ?? 3,
      retryDelay: config.retryDelay ?? 1000,
    };
  }

  async initialize(): Promise<void> {
    // Start processing loop
  }

  async enqueue(task: Task): Promise<void> {
    const scheduled: ScheduledTask = {
      task,
      retryCount: 0,
      maxRetries: this.config.retryAttempts!,
    };
    this.queue.push(scheduled);
    await this.process();
  }

  private async process(): Promise<void> {
    while (this.queue.length > 0 && this.running.size < this.config.maxConcurrency!) {
      const scheduled = this.queue.shift()!;
      this.running.set(scheduled.task.id, scheduled);

      try {
        // Execute task
        scheduled.task.status = 'completed';
        scheduled.task.completedAt = new Date();
        this.completed.push(scheduled.task.id);
      } catch (error) {
        if (scheduled.retryCount < scheduled.maxRetries) {
          scheduled.retryCount++;
          this.queue.push(scheduled);
        } else {
          scheduled.task.status = 'failed';
          scheduled.task.error = error as Error;
        }
      } finally {
        this.running.delete(scheduled.task.id);
      }
    }
  }

  async cancel(taskId: TaskId): Promise<boolean> {
    const index = this.queue.findIndex((s) => s.task.id === taskId);
    if (index > -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  getStats() {
    return {
      queued: this.queue.length,
      running: this.running.size,
      completed: this.completed.length,
    };
  }

  async shutdown(): Promise<void> {
    this.queue = [];
    this.running.clear();
    this.completed = [];
  }
}
