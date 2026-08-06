/**
 * Bhavya OS — Registry Module
 * Agent and tool registry.
 */

export class Registry {
  constructor() {
    this.agents = new Map();
    this.tools = new Map();
  }

  registerAgent(agent) {
    this.agents.set(agent.id, {
      ...agent,
      registeredAt: new Date().toISOString(),
      status: "idle",
    });
    return agent;
  }

  registerTool(tool) {
    this.tools.set(tool.id, {
      ...tool,
      registeredAt: new Date().toISOString(),
    });
    return tool;
  }

  getAgent(agentId) {
    return this.agents.get(agentId);
  }

  getTool(toolId) {
    return this.tools.get(toolId);
  }

  listAgents(filter) {
    const agents = [...this.agents.values()];
    if (!filter) return agents;
    return agents.filter(filter);
  }

  listTools(filter) {
    const tools = [...this.tools.values()];
    if (!filter) return tools;
    return tools.filter(filter);
  }

  updateAgentStatus(agentId, status) {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);
    agent.status = status;
    agent.lastUpdated = new Date().toISOString();
    return agent;
  }
}
