import type {
  Capability,
  CapabilityProvider,
  CapabilityType,
  CapabilityStatus,
  RegistryState,
  CapabilityRecommendation,
  RecommendationLevel,
} from "./types.js";
import { calculateBhavyaScore, autoEvaluate } from "./scoring.js";

// ─── Capability Registry ───────────────────────────────────────────────────
// Central registry for all discovered capabilities.
// File-based persistence at bhavya-ai-lab/intelligence/capabilities/

export class CapabilityRegistry {
  private capabilities = new Map<string, Capability>();
  private providers = new Map<CapabilityType, CapabilityProvider>();
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  // ─── Provider Management ────────────────────────────────────────────────

  registerProvider(provider: CapabilityProvider): void {
    this.providers.set(provider.type, provider);
  }

  getProvider(type: CapabilityType): CapabilityProvider | undefined {
    return this.providers.get(type);
  }

  // ─── Capability CRUD ────────────────────────────────────────────────────

  add(
    capability: Omit<
      Capability,
      "id" | "bhavyaScore" | "discoveredAt" | "updatedAt" | "versionHistory"
    >,
  ): Capability {
    const now = new Date().toISOString();
    const id = this.generateId(capability.name, capability.type);
    const scores = autoEvaluate(capability);
    const bhavyaScore = calculateBhavyaScore(scores);

    const full: Capability = {
      ...capability,
      id,
      scores,
      bhavyaScore,
      discoveredAt: now,
      updatedAt: now,
      versionHistory: [],
    };

    this.capabilities.set(id, full);
    return full;
  }

  update(id: string, updates: Partial<Capability>): Capability | null {
    const existing = this.capabilities.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate scores if relevant fields changed
    if (
      updates.stars !== undefined ||
      updates.lastCommit !== undefined ||
      updates.status !== undefined
    ) {
      updated.scores = autoEvaluate(updated);
      updated.bhavyaScore = calculateBhavyaScore(updated.scores);
    }

    this.capabilities.set(id, updated);
    return updated;
  }

  get(id: string): Capability | undefined {
    return this.capabilities.get(id);
  }

  findByName(name: string): Capability | undefined {
    for (const cap of this.capabilities.values()) {
      if (cap.name.toLowerCase() === name.toLowerCase()) return cap;
    }
    return undefined;
  }

  list(filters?: {
    type?: CapabilityType;
    status?: CapabilityStatus;
    minScore?: number;
  }): Capability[] {
    let results = Array.from(this.capabilities.values());

    if (filters?.type) {
      results = results.filter((c) => c.type === filters.type);
    }
    if (filters?.status) {
      results = results.filter((c) => c.status === filters.status);
    }
    if (filters?.minScore !== undefined) {
      results = results.filter((c) => c.bhavyaScore >= filters.minScore!);
    }

    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  // ─── Discovery ──────────────────────────────────────────────────────────

  async discoverFromProvider(type: CapabilityType): Promise<Capability[]> {
    const provider = this.providers.get(type);
    if (!provider) throw new Error(`No provider registered for type: ${type}`);

    const discovered = await provider.discover();
    const results: Capability[] = [];

    for (const partial of discovered) {
      const existing = this.findByName(partial.name || "");
      if (existing) {
        // Update existing
        this.update(existing.id, partial);
        results.push(this.capabilities.get(existing.id)!);
      } else {
        // Add new
        const cap = this.add({
          name: partial.name || "Unknown",
          type: partial.type || type,
          category: partial.category || "uncategorized",
          description: partial.description || "",
          repository: partial.repository || null,
          website: partial.website || null,
          documentation: partial.documentation || null,
          license: partial.license || null,
          language: partial.language || null,
          dependencies: partial.dependencies || [],
          systemRequirements: partial.systemRequirements || [],
          resourceUsage: partial.resourceUsage || "medium",
          offlineSupport: partial.offlineSupport ?? false,
          cloudSupport: partial.cloudSupport ?? true,
          apiRequired: partial.apiRequired ?? false,
          authentication: partial.authentication || "none",
          browserAutomationPossible: partial.browserAutomationPossible ?? false,
          cliAvailable: partial.cliAvailable ?? false,
          mcpAvailable: partial.mcpAvailable ?? false,
          dockerAvailable: partial.dockerAvailable ?? false,
          githubActionAvailable: partial.githubActionAvailable ?? false,
          platformSupport: partial.platformSupport || [
            "linux",
            "macos",
            "windows",
          ],
          status: partial.status || "active",
          version: partial.version || null,
          updateFrequency: partial.updateFrequency || null,
          maintainer: partial.maintainer || null,
          stars: partial.stars || 0,
          downloads: partial.downloads || 0,
          openIssues: partial.openIssues || 0,
          lastCommit: partial.lastCommit || null,
          scores: autoEvaluate(partial),
        });
        results.push(cap);
      }
    }

    return results;
  }

  // ─── Recommendation ─────────────────────────────────────────────────────

  recommend(capability: Capability): CapabilityRecommendation {
    const level = this.determineLevel(capability);
    const reasoning = this.generateReasoning(capability, level);

    return {
      capabilityId: capability.id,
      level,
      reasoning,
      useCases: this.suggestUseCases(capability),
      alternatives: [],
      integrationNotes: this.generateIntegrationNotes(capability),
      recommendedAt: new Date().toISOString(),
    };
  }

  // ─── State ──────────────────────────────────────────────────────────────

  getState(): RegistryState {
    const caps = Array.from(this.capabilities.values());
    return {
      capabilities: this.capabilities,
      lastUpdated: new Date().toISOString(),
      totalCount: caps.length,
      typeBreakdown: this.groupBy(caps, "type") as Record<
        CapabilityType,
        number
      >,
      statusBreakdown: this.groupBy(caps, "status") as Record<
        CapabilityStatus,
        number
      >,
    };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  private generateId(name: string, type: string): string {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${type}--${slug}`;
  }

  private determineLevel(cap: Capability): RecommendationLevel {
    if (cap.bhavyaScore >= 80) return "install_immediately";
    if (cap.bhavyaScore >= 65) return "pilot";
    if (cap.bhavyaScore >= 50) return "study";
    if (cap.bhavyaScore >= 35) return "reference";
    if (cap.bhavyaScore >= 20) return "monitor";
    return "archive";
  }

  private generateReasoning(
    cap: Capability,
    level: RecommendationLevel,
  ): string {
    const parts: string[] = [];

    if (cap.mcpAvailable)
      parts.push("MCP server available — API-free integration possible");
    if (cap.cliAvailable)
      parts.push("CLI tool available — easy to wrap as provider");
    if (cap.offlineSupport) parts.push("Supports offline operation");
    if (cap.stars > 1000)
      parts.push(
        `${cap.stars.toLocaleString()} GitHub stars — strong community`,
      );
    if (cap.lastCommit) {
      const days =
        (Date.now() - new Date(cap.lastCommit).getTime()) /
        (1000 * 60 * 60 * 24);
      if (days < 30) parts.push("Actively maintained (updated within 30 days)");
    }

    return `${level.toUpperCase()}: ${parts.join("; ") || "Score-based recommendation"}`;
  }

  private suggestUseCases(cap: Capability): string[] {
    const useCases: string[] = [];
    if (cap.type === "mcp_server")
      useCases.push("Direct integration with Bhavya OS agents");
    if (cap.type === "cli_tool")
      useCases.push("Wrap as provider for automation");
    if (cap.type === "browser_automation")
      useCases.push("Web scraping, testing, UI automation");
    if (cap.type === "github_action")
      useCases.push("CI/CD pipeline automation");
    if (cap.type === "node_package" || cap.type === "python_package")
      useCases.push("Library integration");
    return useCases;
  }

  private generateIntegrationNotes(cap: Capability): string {
    if (cap.mcpAvailable) return `Install via MCP: ${cap.name}`;
    if (cap.cliAvailable) return `Wrap CLI: ${cap.name}`;
    if (cap.dockerAvailable) return `Run via Docker: ${cap.name}`;
    return `Manual integration: ${cap.repository || cap.website || "N/A"}`;
  }

  private groupBy(
    items: Capability[],
    key: keyof Capability,
  ): Record<string, number> {
    const result: Record<string, number> = {};
    for (const item of items) {
      const val = String(item[key]);
      result[val] = (result[val] || 0) + 1;
    }
    return result;
  }
}
