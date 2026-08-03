import { BaseCrawler } from "./base.js";
import type { Source, RawItem, FetchOpts } from "@bhavya/intelligence";

// ─── GitHub Crawler ────────────────────────────────────────────────────────
// Monitors trending repos, releases, discussions, topics, organizations.

interface GitHubRepo {
  id: number;
  full_name: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license?: { spdx_id: string };
  owner: { login: string; type: string };
  archived: boolean;
}

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
}

export class GitHubCrawler extends BaseCrawler {
  readonly kind = "github" as const;

  async fetch(opts: FetchOpts): Promise<RawItem[]> {
    const { source, since, limit = 30 } = opts;
    const config = source.config as GitHubConfig;
    const items: RawItem[] = [];

    // Fetch trending repos
    if (config.monitor?.includes("trending")) {
      const trending = await this.fetchTrending(source, limit);
      items.push(...trending);
    }

    // Fetch organization repos
    if (config.monitor?.includes("organization") && config.organizations) {
      for (const org of config.organizations) {
        const repos = await this.fetchOrganizationRepos(source, org, limit);
        items.push(...repos);
      }
    }

    // Fetch releases
    if (config.monitor?.includes("releases") && config.repositories) {
      for (const repo of config.repositories) {
        const releases = await this.fetchReleases(source, repo, since);
        items.push(...releases);
      }
    }

    // Fetch by topics
    if (config.monitor?.includes("topics") && config.topics) {
      for (const topic of config.topics) {
        const topicRepos = await this.fetchByTopic(source, topic, limit);
        items.push(...topicRepos);
      }
    }

    return items;
  }

  normalize(item: RawItem): RawItem {
    return {
      ...item,
      data: {
        ...item.data,
        normalizedType: item.data.type || "repository",
      },
    };
  }

  private async fetchTrending(
    source: Source,
    limit: number,
  ): Promise<RawItem[]> {
    try {
      // GitHub doesn't have an official trending API, so we use search
      const date = new Date();
      date.setDate(date.getDate() - 7);
      const since = date.toISOString().split("T")[0];

      const url = `https://api.github.com/search/repositories?q=created:>${since}+stars:>100&sort=stars&order=desc&per_page=${limit}`;
      const headers = this.getHeaders(source);
      const data = await this.fetchJson<{ items: GitHubRepo[] }>(url, headers);

      return data.items.map((repo) => this.repoToRawItem(source, repo));
    } catch {
      return [];
    }
  }

  private async fetchOrganizationRepos(
    source: Source,
    org: string,
    limit: number,
  ): Promise<RawItem[]> {
    try {
      const url = `https://api.github.com/orgs/${org}/repos?sort=updated&per_page=${limit}`;
      const headers = this.getHeaders(source);
      const repos = await this.fetchJson<GitHubRepo[]>(url, headers);
      return repos.map((repo) => this.repoToRawItem(source, repo));
    } catch {
      return [];
    }
  }

  private async fetchReleases(
    source: Source,
    repo: string,
    since?: string,
  ): Promise<RawItem[]> {
    try {
      const url = `https://api.github.com/repos/${repo}/releases?per_page=10`;
      const headers = this.getHeaders(source);
      const releases = await this.fetchJson<GitHubRelease[]>(url, headers);

      return releases
        .filter((r) => !r.draft && (!since || r.published_at > since))
        .map((release) => ({
          sourceId: source.id,
          sourceKind: "github" as const,
          externalId: `${repo}/release/${release.id}`,
          data: {
            type: "release",
            repo,
            tag: release.tag_name,
            name: release.name,
            body: release.body,
            url: release.html_url,
            publishedAt: release.published_at,
            prerelease: release.prerelease,
          },
          fetchedAt: new Date().toISOString(),
        }));
    } catch {
      return [];
    }
  }

  private async fetchByTopic(
    source: Source,
    topic: string,
    limit: number,
  ): Promise<RawItem[]> {
    try {
      const url = `https://api.github.com/search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=${limit}`;
      const headers = this.getHeaders(source);
      const data = await this.fetchJson<{ items: GitHubRepo[] }>(url, headers);
      return data.items.map((repo) => this.repoToRawItem(source, repo));
    } catch {
      return [];
    }
  }

  private repoToRawItem(source: Source, repo: GitHubRepo): RawItem {
    return {
      sourceId: source.id,
      sourceKind: "github",
      externalId: repo.full_name,
      data: {
        type: "repository",
        name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        language: repo.language,
        topics: repo.topics,
        license: repo.license?.spdx_id,
        owner: repo.owner.login,
        ownerType: repo.owner.type,
        archived: repo.archived,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
      },
      fetchedAt: new Date().toISOString(),
    };
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

interface GitHubConfig {
  monitor?: string[];
  organizations?: string[];
  repositories?: string[];
  topics?: string[];
}
