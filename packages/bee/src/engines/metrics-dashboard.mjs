/**
 * Metrics Dashboard — tracks pipeline performance, capability efficiency,
 * agent utilization, success rates, and end-to-end metrics.
 */
export class MetricsDashboard {
  constructor() {
    this.plans = new Map();
    this.global = { runs: 0, successes: 0, failures: 0, totalTimeMs: 0 };
  }

  /** Record a plan execution */
  recordPlan(plan) {
    this.plans.set(plan.id, {
      id: plan.id, goal: plan.goal?.raw, domain: plan.goal?.domain, subject: plan.goal?.subject,
      totalNodes: plan.totalNodes, parallelLayers: plan.parallelLayers,
      criticalPath: plan.criticalPath, estimatedDuration: plan.estimatedDuration,
      agentCount: plan.agentCount,
      startTime: Date.now(), endTime: null, status: 'running',
      nodeMetrics: [], capabilityMetrics: new Map(), agentMetrics: new Map(),
    });
  }

  /** Complete a plan */
  completePlan(planId, success = true) {
    const plan = this.plans.get(planId);
    if (!plan) return;
    plan.endTime = Date.now();
    plan.status = success ? 'success' : 'failure';
    plan.durationMs = plan.endTime - plan.startTime;
    this.global.runs++;
    if (success) this.global.successes++;
    else this.global.failures++;
    this.global.totalTimeMs += plan.durationMs;
  }

  /** Record a node execution */
  recordNode(planId, node) {
    const plan = this.plans.get(planId);
    if (!plan) return;
    plan.nodeMetrics.push({
      id: node.id, capabilityId: node.capabilityId, agentId: node.assignedAgent,
      startTime: node.startTime || Date.now(), endTime: node.endTime || null,
      status: node.status, durationMs: node.endTime ? node.endTime - (node.startTime || Date.now()) : null,
    });
    // Capability metrics
    const cap = plan.capabilityMetrics.get(node.capabilityId) || { count: 0, totalTimeMs: 0, successes: 0, failures: 0 };
    cap.count++;
    if (node.status === 'completed') { cap.successes++; cap.totalTimeMs += (node.endTime - node.startTime) || 0; }
    else if (node.status === 'failed') cap.failures++;
    plan.capabilityMetrics.set(node.capabilityId, cap);
    // Agent metrics
    const agentId = node.assignedAgent || node.agentId;
    if (agentId) {
      const ag = plan.agentMetrics.get(agentId) || { count: 0, totalTimeMs: 0, successes: 0 };
      ag.count++;
      if (node.status === 'completed') { ag.successes++; ag.totalTimeMs += (node.endTime - node.startTime) || 0; }
      plan.agentMetrics.set(agentId, ag);
    }
  }

  /** Get plan metrics */
  getPlanMetrics(planId) {
    const plan = this.plans.get(planId);
    if (!plan) return null;
    return {
      ...plan,
      capabilityMetrics: Object.fromEntries(plan.capabilityMetrics),
      agentMetrics: Object.fromEntries(plan.agentMetrics),
      // Convert Maps to plain objects for serialization
      capabilityMetricsRaw: Object.fromEntries(plan.capabilityMetrics),
      agentMetricsRaw: Object.fromEntries(plan.agentMetrics),
    };
  }

  /** Get global metrics */
  getGlobalMetrics() {
    const successRateNum = this.global.runs > 0 ? (this.global.successes / this.global.runs * 100) : 0;
    const avgDurationMs = this.global.runs > 0 ? Math.round(this.global.totalTimeMs / this.global.runs) : 0;
    return { ...this.global, successRate: successRateNum, avgDurationMs };
  }

  /** Get capability breakdown */
  getCapabilityBreakdown() {
    const caps = new Map();
    for (const plan of this.plans.values()) {
      for (const [capId, metrics] of plan.capabilityMetrics) {
        const existing = caps.get(capId) || { count: 0, totalTimeMs: 0, successes: 0, failures: 0 };
        existing.count += metrics.count;
        existing.totalTimeMs += metrics.totalTimeMs;
        existing.successes += metrics.successes;
        existing.failures += metrics.failures;
        caps.set(capId, existing);
      }
    }
    const result = [];
    for (const [id, m] of caps) {
      result.push({ id, count: m.count, avgTimeMs: m.count > 0 ? Math.round(m.totalTimeMs / m.count) : 0, successRate: m.count > 0 ? `${(m.successes / m.count * 100).toFixed(1)}%` : '0%' });
    }
    result.sort((a, b) => b.count - a.count);
    return result;
  }

  /** Get agent utilization */
  getAgentUtilization() {
    const agents = new Map();
    for (const plan of this.plans.values()) {
      for (const [agentId, metrics] of plan.agentMetrics) {
        const existing = agents.get(agentId) || { count: 0, totalTimeMs: 0, successes: 0 };
        existing.count += metrics.count;
        existing.totalTimeMs += metrics.totalTimeMs;
        existing.successes += metrics.successes;
        agents.set(agentId, existing);
      }
    }
    const result = [];
    for (const [id, m] of agents) {
      result.push({ id, count: m.count, avgTimeMs: m.count > 0 ? Math.round(m.totalTimeMs / m.count) : 0, successRate: m.count > 0 ? `${(m.successes / m.count * 100).toFixed(1)}%` : '0%' });
    }
    result.sort((a, b) => b.count - a.count);
    return result;
  }
}
