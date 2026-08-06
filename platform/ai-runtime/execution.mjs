/**
 * Bhavya OS — Execution Module
 * Task execution engine.
 */

export class Execution {
  constructor() {
    this.tasks = new Map();
    this.workers = new Map();
  }

  async submitTask(task) {
    const taskEntry = {
      id: `task-${Date.now()}`,
      ...task,
      status: "queued",
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    this.tasks.set(taskEntry.id, taskEntry);
    return taskEntry;
  }

  async executeTask(taskId, workerId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    
    task.status = "executing";
    task.workerId = workerId;
    task.startedAt = new Date().toISOString();
    task.attempts++;
    
    return task;
  }

  async completeTask(taskId, result) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    
    task.status = "completed";
    task.result = result;
    task.completedAt = new Date().toISOString();
    
    return task;
  }

  async failTask(taskId, error) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    
    task.status = "failed";
    task.error = error;
    task.failedAt = new Date().toISOString();
    
    return task;
  }

  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  listTasks(filter) {
    const tasks = [...this.tasks.values()];
    if (!filter) return tasks;
    return tasks.filter(filter);
  }

  getQueue() {
    return this.listTasks(t => t.status === "queued");
  }
}
