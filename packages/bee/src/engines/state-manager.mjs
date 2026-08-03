import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

/**
 * State Manager — persists execution state to disk.
 * Supports resume after interruption via checkpointing.
 */
export class StateManager {
  #stateDir;
  #activeStates = new Map();

  constructor(stateDir) {
    this.#stateDir = stateDir;
    if (!existsSync(stateDir)) mkdirSync(stateDir, { recursive: true });
  }

  /**
   * Save execution plan state.
   * @param {import('../types.mjs').ExecutionPlan} plan
   */
  save(plan) {
    const snapshot = {
      planId: plan.id,
      goal: plan.goal,
      status: plan.status,
      nodes: plan.nodes.map(n => ({
        id: n.id,
        capabilityId: n.capabilityId,
        workflowId: n.workflowId,
        skillId: n.skillId,
        agentId: n.agentId,
        inputs: n.inputs,
        outputs: n.outputs || null,
        preconditions: n.preconditions,
        dependencies: n.dependencies,
        status: n.status,
        error: n.error || null,
        attempt: n.attempt || 0,
        startedAt: n.startedAt || null,
        completedAt: n.completedAt || null,
        provenance: n.provenance || null,
        retryPolicy: n.retryPolicy || null,
        compensation: n.compensation || null,
        approval: n.approval || null,
        timeoutMs: n.timeoutMs || null,
      })),
      layers: plan.layers,
      context: plan.context,
      startedAt: plan.startedAt,
      completedAt: plan.completedAt,
      metrics: plan.metrics || null,
      lastCheckpoint: new Date().toISOString(),
    };

    const filename = `${plan.id}.json`;
    writeFileSync(join(this.#stateDir, filename), JSON.stringify(snapshot, null, 2));
    this.#activeStates.set(plan.id, snapshot);
    return snapshot;
  }

  /**
   * Load execution plan state by ID.
   * @param {string} planId
   * @returns {Object|null}
   */
  load(planId) {
    if (this.#activeStates.has(planId)) return this.#activeStates.get(planId);

    const filepath = join(this.#stateDir, `${planId}.json`);
    if (!existsSync(filepath)) return null;

    try {
      const data = JSON.parse(readFileSync(filepath, 'utf-8'));
      this.#activeStates.set(planId, data);
      return data;
    } catch {
      return null;
    }
  }

  /**
   * List all persisted plan states.
   * @param {{ status?: string, limit?: number }} [opts]
   * @returns {Object[]}
   */
  list(opts = {}) {
    const files = readdirSync(this.#stateDir).filter(f => f.endsWith('.json'));
    let plans = files.map(f => {
      try {
        return JSON.parse(readFileSync(join(this.#stateDir, f), 'utf-8'));
      } catch {
        return null;
      }
    }).filter(Boolean);

    if (opts.status) plans = plans.filter(p => p.status === opts.status);
    if (opts.limit) plans = plans.slice(-opts.limit);

    return plans.map(p => ({
      planId: p.planId,
      goal: p.goal,
      status: p.status,
      totalNodes: p.nodes?.length || 0,
      completed: p.nodes?.filter(n => n.status === 'completed').length || 0,
      lastCheckpoint: p.lastCheckpoint,
    }));
  }

  /**
   * Update a single node's state within a plan.
   * @param {string} planId
   * @param {string} nodeId
   * @param {Partial<import('../types.mjs').ExecutionNode>} updates
   */
  updateNode(planId, nodeId, updates) {
    const state = this.load(planId);
    if (!state) return null;

    const node = state.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    Object.assign(node, updates);
    state.lastCheckpoint = new Date().toISOString();

    const filename = `${planId}.json`;
    writeFileSync(join(this.#stateDir, filename), JSON.stringify(state, null, 2));
    this.#activeStates.set(planId, state);
    return state;
  }

  /**
   * Delete a plan state.
   * @param {string} planId
   */
  delete(planId) {
    const filepath = join(this.#stateDir, `${planId}.json`);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
    }
    this.#activeStates.delete(planId);
  }

  /**
   * Get plans that can be resumed (paused or failed).
   * @returns {Object[]}
   */
  resumable() {
    return this.list({ status: 'paused' })
      .concat(this.list({ status: 'failed' }));
  }
}
