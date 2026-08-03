/**
 * Agent Orchestrator — determines which agents participate in execution.
 * Handles agent assignment, load tracking, and capability matching.
 */
export class AgentOrchestrator {
  #registry;
  #load = new Map(); // agentId -> active task count

  /** @param {import('../../runtime/src/registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Assign agents to a set of execution nodes.
   * @param {import('../types.mjs').ExecutionNode[]} nodes
   * @returns {Map<string, import('../types.mjs').ExecutionNode[]>} agentId -> nodes
   */
  assignAgents(nodes) {
    const assignments = new Map();
    const agents = this.#registry.getByKind('agent');

    for (const node of nodes) {
      const agent = this.#findBestAgent(node, agents);
      if (agent) {
        node.agentId = agent.id;
        if (!assignments.has(agent.id)) assignments.set(agent.id, []);
        assignments.get(agent.id).push(node);
      }
    }

    return assignments;
  }

  /**
   * Get available agents (not at max capacity).
   * @param {number} [maxLoad=5]
   * @returns {Object[]}
   */
  getAvailable(maxLoad = 5) {
    const agents = this.#registry.getByKind('agent');
    return agents.filter(a => (this.#load.get(a.id) || 0) < maxLoad);
  }

  /**
   * Mark an agent as busy (increment load).
   * @param {string} agentId
   */
  acquire(agentId) {
    this.#load.set(agentId, (this.#load.get(agentId) || 0) + 1);
  }

  /**
   * Mark an agent as free (decrement load).
   * @param {string} agentId
   */
  release(agentId) {
    const current = this.#load.get(agentId) || 0;
    this.#load.set(agentId, Math.max(0, current - 1));
  }

  /**
   * Get agent utilization.
   */
  getUtilization() {
    const agents = this.#registry.getByKind('agent');
    const utilization = [];

    for (const agent of agents) {
      const currentLoad = this.#load.get(agent.id) || 0;
      const capabilities = agent.metadata?.capabilities || [];
      const skills = agent.metadata?.skills || [];

      utilization.push({
        agentId: agent.id,
        name: agent.name,
        domain: agent.domain,
        currentLoad,
        capabilityCount: capabilities.length,
        skillCount: skills.length,
      });
    }

    return utilization.sort((a, b) => b.currentLoad - a.currentLoad);
  }

  /**
   * Resolve which agents are needed for a goal's capabilities.
   * @param {string[]} capabilityIds
   * @returns {Object[]} agents with their assigned capabilities
   */
  resolveForCapabilities(capabilityIds) {
    const agents = this.#registry.getByKind('agent');
    const result = [];

    for (const agent of agents) {
      const agentCaps = agent.metadata?.capabilities || [];
      const matchedCaps = capabilityIds.filter(c => agentCaps.includes(c));

      if (matchedCaps.length > 0) {
        result.push({
          agentId: agent.id,
          name: agent.name,
          domain: agent.domain,
          capabilities: matchedCaps,
          skills: (agent.metadata?.skills || []).filter(s =>
            this.#registry.get(s)?.domain === agent.domain
          ),
        });
      }
    }

    return result;
  }

  // ─── Private ────────────────────────────────────

  #findBestAgent(node, agents) {
    // Find agents that can handle this node's capability
    const capable = agents.filter(a => {
      const caps = a.metadata?.capabilities || [];
      return caps.includes(node.capabilityId);
    });

    if (capable.length === 0) return null;

    // Sort by current load (least busy first)
    capable.sort((a, b) =>
      (this.#load.get(a.id) || 0) - (this.#load.get(b.id) || 0)
    );

    return capable[0];
  }
}
