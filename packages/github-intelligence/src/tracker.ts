import type {
  GitHubTrending,
  GitHubRelease,
  GitHubDiscussion,
  BreakingChange,
  ArchitecturePattern,
  ReusableComponent,
} from "./types.js";

export class GitHubIntelligence {
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "BhavyaOS-OSIP/1.0",
    };
    if (this.token) h.Authorization = `Bearer ${this.token}`;
    return h;
  }

  async getTrending(
    period: "daily" | "weekly" | "monthly" = "daily",
    language?: string,
  ): Promise<GitHubTrending[]> {
    try {
      const since = new Date();
      if (period === "daily") since.setDate(since.getDate() - 1);
      else if (period === "weekly") since.setDate(since.getDate() - 7);
      else since.setMonth(since.getMonth() - 1);

      const q = `created:>${since.toISOString().split("T")[0]} stars:>50${language ? ` language:${language}` : ""}`;
      const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30`;
      const res = await fetch(url, { headers: this.headers() });
      if (!res.ok) return [];
      const data = (await res.json()) as {
        items: Array<{
          full_name: string;
          description: string;
          language: string;
          stargazers_count: number;
          html_url: string;
        }>;
      };

      return data.items.map((r) => ({
        repository: r.full_name,
        description: r.description || "",
        language: r.language || "",
        stars: r.stargazers_count,
        starsToday: 0,
        url: r.html_url,
        period,
        fetchedAt: new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }

  async getReleases(repo: string, limit = 10): Promise<GitHubRelease[]> {
    try {
      const url = `https://api.github.com/repos/${repo}/releases?per_page=${limit}`;
      const res = await fetch(url, { headers: this.headers() });
      if (!res.ok) return [];
      const data = (await res.json()) as Array<{
        tag_name: string;
        name: string;
        body: string;
        html_url: string;
        published_at: string;
        prerelease: boolean;
      }>;

      return data
        .filter((r) => !r.prerelease)
        .map((r) => ({
          repository: repo,
          tag: r.tag_name,
          name: r.name,
          body: r.body,
          url: r.html_url,
          publishedAt: r.published_at,
          prerelease: r.prerelease,
          breakingChanges: this.detectBreaking(r.body),
        }));
    } catch {
      return [];
    }
  }

  async getDiscussions(repo: string, limit = 20): Promise<GitHubDiscussion[]> {
    return [];
  }

  async detectBreakingChanges(
    releases: GitHubRelease[],
  ): Promise<BreakingChange[]> {
    return releases
      .filter((r) => r.breakingChanges.length > 0)
      .map((r) => ({
        repository: r.repository,
        version: r.tag,
        description: r.breakingChanges.join("; "),
        impact: "high" as const,
        migrationGuide: null,
        detectedAt: new Date().toISOString(),
      }));
  }

  async detectPatterns(_repo: string): Promise<ArchitecturePattern[]> {
    return [];
  }
  async detectReusableComponents(_repo: string): Promise<ReusableComponent[]> {
    return [];
  }

  private detectBreaking(body: string): string[] {
    const breaking: string[] = [];
    const patterns = [
      /breaking change/i,
      /BREAKING/i,
      /migration required/i,
      /incompatible/i,
    ];
    for (const line of body.split("\n")) {
      if (patterns.some((p) => p.test(line))) breaking.push(line.trim());
    }
    return breaking;
  }
}
