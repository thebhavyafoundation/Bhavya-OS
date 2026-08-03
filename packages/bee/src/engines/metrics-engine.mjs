/**
 * Metrics Engine — collects and reports execution metrics.
 * Tracks success rates, durations, agent utilization, and more.
 */
export class MetricsEngine {
  #metrics = new Map(); // planId -> PlanMetrics
  #global = {
    totalPlans: 0,
    completedPlans: 0,
    failedPlans: 0,
    totalNodes: 0,
    completedNodes: 0,
    failedNodes: 0,
    totalEvents: 0,
  };

  /**
   * Start tracking a plan.
   * @param {string} planId
   * @param {string} goal
   */
  startPlan(planId, goal) {
    this.#metrics.set(planId, {
      planId,
      goal,
      startedAt: new Date().toISOString(),
      completedAt: null,
      nodes: [],
      events: [],
      status: 'running',
    });
    this.#global.totalPlans++;
  }

  /**
   * Record a node execution metric.
   * @param {string} planId
   * @param {Object} metric
   */
  recordNode(planId, metric) {
    const plan = this.#metrics.get(planId);
    if (!plan) return;

    plan.nodes.push({
      nodeId: metric.nodeId,
      capabilityId: metric.capabilityId,
      agentId: metric.agentId,
      status: metric.status,
      durationMs: metric.durationMs,
      attempts: metric.attempts || 1,
      error: metric.error || null,
      timestamp: new Date().toISOString(),
    });

    this.#global.totalNodes++;
    if (metric.status === 'completed') this.#global.completedNodes++;
    if (metric.status === 'failed') this.#global.failedNodes++;
  }

  /**
   * Record an execution event.
   * @param {string} planId
   * @param {Object} event
   */
  recordEvent(planId, event) {
    const plan = this.#metrics.get(planId);
    if (!plan) return;

    plan.events.push({
      type: event.type,
      nodeId: event.nodeId,
      timestamp: new Date().toISOString(),
      data: event.data,
    });

    this.#global.totalEvents++;
  }

  /**
   * Complete a plan.
   * @param {string} planId
   * @param {'completed'|'failed'|'cancelled'} status
   */
  completePlan(planId, status) {
    const plan = this.#metrics.get(planId);
    if (!plan) return;

    plan.completedAt = new Date().toISOString();
    plan.status = status;
    plan.durationMs = new Date(plan.completedAt).getTime() - new Date(plan.startedAt).getTime();

    if (status === 'completed') this.#global.completedPlans++;
    if (status === 'failed') this.#global.failedPlans++;
  }

  /**
   * Get metrics for a specific plan.
   * @param {string} planId
   */
  getPlanMetrics(planId) {
    return this.#metrics.get(planId) || null;
  }

  /**
   * Get summary metrics for a plan.
   * @param {string} planId
   */
  getPlanSummary(planId) {
    const plan = this.#metrics.get(planId);
    if (!plan) return null;

    const nodes = plan.nodes;
    return {
      planId: plan.planId,
      goal: plan.goal,
      status: plan.status,
      durationMs: plan.durationMs,
      totalNodes: nodes.length,
      completed: nodes.filter(n => n.status === 'completed').length,
      failed: nodes.filter(n => n.status === 'failed').length,
      avgNodeDuration: nodes.length > 0
        ? Math.round(nodes.reduce((s, n) => s + (n.durationMs || 0), 0) / nodes.length)
        : 0,
      totalEvents: plan.events.length,
    };
  }

  /**
   * Get global metrics across all plans.
   */
  getGlobal() {
    return {
      ...this.#global,
      successRate: this.#global.totalPlans > 0
        ? Math.round((this.#global.completedPlans / this.#global.totalPlans) * 100)
        : 0,
      nodeSuccessRate: this.#global.totalNodes > 0
        ? Math.round((this.#global.completedNodes / this.#global.totalNodes) * 100)
        : 0,
    };
  }

  /**
   * Get agent utilization (which agents handled the most work).
   * @param {string} [planId]
   */
  getAgentUtilization(planId) {
    const plans = planId ? [this.#metrics.get(planId)].filter(Boolean) : [...this.#metrics.values()];
    const agents = {};

    for (const plan of plans) {
      for (const node of plan.nodes) {
        if (!node.agentId) continue;
        if (!agents[node.agentId]) agents[node.agentId] = { total: 0, completed: 0, failed: 0, totalDurationMs: 0 };
        agents[node.agentId].total++;
        if (node.status === 'completed') agents[node.agentId].completed++;
        if (node.status === 'failed') agents[node.agentId].failed++;
        agents[node.agentId].totalDurationMs += node.durationMs || 0;
      }
    }

    return agents;
  }
}
