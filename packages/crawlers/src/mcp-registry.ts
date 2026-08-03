import { BaseCrawler } from "./base.js";
import type { Source, RawItem, FetchOpts } from "@bhavya/intelligence";

// ─── MCP Registry Crawler ──────────────────────────────────────────────────
// Monitors official MCP Registry, popular servers, new additions.

interface MCPServer {
  name: string;
  description: string;
  url: string;
  github?: string;
  npm?: string;
  version: string;
  stars?: number;
  lastUpdated: string;
  tags: string[];
}

export class MCPRegistryCrawler extends BaseCrawler {
  readonly kind = "mcp_registry" as const;

  async fetch(opts: FetchOpts): Promise<RawItem[]> {
    const { source, limit = 50 } = opts;
    const config = source.config as MCPConfig;
    const items: RawItem[] = [];

    // Fetch from official MCP registry
    if (config.monitor?.includes("registry")) {
      const registry = await this.fetchRegistry(source, limit);
      items.push(...registry);
    }

    // Fetch popular MCP servers from GitHub
    if (config.monitor?.includes("popular")) {
      const popular = await this.fetchPopular(source, limit);
      items.push(...popular);
    }

    // Fetch new MCP servers
    if (config.monitor?.includes("new")) {
      const newServers = await this.fetchNew(source, limit);
      items.push(...newServers);
    }

    return items;
  }

  normalize(item: RawItem): RawItem {
    return {
      ...item,
      data: {
        ...item.data,
        normalizedType: "mcp_server",
      },
    };
  }

  private async fetchRegistry(
    source: Source,
    limit: number,
  ): Promise<RawItem[]> {
    try {
      // Fetch from the official MCP servers list
      const url =
        "https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md";
      const response = await fetch(url, {
        headers: { "User-Agent": "BhavyaOS-OSIP/1.0" },
      });
      const text = await response.text();

      // Parse MCP servers from the README
      const servers = this.parseMCPReadme(text);
      return servers.slice(0, limit).map((server) => ({
        sourceId: source.id,
        sourceKind: "mcp_registry" as const,
        externalId: server.name,
        data: {
          type: "mcp_server",
          ...server,
        },
        fetchedAt: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  private async fetchPopular(
    source: Source,
    limit: number,
  ): Promise<RawItem[]> {
    try {
      const url = `https://api.github.com/search/repositories?q=mcp+server+model+context+protocol&sort=stars&order=desc&per_page=${limit}`;
      const headers = this.getHeaders(source);
      const data = await this.fetchJson<{
        items: Array<{
          full_name: string;
          description: string;
          html_url: string;
          stargazers_count: number;
          topics: string[];
        }>;
      }>(url, headers);

      return data.items.map((repo) => ({
        sourceId: source.id,
        sourceKind: "mcp_registry" as const,
        externalId: repo.full_name,
        data: {
          type: "mcp_server",
          name: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          tags: repo.topics,
          source: "github_search",
        },
        fetchedAt: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  private async fetchNew(source: Source, limit: number): Promise<RawItem[]> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      const since = date.toISOString().split("T")[0];

      const url = `https://api.github.com/search/repositories?q=mcp+server+created:>${since}&sort=stars&order=desc&per_page=${limit}`;
      const headers = this.getHeaders(source);
      const data = await this.fetchJson<{
        items: Array<{
          full_name: string;
          description: string;
          html_url: string;
          stargazers_count: number;
          created_at: string;
        }>;
      }>(url, headers);

      return data.items.map((repo) => ({
        sourceId: source.id,
        sourceKind: "mcp_registry" as const,
        externalId: repo.full_name,
        data: {
          type: "mcp_server",
          name: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          stars: repo.stargazers_count,
          createdAt: repo.created_at,
          source: "new_repos",
        },
        fetchedAt: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  private parseMCPReadme(text: string): MCPServer[] {
    const servers: MCPServer[] = [];
    const lines = text.split("\n");

    for (const line of lines) {
      // Match lines like: - [Name](url) - Description
      const match = line.match(/- \[([^\]]+)\]\(([^)]+)\)\s*[-–]\s*(.+)/);
      if (match) {
        servers.push({
          name: match[1],
          description: match[3].trim(),
          url: match[2],
          version: "latest",
          tags: [],
          lastUpdated: new Date().toISOString(),
        });
      }
    }

    return servers;
  }

  private getHeaders(source: Source): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (source.apiKey) {
      headers.Authorization = `Bearer ${source.apiKey}`;
    }
    return headers;
  }
}

interface MCPConfig {
  monitor?: string[];
}
