import type { MCPServer, MCPAnalysis } from "./types.js";

export class MCPRegistry {
  private servers = new Map<string, MCPServer>();

  add(server: MCPServer): void {
    this.servers.set(server.name, server);
  }

  get(name: string): MCPServer | undefined {
    return this.servers.get(name);
  }

  list(filters?: {
    status?: string;
    language?: string;
    minScore?: number;
  }): MCPServer[] {
    let results = Array.from(this.servers.values());
    if (filters?.status)
      results = results.filter((s) => s.status === filters.status);
    if (filters?.language)
      results = results.filter((s) => s.language === filters.language);
    if (filters?.minScore !== undefined)
      results = results.filter((s) => s.bhavyaScore >= filters.minScore!);
    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  analyze(server: MCPServer): MCPAnalysis {
    return {
      server,
      summary: `${server.name} — ${server.description}`,
      installationGuide: this.generateInstallGuide(server),
      supportedTools: server.tools.map((t) => t.name),
      capabilities: [
        ...server.tools.map((t) => t.name),
        ...server.resources.map((r) => r.name),
      ],
      useCases: this.suggestUseCases(server),
      bhavyaIntegrationNotes: this.generateIntegrationNotes(server),
      limitations: this.identifyLimitations(server),
      alternatives: server.alternatives,
      securityNotes: server.securityNotes,
    };
  }

  private generateInstallGuide(server: MCPServer): string {
    const method = server.installMethods[0];
    if (!method) return "No install method available";
    return `${method.command} ${method.args?.join(" ") || ""}`.trim();
  }

  private suggestUseCases(server: MCPServer): string[] {
    const useCases: string[] = [];
    if (server.tools.length > 0)
      useCases.push(
        `Provides ${server.tools.length} tools: ${server.tools.map((t) => t.name).join(", ")}`,
      );
    if (server.resources.length > 0)
      useCases.push(`Provides ${server.resources.length} resources`);
    if (server.prompts.length > 0)
      useCases.push(`Provides ${server.prompts.length} prompt templates`);
    return useCases;
  }

  private generateIntegrationNotes(server: MCPServer): string {
    const clients = server.supportedClients.join(", ");
    return `Works with: ${clients}. Transport: ${server.transport}`;
  }

  private identifyLimitations(server: MCPServer): string[] {
    const limitations: string[] = [];
    if (server.transport === "sse")
      limitations.push("SSE transport — not all clients support it");
    if (server.status === "experimental")
      limitations.push("Experimental — API may change");
    if (server.stars < 100)
      limitations.push("Small community — limited support");
    return limitations;
  }
}
