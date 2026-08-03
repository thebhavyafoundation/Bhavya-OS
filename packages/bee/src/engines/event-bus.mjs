/**
 * Event Bus — execution-scoped event system.
 * Emits structured events during plan execution for observability.
 */
export class EventBus {
  #handlers = new Map();
  #history = [];
  #maxHistory = 2000;

  /**
   * Register an event handler.
   * @param {string} eventType - e.g., 'node.started', 'plan.completed', '*'
   * @param {(event: import('../types.mjs').ExecutionEvent) => void | Promise<void>} handler
   */
  on(eventType, handler) {
    if (!this.#handlers.has(eventType)) this.#handlers.set(eventType, []);
    this.#handlers.get(eventType).push(handler);
    return () => this.off(eventType, handler);
  }

  /**
   * Unregister a handler.
   */
  off(eventType, handler) {
    const handlers = this.#handlers.get(eventType);
    if (handlers) {
      const idx = handlers.indexOf(handler);
      if (idx >= 0) handlers.splice(idx, 1);
    }
  }

  /**
   * Emit an event.
   * @param {string} type
   * @param {string} planId
   * @param {string} [nodeId]
   * @param {Record<string, any>} [data]
   */
  async emit(type, planId, nodeId, data = {}) {
    const event = {
      type,
      planId,
      nodeId: nodeId || null,
      timestamp: new Date().toISOString(),
      data,
    };

    this.#history.push(event);
    if (this.#history.length > this.#maxHistory) {
      this.#history = this.#history.slice(-this.#maxHistory);
    }

    const handlers = [
      ...(this.#handlers.get(type) || []),
      ...(this.#handlers.get('*') || []),
    ];

    for (const handler of handlers) {
      try { await handler(event); } catch { /* handler errors don't break execution */ }
    }

    return event;
  }

  /**
   * Convenience: emit plan-level events.
   */
  async planStarted(planId, goal) {
    return this.emit('plan.started', planId, null, { goal });
  }
  async planCompleted(planId, metrics) {
    return this.emit('plan.completed', planId, null, { metrics });
  }
  async planFailed(planId, error) {
    return this.emit('plan.failed', planId, null, { error });
  }
  async planPaused(planId, reason) {
    return this.emit('plan.paused', planId, null, { reason });
  }

  /**
   * Convenience: emit node-level events.
   */
  async nodeStarted(planId, nodeId, capabilityId) {
    return this.emit('node.started', planId, nodeId, { capabilityId });
  }
  async nodeCompleted(planId, nodeId, outputs) {
    return this.emit('node.completed', planId, nodeId, { outputs });
  }
  async nodeFailed(planId, nodeId, error, attempt) {
    return this.emit('node.failed', planId, nodeId, { error, attempt });
  }
  async nodeRetrying(planId, nodeId, attempt, maxAttempts) {
    return this.emit('node.retrying', planId, nodeId, { attempt, maxAttempts });
  }
  async nodeWaitingApproval(planId, nodeId, approvers) {
    return this.emit('node.waiting-approval', planId, nodeId, { approvers });
  }
  async nodeApproved(planId, nodeId, approver) {
    return this.emit('node.approved', planId, nodeId, { approver });
  }
  async nodeCompensating(planId, nodeId, reason) {
    return this.emit('node.compensating', planId, nodeId, { reason });
  }

  /**
   * Get event history.
   * @param {{ planId?: string, type?: string, limit?: number }} [opts]
   */
  history(opts = {}) {
    let events = this.#history;
    if (opts.planId) events = events.filter(e => e.planId === opts.planId);
    if (opts.type) events = events.filter(e => e.type === opts.type);
    return events.slice(-(opts.limit || 100));
  }

  /**
   * Get event stats.
   */
  stats() {
    const byType = {};
    for (const e of this.#history) {
      byType[e.type] = (byType[e.type] || 0) + 1;
    }
    return { total: this.#history.length, byType };
  }
}
