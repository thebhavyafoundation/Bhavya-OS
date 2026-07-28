// Idempotency Module
// Prevents duplicate execution. Tracks what has already been done.
// If an event is replayed or a workflow restarted, the runtime knows:
// - whether the task has already completed
// - whether it should resume
// - or whether it should execute again

import type { ExecutionId, IdempotencyKey, ExecutionRecord, ExecutionContext, ExecutionState } from '../types/index.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

export interface IdempotencyConfig {
  root: string;
  ttlMs?: number; // Time to live for keys (default: 1 hour)
}

export class Idempotency {
  private config: IdempotencyConfig;
  private keys = new Map<string, IdempotencyKey>();
  private records = new Map<ExecutionId, ExecutionRecord>();
  private storeDir: string;

  constructor(config: IdempotencyConfig) {
    this.config = config;
    this.storeDir = resolve(config.root, '.kernel/idempotency');
  }

  async initialize(): Promise<void> {
    if (!existsSync(this.storeDir)) {
      mkdirSync(this.storeDir, { recursive: true });
    }
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const keysFile = resolve(this.storeDir, 'keys.json');
    if (existsSync(keysFile)) {
      try {
        const data = JSON.parse(readFileSync(keysFile, 'utf-8'));
        for (const [key, value] of Object.entries(data)) {
          this.keys.set(key, value as IdempotencyKey);
        }
      } catch { /* ignore */ }
    }

    const recordsFile = resolve(this.storeDir, 'records.json');
    if (existsSync(recordsFile)) {
      try {
        const data = JSON.parse(readFileSync(recordsFile, 'utf-8'));
        for (const [id, value] of Object.entries(data)) {
          this.records.set(id, value as ExecutionRecord);
        }
      } catch { /* ignore */ }
    }
  }

  private async saveAll(): Promise<void> {
    const keysObj = Object.fromEntries(this.keys);
    writeFileSync(resolve(this.storeDir, 'keys.json'), JSON.stringify(keysObj, null, 2));

    const recordsObj = Object.fromEntries(this.records);
    writeFileSync(resolve(this.storeDir, 'records.json'), JSON.stringify(recordsObj, null, 2));
  }

  // Check if a key has already been executed
  async check(key: string): Promise<{ exists: boolean; status?: string; result?: unknown }> {
    const entry = this.keys.get(key);
    if (!entry) return { exists: false };

    // Check expiry
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      this.keys.delete(key);
      return { exists: false };
    }

    return {
      exists: true,
      status: entry.status,
      result: entry.result,
    };
  }

  // Register a key as pending
  async register(key: string, executionId: ExecutionId): Promise<void> {
    this.keys.set(key, {
      key,
      executionId,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (this.config.ttlMs ?? 3600000)),
    });
    await this.saveAll();
  }

  // Mark a key as completed
  async complete(key: string, result?: unknown): Promise<void> {
    const entry = this.keys.get(key);
    if (entry) {
      entry.status = 'completed';
      entry.result = result;
      entry.completedAt = new Date();
      await this.saveAll();
    }
  }

  // Mark a key as failed
  async fail(key: string, error?: string): Promise<void> {
    const entry = this.keys.get(key);
    if (entry) {
      entry.status = 'failed';
      entry.result = { error };
      entry.completedAt = new Date();
      await this.saveAll();
    }
  }

  // Check if execution should proceed
  async shouldExecute(key: string): Promise<{ proceed: boolean; reason: string }> {
    const check = await this.check(key);
    if (!check.exists) {
      return { proceed: true, reason: 'key_not_found' };
    }
    if (check.status === 'completed') {
      return { proceed: false, reason: 'already_completed' };
    }
    if (check.status === 'failed') {
      return { proceed: true, reason: 'retry_after_failure' };
    }
    if (check.status === 'pending') {
      return { proceed: false, reason: 'already_in_progress' };
    }
    return { proceed: true, reason: 'unknown_status' };
  }

  // Record an execution
  async recordExecution(execution: ExecutionRecord): Promise<void> {
    this.records.set(execution.executionId, execution);
    await this.saveAll();
  }

  // Update execution state
  async updateExecution(executionId: ExecutionId, state: ExecutionState, output?: unknown): Promise<void> {
    const record = this.records.get(executionId);
    if (record) {
      record.status = state;
      record.output = output as Record<string, unknown>;
      if (state === 'completed' || state === 'failed') {
        record.completedAt = new Date();
      }
      await this.saveAll();
    }
  }

  // Get execution record
  async getExecution(executionId: ExecutionId): Promise<ExecutionRecord | undefined> {
    return this.records.get(executionId);
  }

  // Get all executions
  async getAllExecutions(): Promise<ExecutionRecord[]> {
    return Array.from(this.records.values());
  }

  // Get executions by state
  async getExecutionsByState(state: ExecutionState): Promise<ExecutionRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.status === state);
  }

  // Cleanup expired keys
  async cleanup(): Promise<number> {
    const now = new Date();
    let cleaned = 0;
    for (const [key, entry] of this.keys) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.keys.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) await this.saveAll();
    return cleaned;
  }

  async shutdown(): Promise<void> {
    await this.saveAll();
    this.keys.clear();
    this.records.clear();
  }
}
