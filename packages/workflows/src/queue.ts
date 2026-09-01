/**
 * @bhavya/workflows — Job Queue
 *
 * Simple in-memory job queue with priority and concurrency control.
 */

import { generateId } from "@bhavya/platform";

export type JobStatus =
  "pending" | "running" | "completed" | "failed" | "cancelled";

export interface Job<T = unknown> {
  id: string;
  type: string;
  payload: T;
  status: JobStatus;
  priority: number;
  result?: unknown;
  error?: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export type JobHandler<T = unknown> = (job: Job<T>) => Promise<unknown>;

/**
 * Simple in-memory job queue.
 */
export class JobQueue {
  private jobs: Job[] = [];
  private handlers = new Map<string, JobHandler>();
  private processing = false;
  private maxConcurrent = 3;
  private running = 0;

  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Register a handler for a job type.
   */
  register<T>(type: string, handler: JobHandler<T>) {
    this.handlers.set(type, handler as JobHandler);
  }

  /**
   * Enqueue a job.
   */
  enqueue<T>(
    type: string,
    payload: T,
    options?: { priority?: number; maxAttempts?: number },
  ): Job<T> {
    const job: Job<T> = {
      id: generateId("job"),
      type,
      payload,
      status: "pending",
      priority: options?.priority ?? 0,
      attempts: 0,
      maxAttempts: options?.maxAttempts ?? 3,
      createdAt: new Date().toISOString(),
    };
    this.jobs.push(job);
    this.processNext();
    return job;
  }

  /**
   * Get a job by ID.
   */
  getJob(id: string): Job | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  /**
   * Get all jobs, optionally filtered by status.
   */
  getJobs(status?: JobStatus): Job[] {
    return status
      ? this.jobs.filter((j) => j.status === status)
      : [...this.jobs];
  }

  /**
   * Cancel a job.
   */
  cancel(id: string): boolean {
    const job = this.jobs.find((j) => j.id === id);
    if (!job || job.status === "completed" || job.status === "running")
      return false;
    job.status = "cancelled";
    return true;
  }

  private async processNext() {
    if (this.processing || this.running >= this.maxConcurrent) return;
    this.processing = true;

    const pending = this.jobs
      .filter((j) => j.status === "pending")
      .sort((a, b) => b.priority - a.priority);

    for (const job of pending) {
      if (this.running >= this.maxConcurrent) break;
      this.runJob(job);
    }

    this.processing = false;
  }

  private async runJob(job: Job) {
    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "failed";
      job.error = `No handler for job type: ${job.type}`;
      return;
    }

    job.status = "running";
    job.startedAt = new Date().toISOString();
    job.attempts++;
    this.running++;

    try {
      job.result = await handler(job);
      job.status = "completed";
      job.completedAt = new Date().toISOString();
    } catch (err: unknown) {
      job.error = err instanceof Error ? err.message : String(err);
      if (job.attempts < job.maxAttempts) {
        job.status = "pending";
      } else {
        job.status = "failed";
        job.completedAt = new Date().toISOString();
      }
    } finally {
      this.running--;
      this.processNext();
    }
  }
}
