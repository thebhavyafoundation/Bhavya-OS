/**
 * Approval Engine — handles human approval gates.
 * When a node requires approval, the engine pauses execution
 * and waits for an authorized approver to act.
 */
export class ApprovalEngine {
  #pending = new Map(); // nodeId -> { config, resolved, timeoutHandle }
  #decisions = new Map(); // nodeId -> { decision, approver, timestamp }

  /**
   * Request approval for a node.
   * @param {string} nodeId
   * @param {import('../types.mjs').ApprovalConfig} config
   * @returns {Promise<{ approved: boolean, approver?: string }>}
   */
  async request(nodeId, config) {
    if (!config.required) return { approved: true, approver: 'auto' };

    // Check if already decided
    if (this.#decisions.has(nodeId)) {
      return this.#decisions.get(nodeId);
    }

    // Create a promise that resolves when approval is given or timeout
    return new Promise((resolve) => {
      const timeoutHandle = setTimeout(() => {
        this.#pending.delete(nodeId);
        const result = { approved: false, approver: 'timeout', timestamp: new Date().toISOString() };
        this.#decisions.set(nodeId, result);
        resolve(result);
      }, config.timeoutMs || 300000); // 5min default

      this.#pending.set(nodeId, {
        config,
        resolve,
        timeoutHandle,
        requestedAt: new Date().toISOString(),
      });
    });
  }

  /**
   * Grant approval for a pending node.
   * @param {string} nodeId
   * @param {string} approver - role or agent ID
   */
  approve(nodeId, approver) {
    const pending = this.#pending.get(nodeId);
    if (!pending) return false;

    clearTimeout(pending.timeoutHandle);
    const result = { approved: true, approver, timestamp: new Date().toISOString() };
    this.#decisions.set(nodeId, result);
    pending.resolve(result);
    this.#pending.delete(nodeId);
    return true;
  }

  /**
   * Deny approval for a pending node.
   * @param {string} nodeId
   * @param {string} approver
   * @param {string} [reason]
   */
  deny(nodeId, approver, reason = 'denied') {
    const pending = this.#pending.get(nodeId);
    if (!pending) return false;

    clearTimeout(pending.timeoutHandle);
    const result = { approved: false, approver, reason, timestamp: new Date().toISOString() };
    this.#decisions.set(nodeId, result);
    pending.resolve(result);
    this.#pending.delete(nodeId);
    return true;
  }

  /**
   * Check if a node has a pending approval.
   * @param {string} nodeId
   */
  isPending(nodeId) {
    return this.#pending.has(nodeId);
  }

  /**
   * Get all pending approvals.
   */
  getPending() {
    const pending = [];
    for (const [nodeId, entry] of this.#pending) {
      pending.push({
        nodeId,
        config: entry.config,
        requestedAt: entry.requestedAt,
      });
    }
    return pending;
  }

  /**
   * Get decision for a node.
   * @param {string} nodeId
   */
  getDecision(nodeId) {
    return this.#decisions.get(nodeId) || null;
  }

  /**
   * Get approval stats.
   */
  stats() {
    const all = [...this.#decisions.values()];
    return {
      pending: this.#pending.size,
      approved: all.filter(d => d.approved).length,
      denied: all.filter(d => !d.approved).length,
      total: all.length,
    };
  }
}
