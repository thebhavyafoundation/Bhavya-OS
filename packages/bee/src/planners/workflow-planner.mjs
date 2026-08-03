let nodeCounter = 0;

/**
 * Workflow Planner — constructs an execution plan as a DAG.
 * Given resolved capabilities, builds a directed acyclic graph
 * of execution nodes with proper dependencies and parallel layers.
 */
export class WorkflowPlanner {
  #registry;
  #resolver;

  /**
   * @param {import('../../runtime/src/registry-loader.mjs').RegistryLoader} registry
   * @param {import('./capability-resolver.mjs').CapabilityResolver} resolver
   */
  constructor(registry, resolver) {
    this.#registry = registry;
    this.#resolver = resolver;
  }

  /**
   * Build an execution plan from a resolved goal.
   * @param {import('../types.mjs').Goal} goal
   * @returns {import('../types.mjs').ExecutionPlan}
   */
  buildPlan(goal) {
    nodeCounter = 0;
    const nodes = [];

    // For each resolved capability, create ONE node
    // Then expand the primary capability's workflow into skill steps
    const primaryCapId = goal.capabilities[0];

    if (primaryCapId) {
      const chain = this.#resolver.getExecutionChain(primaryCapId);
      if (chain) {
        // Create a node for each skill in the workflow
        const skills = chain.skills.slice(0, 6); // Cap at 6 steps
        const agent = chain.agents[0];

        for (let i = 0; i < skills.length; i++) {
          const skill = skills[i];
          const id = `node-${String(++nodeCounter).padStart(3, '0')}`;
          const deps = i > 0 ? [`node-${String(nodeCounter - 1).padStart(3, '0')}`] : [];

          nodes.push({
            id,
            capabilityId: primaryCapId,
            workflowId: chain.workflows[0]?.id || null,
            skillId: skill.id,
            agentId: agent?.id || null,
            inputs: { goal: goal.text, params: goal.params, step: i + 1 },
            outputs: null,
            preconditions: [],
            dependencies: deps,
            timeoutMs: 300000,
            retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: 'exponential' },
            compensation: i === 0 ? { type: 'rollback', handler: 'default', params: {} } : null,
            approval: null,
            status: 'pending',
            error: null,
            attempt: 0,
            provenance: {
              capabilityId: primaryCapId,
              workflowId: chain.workflows[0]?.id || null,
              skillId: skill.id,
              agentId: agent?.id || null,
              actor: 'bee-engine',
              source: `goal:${goal.intent}`,
            },
          });
        }

        // If no skills found, create one node for the capability
        if (skills.length === 0) {
          nodes.push(this.#createNode(primaryCapId, goal));
        }
      } else {
        nodes.push(this.#createNode(primaryCapId, goal));
      }
    }

    // Add secondary capabilities as independent nodes (no deps on primary chain)
    for (let i = 1; i < goal.capabilities.length && nodes.length < 15; i++) {
      const capId = goal.capabilities[i];
      const existing = nodes.find(n => n.capabilityId === capId);
      if (!existing) {
        nodes.push(this.#createNode(capId, goal));
      }
    }

    // Build parallel execution layers via topological sort
    const layers = this.#buildLayers(nodes);

    // Set preconditions
    for (const node of nodes) {
      node.preconditions = [...node.dependencies];
    }

    const plan = {
      id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      goal: goal.text,
      status: 'pending',
      nodes,
      layers,
      context: {
        goal,
        createdAt: new Date().toISOString(),
      },
      metrics: {
        totalNodes: nodes.length,
        completed: 0,
        failed: 0,
        parallelized: layers.reduce((sum, l) => sum + Math.max(0, l.length - 1), 0),
        totalDurationMs: 0,
      },
    };

    return plan;
  }

  /**
   * Get a text representation of the execution graph.
   * @param {import('../types.mjs').ExecutionPlan} plan
   */
  getGraphText(plan) {
    const lines = [];
    lines.push(`Execution Plan: ${plan.id}`);
    lines.push(`Goal: ${plan.goal}`);
    lines.push(`Nodes: ${plan.nodes.length}, Layers: ${plan.layers.length}`);
    lines.push('');

    for (let i = 0; i < plan.layers.length; i++) {
      const layer = plan.layers[i];
      lines.push(`Layer ${i} (parallel: ${layer.length} nodes):`);
      for (const nodeId of layer) {
        const node = plan.nodes.find(n => n.id === nodeId);
        if (!node) continue;
        const deps = node.dependencies.length > 0 ? ` [deps: ${node.dependencies.join(', ')}]` : '';
        const agent = node.agentId ? ` [agent: ${node.agentId}]` : '';
        const skill = node.skillId ? ` [skill: ${node.skillId}]` : '';
        lines.push(`  ${nodeId}: ${node.capabilityId}${skill}${agent}${deps}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  // ─── Private ────────────────────────────────────

  #createNode(capabilityId, goal) {
    const id = `node-${String(++nodeCounter).padStart(3, '0')}`;

    return {
      id,
      capabilityId,
      workflowId: null,
      skillId: null,
      agentId: null,
      inputs: { goal: goal.text, params: goal.params },
      outputs: null,
      preconditions: [],
      dependencies: [],
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: 'exponential' },
      compensation: null,
      approval: null,
      status: 'pending',
      error: null,
      attempt: 0,
      provenance: {
        capabilityId,
        actor: 'bee-engine',
        source: `goal:${goal.intent}`,
      },
    };
  }

  #buildLayers(nodes) {
    // Kahn's algorithm for topological sort with layer assignment
    const inDegree = new Map();
    const adjacency = new Map();

    for (const node of nodes) {
      inDegree.set(node.id, 0);
      adjacency.set(node.id, []);
    }

    for (const node of nodes) {
      for (const depId of node.dependencies) {
        if (adjacency.has(depId)) {
          adjacency.get(depId).push(node.id);
          inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
        }
      }
    }

    const layers = [];
    const queue = [];

    // Start with nodes that have no dependencies
    for (const [id, degree] of inDegree) {
      if (degree === 0) queue.push(id);
    }

    while (queue.length > 0) {
      layers.push([...queue]);
      const nextQueue = [];

      for (const nodeId of queue) {
        for (const neighbor of adjacency.get(nodeId) || []) {
          const newDegree = inDegree.get(neighbor) - 1;
          inDegree.set(neighbor, newDegree);
          if (newDegree === 0) nextQueue.push(neighbor);
        }
      }

      queue.length = 0;
      queue.push(...nextQueue);
    }

    // Handle any remaining nodes (disconnected)
    const assigned = new Set(layers.flat());
    const remaining = nodes.filter(n => !assigned.has(n.id));
    if (remaining.length > 0) {
      layers.push(remaining.map(n => n.id));
    }

    return layers;
  }
}
