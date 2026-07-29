// Bhavya Kernel — Scheduler Module
// Task scheduling and execution.

import type { Task, TaskId } from '../types/index.js';
import type { EventBus } from '../events/index.js';

export interface SchedulerConfig {
  events: EventBus;
}

export class Scheduler {
  private config: SchedulerConfig;
  private queue: Task[] = [];
  private running = new Map<TaskId, Task>();

  constructor(config: SchedulerConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Scheduler ready
  }

  async enqueue(task: Task): Promise<void> {
    this.queue.push(task);
    await this.config.events.emit('scheduler.task.queued', { taskId: task.id });
    await this.process();
  }

  private async process(): Promise<void> {
    // Simple FIFO processing
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.running.set(task.id, task);

      await this.config.events.emit('scheduler.task.started', { taskId: task.id });

      try {
        // Execute task (would call agent engine in production)
        task.status = 'completed';
        task.completedAt = new Date();
        await this.config.events.emit('scheduler.task.completed', { taskId: task.id });
      } catch (error) {
        task.status = 'failed';
        task.error = error as Error;
        await this.config.events.emit('scheduler.task.failed', { taskId: task.id, error });
      } finally {
        this.running.delete(task.id);
      }
    }
  }

  getQueue(): Task[] {
    return [...this.queue];
  }

  getRunning(): Task[] {
    return Array.from(this.running.values());
  }

  async cancel(taskId: TaskId): Promise<boolean> {
    const index = this.queue.findIndex((t) => t.id === taskId);
    if (index > -1) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  async shutdown(): Promise<void> {
    this.queue = [];
    this.running.clear();
  }
}
