/**
 * Capability Resolver — maps structured goals to BAR capabilities.
 * Uses domain, intent, subject, and grade to find the right capabilities.
 */
export class CapabilityResolver {
  #registry;

  /** @param {import('../../runtime/src/registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Resolve a goal to its required capabilities.
   * @param {import('../types.mjs').Goal} goal
   * @returns {import('../types.mjs').Goal} goal with capabilities filled
   */
  resolve(goal) {
    const allCaps = this.#registry.getByKind('capability');
    const scored = [];

    for (const cap of allCaps) {
      const score = this.#scoreCapability(cap, goal);
      if (score > 0) scored.push({ capability: cap, score });
    }

    // Sort by score descending, take top matches
    scored.sort((a, b) => b.score - a.score);

    // Take capabilities that have meaningful scores
    const resolved = scored
      .filter(s => s.score >= 2)
      .slice(0, 10)
      .map(s => s.capability.id);

    return { ...goal, capabilities: resolved };
  }

  /**
   * Resolve a goal to a specific workflow.
   * @param {import('../types.mjs').Goal} goal
   * @returns {Object|null} best matching workflow
   */
  resolveWorkflow(goal) {
    const workflows = this.#registry.getByKind('workflow');
    let best = null;
    let bestScore = 0;

    for (const wf of workflows) {
      const score = this.#scoreWorkflow(wf, goal);
      if (score > bestScore) { bestScore = score; best = wf; }
    }

    return best;
  }

  /**
   * Get the full execution chain for a capability.
   * @param {string} capabilityId
   * @returns {{ capability: Object, workflows: Object[], skills: Object[], agents: Object[], services: Object[] }}
   */
  getExecutionChain(capabilityId) {
    const cap = this.#registry.get(capabilityId);
    if (!cap) return null;

    // Find workflows related to this capability
    const workflows = this.#registry.getByKind('workflow')
      .filter(w => (w.related || []).includes(capabilityId));

    // Find skills related to this capability
    const skills = this.#registry.getByKind('skill')
      .filter(s => (s.related || []).includes(capabilityId) || s.domain === cap.domain);

    // Find agents that own this capability
    const agents = this.#registry.getByKind('agent')
      .filter(a => (a.metadata?.capabilities || []).includes(capabilityId));

    // Find services in this domain
    const services = this.#registry.getByKind('service')
      .filter(s => s.domain === cap.domain);

    return { capability: cap, workflows, skills, agents, services };
  }

  /**
   * Determine which agents should participate in a set of capabilities.
   * @param {string[]} capabilityIds
   * @returns {Map<string, string[]>} agentId -> capabilityIds they handle
   */
  assignAgents(capabilityIds) {
    const assignments = new Map();

    for (const capId of capabilityIds) {
      const agents = this.#registry.getByKind('agent')
        .filter(a => (a.metadata?.capabilities || []).includes(capId));

      if (agents.length > 0) {
        // Assign to the first capable agent (can be enhanced with load balancing)
        const agentId = agents[0].id;
        if (!assignments.has(agentId)) assignments.set(agentId, []);
        assignments.get(agentId).push(capId);
      }
    }

    return assignments;
  }

  // ─── Private ────────────────────────────────────

  #scoreCapability(cap, goal) {
    let score = 0;

    // Domain match
    const domainMap = {
      academics: ['D03'],
      knowledge: ['D05'],
      research: ['D04'],
      library: ['D06'],
      publications: ['D07'],
      media: ['D08'],
      community: ['D09'],
      engineering: ['D17'],
      analytics: ['D18'],
      governance: ['D01'],
      operations: ['D14'],
      finance: ['D11'],
    };

    const domainPrefixes = domainMap[goal.domain] || [];
    if (domainPrefixes.some(p => cap.id.startsWith(p))) score += 5;
    if (cap.domain === goal.domain) score += 3;

    // Name/description match with goal text
    const goalWords = goal.text.toLowerCase().split(/\s+/);
    const capText = `${cap.name} ${cap.description}`.toLowerCase();
    for (const word of goalWords) {
      if (word.length > 3 && capText.includes(word)) score += 1;
    }

    // Subject match
    if (goal.subject && capText.includes(goal.subject.replace('_', ' '))) score += 3;

    // Grade level match
    if (goal.gradeLevel && capText.includes(`grade ${goal.gradeLevel}`)) score += 2;

    // Intent alignment
    const intentCapMap = {
      create: ['D03-C01', 'D03-C02', 'D05-C01', 'D08-C01', 'D07-C01'],
      update: ['D03-C05', 'D05-C02'],
      publish: ['D07-C02', 'D08-C03', 'D14-C04'],
      analyze: ['D18-C01', 'D18-C02', 'D04-C01'],
      ingest: ['D05-C03', 'D06-C01'],
      validate: ['D03-C04', 'D13-C01'],
    };

    if (intentCapMap[goal.intent]?.includes(cap.id)) score += 4;

    // Implementation status bonus (prefer implemented capabilities)
    if (cap.implementation?.status === 'implemented') score += 1;
    if (cap.implementation?.status === 'partial') score += 0.5;

    return score;
  }

  #scoreWorkflow(wf, goal) {
    let score = 0;
    const wfText = `${wf.name} ${wf.description}`.toLowerCase();
    const goalWords = goal.text.toLowerCase().split(/\s+/);

    for (const word of goalWords) {
      if (word.length > 3 && wfText.includes(word)) score += 1;
    }

    if (wf.domain === goal.domain) score += 3;

    // Check if workflow's related capabilities match goal capabilities
    const relatedCaps = wf.related || [];
    for (const capId of goal.capabilities) {
      if (relatedCaps.includes(capId)) score += 5;
    }

    return score;
  }
}
