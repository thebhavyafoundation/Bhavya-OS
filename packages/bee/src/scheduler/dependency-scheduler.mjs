/**
 * Dependency Scheduler — manages execution ordering and parallelism.
 * Determines which nodes can run concurrently and which must wait.
 */
export class DependencyScheduler {
  /**
   * Get the next batch of executable nodes (all dependencies satisfied).
   * @param {import('../types.mjs').ExecutionPlan} plan
   * @returns {import('../types.mjs').ExecutionNode[]}
   */
  getReadyNodes(plan) {
    return plan.nodes.filter(node => {
      if (node.status !== 'pending') return false;

      // All dependencies must be completed
      return node.dependencies.every(depId => {
        const dep = plan.nodes.find(n => n.id === depId);
        return dep && dep.status === 'completed';
      });
    });
  }

  /**
   * Check if a node is blocked by failed dependencies.
   * @param {import('../types.mjs').ExecutionNode} node
   * @param {import('../types.mjs').ExecutionPlan} plan
   */
  isBlocked(node, plan) {
    return node.dependencies.some(depId => {
      const dep = plan.nodes.find(n => n.id === depId);
      return dep && (dep.status === 'failed' || dep.status === 'cancelled');
    });
  }

  /**
   * Get nodes that depend on a given node.
   * @param {string} nodeId
   * @param {import('../types.mjs').ExecutionPlan} plan
   * @returns {import('../types.mjs').ExecutionNode[]}
   */
  getDependents(nodeId, plan) {
    return plan.nodes.filter(n => n.dependencies.includes(nodeId));
  }

  /**
   * Get the critical path (longest path through the DAG).
   * @param {import('../types.mjs').ExecutionPlan} plan
   * @returns {string[]} ordered node IDs on the critical path
   */
  getCriticalPath(plan) {
    const distances = new Map();
    const predecessors = new Map();

    for (const node of plan.nodes) {
      distances.set(node.id, 0);
      predecessors.set(node.id, null);
    }

    // Process in topological order
    const processed = new Set();
    const queue = plan.nodes
      .filter(n => n.dependencies.length === 0)
      .map(n => n.id);

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (processed.has(nodeId)) continue;
      processed.add(nodeId);

      const node = plan.nodes.find(n => n.id === nodeId);
      const nodeDist = distances.get(nodeId) + (node.timeoutMs || 300000);

      for (const n of plan.nodes) {
        if (n.dependencies.includes(nodeId)) {
          const currentDist = distances.get(n.id);
          if (nodeDist > currentDist) {
            distances.set(n.id, nodeDist);
            predecessors.set(n.id, nodeId);
          }

          // Add to queue if all dependencies processed
          const allDepsProcessed = n.dependencies.every(d => processed.has(d));
          if (allDepsProcessed) queue.push(n.id);
        }
      }
    }

    // Find the end node with max distance
    let endNode = null;
    let maxDist = 0;
    for (const [id, dist] of distances) {
      if (dist > maxDist) { maxDist = dist; endNode = id; }
    }

    // Reconstruct path
    const path = [];
    let current = endNode;
    while (current) {
      path.unshift(current);
      current = predecessors.get(current);
    }

    return path;
  }

  /**
   * Estimate total execution time (critical path length).
   * @param {import('../types.mjs').ExecutionPlan} plan
   * @returns {number} estimated ms
   */
  estimateDuration(plan) {
    const criticalPath = this.getCriticalPath(plan);
    return criticalPath.reduce((total, nodeId) => {
      const node = plan.nodes.find(n => n.id === nodeId);
      return total + (node?.timeoutMs || 300000);
    }, 0);
  }

  /**
   * Get execution statistics.
   * @param {import('../types.mjs').ExecutionPlan} plan
   */
  getStats(plan) {
    const byStatus = {};
    for (const node of plan.nodes) {
      byStatus[node.status] = (byStatus[node.status] || 0) + 1;
    }

    return {
      totalNodes: plan.nodes.length,
      byStatus,
      layers: plan.layers.length,
      criticalPathLength: this.getCriticalPath(plan).length,
      estimatedDurationMs: this.estimateDuration(plan),
      maxParallelism: Math.max(...plan.layers.map(l => l.length)),
    };
  }
}
