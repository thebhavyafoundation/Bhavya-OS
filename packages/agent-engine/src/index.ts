// Agent Engine
// Loads .ai/agents/, creates Agent, manages Capabilities, Permissions, Lifecycle

import type {
  Agent,
  AgentId,
  Capability,
  Permission,
  AgentStatus,
} from "@bhavya/shared";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface AgentEngineConfig {
  root: string;
}

export class AgentEngine {
  private config: AgentEngineConfig;
  private agents = new Map<AgentId, Agent>();

  constructor(config: AgentEngineConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const agentsDir = resolve(this.config.root, ".ai/agents");
    if (!existsSync(agentsDir)) return;

    const files = readdirSync(agentsDir).filter(
      (f) => f.endsWith(".md") || f.endsWith(".json"),
    );
    for (const file of files) {
      const agent = await this.loadAgent(`${agentsDir}/${file}`);
      if (agent) this.agents.set(agent.id, agent);
    }
  }

  private async loadAgent(path: string): Promise<Agent | null> {
    try {
      const content = readFileSync(path, "utf-8");
      const name =
        path
          .split("/")
          .pop()
          ?.replace(/\.[^.]+$/, "") ?? "unknown";

      return {
        id: `agent:${name}`,
        name,
        role: this.inferRole(name),
        description: content.slice(0, 200),
        capabilities: [],
        permissions: [],
        status: "idle",
        metadata: {},
      };
    } catch {
      return null;
    }
  }

  private inferRole(name: string): string {
    const roles: Record<string, string> = {
      founder: "founder",
      ceo: "ceo",
      cto: "cto",
      designer: "designer",
      developer: "developer",
      reviewer: "reviewer",
      researcher: "researcher",
      writer: "writer",
      seo: "seo",
      translator: "translator",
      historian: "historian",
      legal: "legal",
      volunteer: "volunteer",
      donation: "donation",
      socialmedia: "social-media",
      qa: "qa",
      release: "release",
      security: "security",
    };
    return roles[name.toLowerCase()] ?? "unknown";
  }

  async get(id: AgentId): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAll(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getByRole(role: string): Promise<Agent[]> {
    return Array.from(this.agents.values()).filter((a) => a.role === role);
  }

  async updateStatus(id: AgentId, status: AgentStatus): Promise<void> {
    const agent = this.agents.get(id);
    if (agent) agent.status = status;
  }

  async shutdown(): Promise<void> {
    this.agents.clear();
  }
}
