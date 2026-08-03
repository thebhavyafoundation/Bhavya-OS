/**
 * Recovery Engine — handles retries, compensation, and rollback.
 * When a node fails, the recovery engine determines the next action:
 * retry (same node), compensate (undo completed nodes), or fail the plan.
 */
export class RecoveryEngine {
  #compensationHandlers = new Map();

  /**
   * Register a compensation handler.
   * @param {string} type - handler type name
   * @param {(node: import('../types.mjs').ExecutionNode, context: Record<string, any>) => Promise<void>} handler
   */
  registerCompensation(type, handler) {
    this.#compensationHandlers.set(type, handler);
  }

  /**
   * Handle a failed node — determines whether to retry, compensate, or fail.
   * @param {import('../types.mjs').ExecutionNode} node
   * @param {Record<string, any>} context
   * @returns {{ action: 'retry'|'compensate'|'fail', delayMs?: number, reason: string }}
   */
  async handleFailure(node, context) {
    const policy = node.retryPolicy || { maxAttempts: 3, backoffMs: 1000, strategy: 'exponential' };
    const attempt = (node.attempt || 0) + 1;

    if (attempt < policy.maxAttempts) {
      const delayMs = policy.strategy === 'exponential'
        ? policy.backoffMs * Math.pow(2, attempt - 1)
        : policy.backoffMs * attempt;

      return {
        action: 'retry',
        delayMs,
        attempt,
        reason: `Attempt ${attempt}/${policy.maxAttempts} after ${delayMs}ms backoff`,
      };
    }

    // Max attempts reached — check for compensation
    if (node.compensation) {
      return {
        action: 'compensate',
        reason: `Max retries (${policy.maxAttempts}) exceeded, initiating compensation: ${node.compensation.type}`,
      };
    }

    return {
      action: 'fail',
      reason: `Max retries (${policy.maxAttempts}) exceeded, no compensation configured`,
    };
  }

  /**
   * Execute compensation for a node.
   * @param {import('../types.mjs').ExecutionNode} node
   * @param {Record<string, any>} context
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async compensate(node, context) {
    if (!node.compensation) return { success: true };

    const handler = this.#compensationHandlers.get(node.compensation.type);
    if (!handler) {
      return { success: false, error: `No compensation handler for type: ${node.compensation.type}` };
    }

    try {
      await handler(node, context);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Compensate all completed nodes in reverse order (for plan-level rollback).
   * @param {import('../types.mjs').ExecutionNode[]} completedNodes
   * @param {Record<string, any>} context
   * @returns {Promise<{ compensated: number, failed: number, errors: string[] }>}
   */
  async compensateAll(completedNodes, context) {
    const results = { compensated: 0, failed: 0, errors: [] };
    const sorted = [...completedNodes].reverse();

    for (const node of sorted) {
      if (!node.compensation) continue;
      const result = await this.compensate(node, context);
      if (result.success) {
        results.compensated++;
      } else {
        results.failed++;
        results.errors.push(`${node.id}: ${result.error}`);
      }
    }

    return results;
  }

  /**
   * Build a failure report for a node.
   * @param {import('../types.mjs').ExecutionNode} node
   */
  buildReport(node) {
    return {
      nodeId: node.id,
      capabilityId: node.capabilityId,
      status: node.status,
      error: node.error,
      attempts: node.attempt || 0,
      hasCompensation: !!node.compensation,
      compensationType: node.compensation?.type || null,
      startedAt: node.startedAt,
      completedAt: node.completedAt,
      durationMs: node.startedAt && node.completedAt
        ? new Date(node.completedAt).getTime() - new Date(node.startedAt).getTime()
        : null,
    };
  }
}
