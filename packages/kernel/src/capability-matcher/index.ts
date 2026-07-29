// Capability Matcher
// Pairs agents to tasks based on skills, availability, and performance.

export interface MatchingRequest {
  id: string;
  requiredCapabilities: string[];
  preferredAgent?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline?: Date;
  metadata: Record<string, unknown>;
}

export interface MatchingResult {
  request: MatchingRequest;
  bestMatch: AgentMatch | null;
  alternatives: AgentMatch[];
  score: number; // 0-1 overall match quality
}

export interface AgentMatch {
  agentId: string;
  name: string;
  capabilityScore: number; // how many required capabilities they have
  availabilityScore: number; // 0-1 based on current workload
  performanceScore: number; // historical performance
  overallScore: number; // weighted combination
  matchedCapabilities: string[];
  missingCapabilities: string[];
}

export interface MatchingConfig {
  agents: {
    getAll: () => {
      id: string;
      name: string;
      capabilities: string[];
      availability: 'available' | 'busy' | 'offline';
      currentWorkload: number;
      maxWorkload: number;
      performance: number;
    }[];
  };
  weights?: {
    capability: number;
    availability: number;
    performance: number;
  };
}

export class CapabilityMatcher {
  private config: MatchingConfig;

  constructor(config: MatchingConfig) {
    this.config = {
      ...config,
      weights: config.weights ?? { capability: 0.5, availability: 0.3, performance: 0.2 },
    };
  }

  async initialize(): Promise<void> {
    // Ready
  }

  // Find best match for a request
  async match(request: MatchingRequest): Promise<MatchingResult> {
    const agents = this.config.agents.getAll();
    const matches: AgentMatch[] = [];

    for (const agent of agents) {
      if (agent.availability === 'offline') continue;

      const matchedCapabilities = request.requiredCapabilities.filter(
        (cap) => agent.capabilities.includes(cap),
      );
      const missingCapabilities = request.requiredCapabilities.filter(
        (cap) => !agent.capabilities.includes(cap),
      );

      const capabilityScore = matchedCapabilities.length / request.requiredCapabilities.length;
      const availabilityScore = 1 - (agent.currentWorkload / agent.maxWorkload);
      const performanceScore = agent.performance;

      const overallScore =
        capabilityScore * this.config.weights!.capability +
        availabilityScore * this.config.weights!.availability +
        performanceScore * this.config.weights!.performance;

      matches.push({
        agentId: agent.id,
        name: agent.name,
        capabilityScore,
        availabilityScore,
        performanceScore,
        overallScore,
        matchedCapabilities,
        missingCapabilities,
      });
    }

    // Sort by overall score
    matches.sort((a, b) => b.overallScore - a.overallScore);

    const bestMatch = matches[0] ?? null;
    const alternatives = matches.slice(1, 4);
    const score = bestMatch?.overallScore ?? 0;

    return { request, bestMatch, alternatives, score };
  }

  // Batch match multiple requests
  async matchBatch(requests: MatchingRequest[]): Promise<MatchingResult[]> {
    return Promise.all(requests.map((r) => this.match(r)));
  }

  // Get agent utilization
  getUtilization(): Array<{ agentId: string; utilization: number; capabilities: string[] }> {
    const agents = this.config.agents.getAll();
    return agents.map((a) => ({
      agentId: a.id,
      utilization: a.currentWorkload / a.maxWorkload,
      capabilities: a.capabilities,
    }));
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
