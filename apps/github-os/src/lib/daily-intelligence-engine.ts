// ─── Daily Intelligence Engine ─────────────────────────────────────────────
// Core orchestrator for the Daily Intelligence Loop (DIL-03 through DIL-10)
// Handles: discovery → ranking → dedup → inspection → extraction → evaluation → briefing

import { getDb } from "./db";
import type {
  DailyRun,
  DailyRunConfig,
  DailyRunStatus,
  DiscoveryCandidate,
  DiscoveryCategory,
  DailyObservation,
  ChangeSignificance,
  IntelligenceFinding,
  FindingType,
  FindingCategory,
  ConfidenceLevel,
  VerificationState,
  QualityLevel,
  RelevanceLevel,
  ExperimentCandidate,
  ExperimentDifficulty,
  ExperimentRisk,
  DailyBriefing,
  BriefingItem,
  RankingDimension,
  RankingResult,
  EngineeringPractice,
  ArchitectureLesson,
  AITechnique,
  DesignPrinciple,
  VisualInsight,
  LearningLesson,
  LicenseGate,
  SecurityGate,
  Provenance,
  Trend,
  IntelligenceSearchQuery,
} from "./daily-intelligence-types";
import { DEFAULT_DAILY_RUN_CONFIG } from "./daily-intelligence-types";

// ─── Rate Limiting ─────────────────────────────────────────────────────────

class RateLimiter {
  private calls = 0;
  private maxCalls: number;
  private windowMs: number;
  private lastReset: number;

  constructor(maxCalls: number, windowMs: number) {
    this.maxCalls = maxCalls;
    this.windowMs = windowMs;
    this.lastReset = Date.now();
  }

  async waitIfNeeded(): Promise<void> {
    this.calls++;
    if (this.calls >= this.maxCalls) {
      const elapsed = Date.now() - this.lastReset;
      if (elapsed < this.windowMs) {
        const waitMs = this.windowMs - elapsed + 1000;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
      this.calls = 0;
      this.lastReset = Date.now();
    }
  }

  getCount(): number {
    return this.calls;
  }
}

// ─── GitHub API Client (lightweight, reuse existing patterns) ──────────────

class DailyGitHubClient {
  private token: string | null;
  private rateLimiter: RateLimiter;

  constructor(token: string | null) {
    this.token = token;
    this.rateLimiter = new RateLimiter(8, 60000); // 8 req/min unauthenticated
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "BhavyaFoundation/DailyIntelligenceLoop/1.0",
    };
    if (this.token) h.Authorization = `Bearer ${this.token}`;
    return h;
  }

  async searchRepos(
    query: string,
    perPage = 30,
  ): Promise<{ items: unknown[]; total: number }> {
    await this.rateLimiter.waitIfNeeded();
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&per_page=${perPage}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) throw new Error(`Search failed: ${res.status}`);
    const data = (await res.json()) as {
      items?: unknown[];
      total_count?: number;
    };
    return { items: data.items ?? [], total: data.total_count ?? 0 };
  }

  async getRepo(
    owner: string,
    name: string,
  ): Promise<Record<string, unknown> | null> {
    await this.rateLimiter.waitIfNeeded();
    const url = `https://api.github.com/repos/${owner}/${name}`;
    const res = await fetch(url, { headers: this.headers() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Get repo failed: ${res.status}`);
    return (await res.json()) as Record<string, unknown>;
  }

  async getReadme(owner: string, name: string): Promise<string | null> {
    await this.rateLimiter.waitIfNeeded();
    const url = `https://api.github.com/repos/${owner}/${name}/readme`;
    const res = await fetch(url, {
      headers: { ...this.headers(), Accept: "application/vnd.github.v3.raw" },
    });
    if (!res.ok) return null;
    return await res.text();
  }

  async getTraffic(
    owner: string,
    name: string,
  ): Promise<{ views: number; unique: number } | null> {
    // Requires auth; return null if not available
    if (!this.token) return null;
    try {
      await this.rateLimiter.waitIfNeeded();
      const url = `https://api.github.com/repos/${owner}/${name}/traffic/views`;
      const res = await fetch(url, { headers: this.headers() });
      if (!res.ok) return null;
      const data = (await res.json()) as { count?: number; uniques?: number };
      return { views: data.count ?? 0, unique: data.uniques ?? 0 };
    } catch {
      return null;
    }
  }

  async getRecentCommits(
    owner: string,
    name: string,
    since?: string,
  ): Promise<unknown[]> {
    await this.rateLimiter.waitIfNeeded();
    let url = `https://api.github.com/repos/${owner}/${name}/commits?per_page=30`;
    if (since) url += `&since=${since}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) return [];
    return (await res.json()) as unknown[];
  }

  async getContributors(owner: string, name: string): Promise<unknown[]> {
    await this.rateLimiter.waitIfNeeded();
    const url = `https://api.github.com/repos/${owner}/${name}/contributors?per_page=20`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) return [];
    return (await res.json()) as unknown[];
  }

  getApiCalls(): number {
    return this.rateLimiter.getCount();
  }
}

// ─── DIL-03: Daily Discovery Engine ────────────────────────────────────────

export class DailyDiscoveryEngine {
  private client: DailyGitHubClient;
  private db: ReturnType<typeof getDb>;

  constructor(client: DailyGitHubClient, db: ReturnType<typeof getDb>) {
    this.client = client;
    this.db = db;
  }

  /**
   * Discover candidates using multiple signals:
   * 1. Star momentum — repos with recent star growth
   * 2. Recent releases — repos with new releases
   * 3. Community activity — repos with high commit frequency
   * 4. Topic relevance — repos matching Bhavya categories
   * 5. Language ecosystem — repos in target languages
   * 6. Trending — repos trending on GitHub
   */
  async discover(
    runId: string,
    categories: DiscoveryCategory[],
    config: DailyRunConfig,
  ): Promise<DiscoveryCandidate[]> {
    const candidates: DiscoveryCandidate[] = [];
    const seen = new Set<string>();

    // Signal 1: Topic-based discovery per category
    for (const category of categories) {
      if (!category.active) continue;
      for (const query of category.search_queries) {
        try {
          const { items } = await this.client.searchRepos(query, 30);
          for (const item of items) {
            const r = item as Record<string, unknown>;
            const fullName = r.full_name as string;
            if (seen.has(fullName)) continue;
            seen.add(fullName);

            const candidate = this.parseSearchResult(
              r,
              runId,
              "topic_search",
              query,
            );
            if (candidate && this.passesBasicFilters(candidate, config)) {
              candidates.push(candidate);
            }
          }
        } catch (e) {
          // Rate limit or error — continue
        }
        if (candidates.length >= config.max_candidates) break;
      }
      if (candidates.length >= config.max_candidates) break;
    }

    // Signal 2: Star momentum — recently updated repos with high stars
    if (candidates.length < config.max_candidates) {
      try {
        const { items } = await this.client.searchRepos(
          `stars:${config.min_stars}..${config.min_stars * 100} pushed:>2025-01-01`,
          30,
        );
        for (const item of items) {
          const r = item as Record<string, unknown>;
          const fullName = r.full_name as string;
          if (seen.has(fullName)) continue;
          seen.add(fullName);

          const candidate = this.parseSearchResult(
            r,
            runId,
            "star_momentum",
            "star_momentum",
          );
          if (candidate && this.passesBasicFilters(candidate, config)) {
            candidates.push(candidate);
          }
        }
      } catch {
        /* continue */
      }
    }

    // Signal 3: Recent releases
    if (candidates.length < config.max_candidates) {
      try {
        const { items } = await this.client.searchRepos(
          `pushed:>2025-06-01 stars:>50`,
          30,
        );
        for (const item of items) {
          const r = item as Record<string, unknown>;
          const fullName = r.full_name as string;
          if (seen.has(fullName)) continue;
          seen.add(fullName);

          const candidate = this.parseSearchResult(
            r,
            runId,
            "recent_activity",
            "recent_activity",
          );
          if (candidate && this.passesBasicFilters(candidate, config)) {
            candidates.push(candidate);
          }
        }
      } catch {
        /* continue */
      }
    }

    return candidates;
  }

  private parseSearchResult(
    r: Record<string, unknown>,
    runId: string,
    source: string,
    query: string,
  ): DiscoveryCandidate | null {
    try {
      const owner =
        ((r.owner as Record<string, unknown>)?.login as string) ?? "";
      const name = (r.name as string) ?? "";
      if (!owner || !name) return null;

      return {
        id: `candidate_${owner}_${name}_${Date.now()}`,
        run_id: runId,
        repository_id: null,
        full_name: `${owner}/${name}`,
        owner,
        name,
        description: (r.description as string) ?? null,
        url: (r.html_url as string) ?? null,
        language: (r.language as string) ?? null,
        stars: (r.stargazers_count as number) ?? 0,
        forks: (r.forks_count as number) ?? 0,
        topics: (r.topics as string[]) ?? [],
        license:
          ((r.license as Record<string, unknown>)?.spdx_id as string) ?? null,
        created_at_repo: (r.created_at as string) ?? "",
        updated_at: (r.updated_at as string) ?? "",
        pushed_at: (r.pushed_at as string) ?? "",
        archived: (r.archived as boolean) ? 1 : 0,
        open_issues: (r.open_issues_count as number) ?? 0,
        discovery_source: source,
        discovery_query: query,
        discovery_signal: JSON.stringify({ source, query }),
        rank_score: 0,
        rank_explanation: "{}",
        filtered: 0,
        filter_reason: null,
        inspected: 0,
      };
    } catch {
      return null;
    }
  }

  private passesBasicFilters(
    candidate: DiscoveryCandidate,
    config: DailyRunConfig,
  ): boolean {
    if (candidate.archived) {
      candidate.filtered = 1;
      candidate.filter_reason = "archived";
      return false;
    }
    if (candidate.stars < config.min_stars) {
      candidate.filtered = 1;
      candidate.filter_reason = "below_min_stars";
      return false;
    }
    if (
      config.languages.length > 0 &&
      candidate.language &&
      !config.languages.includes(candidate.language)
    ) {
      candidate.filtered = 1;
      candidate.filter_reason = "language_not_in_scope";
      return false;
    }
    return true;
  }

  persistCandidates(candidates: DiscoveryCandidate[]): void {
    const db = this.db;
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO discovery_candidates
      (id, run_id, repository_id, full_name, owner, name, description, url,
       language, stars, forks, topics, license, created_at_repo, updated_at,
       pushed_at, archived, open_issues, discovery_source, discovery_query,
       discovery_signal, rank_score, rank_explanation, filtered, filter_reason, inspected)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((items: DiscoveryCandidate[]) => {
      for (const c of items) {
        stmt.run(
          c.id,
          c.run_id,
          c.repository_id,
          c.full_name,
          c.owner,
          c.name,
          c.description,
          c.url,
          c.language,
          c.stars,
          c.forks,
          JSON.stringify(c.topics),
          c.license,
          c.created_at_repo,
          c.updated_at,
          c.pushed_at,
          c.archived,
          c.open_issues,
          c.discovery_source,
          c.discovery_query,
          c.discovery_signal,
          c.rank_score,
          c.rank_explanation,
          c.filtered,
          c.filter_reason,
          c.inspected,
        );
      }
    });
    insertMany(candidates);
  }
}

// ─── DIL-04: Discovery Ranking ─────────────────────────────────────────────

export class DiscoveryRanker {
  /**
   * Rank candidates using explainable multi-dimensional scoring.
   * Dimensions: star_count, star_momentum, community_health, topic_relevance, recency, language_fit
   */
  rank(
    candidates: DiscoveryCandidate[],
    config: DailyRunConfig,
  ): RankingResult[] {
    return candidates
      .filter((c) => !c.filtered)
      .map((c) => this.rankOne(c, config))
      .sort((a, b) => b.total_score - a.total_score);
  }

  private rankOne(
    candidate: DiscoveryCandidate,
    config: DailyRunConfig,
  ): RankingResult {
    const dimensions: RankingDimension[] = [];

    // Star count score (0-1, logarithmic)
    const starScore = Math.min(1, Math.log10(Math.max(1, candidate.stars)) / 5);
    dimensions.push({
      name: "star_count",
      score: starScore,
      weight: 0.25,
      explanation: `${candidate.stars} stars (log-scaled)`,
    });

    // Star momentum — how recently updated
    const daysSinceUpdate = candidate.pushed_at
      ? (Date.now() - new Date(candidate.pushed_at).getTime()) /
        (1000 * 60 * 60 * 24)
      : 999;
    const momentumScore = Math.max(0, 1 - daysSinceUpdate / 90);
    dimensions.push({
      name: "star_momentum",
      score: momentumScore,
      weight: 0.2,
      explanation: `Updated ${Math.round(daysSinceUpdate)} days ago`,
    });

    // Community health — issue activity, contributor count
    const communityScore = Math.min(
      1,
      (candidate.open_issues / 100) * 0.5 +
        (candidate.forks / candidate.stars) * 0.5,
    );
    dimensions.push({
      name: "community_health",
      score: communityScore,
      weight: 0.15,
      explanation: `${candidate.forks} forks, ${candidate.open_issues} issues`,
    });

    // Topic relevance
    const topicMatch = candidate.topics.some((t) =>
      config.categories.some((cat) => t.includes(cat.toLowerCase())),
    );
    dimensions.push({
      name: "topic_relevance",
      score: topicMatch ? 0.8 : 0.3,
      weight: 0.2,
      explanation: topicMatch
        ? "Topics match Bhavya categories"
        : "No direct topic match",
    });

    // Recency
    const daysSinceCreate = candidate.created_at_repo
      ? (Date.now() - new Date(candidate.created_at_repo).getTime()) /
        (1000 * 60 * 60 * 24)
      : 999;
    const recencyScore = Math.min(1, daysSinceCreate / 365);
    dimensions.push({
      name: "recency",
      score: recencyScore,
      weight: 0.1,
      explanation: `Created ${Math.round(daysSinceCreate)} days ago`,
    });

    // Language fit
    const languageFit =
      candidate.language && config.languages.includes(candidate.language)
        ? 1
        : 0.5;
    dimensions.push({
      name: "language_fit",
      score: languageFit,
      weight: 0.1,
      explanation: candidate.language
        ? `Primary language: ${candidate.language}`
        : "No language detected",
    });

    const totalScore = dimensions.reduce(
      (sum, d) => sum + d.score * d.weight,
      0,
    );
    const recommendation =
      totalScore > 0.6
        ? "prioritize"
        : totalScore > 0.4
          ? "include"
          : "consider";

    return {
      total_score: Math.round(totalScore * 1000) / 1000,
      dimensions,
      recommendation,
    };
  }

  persistRankings(
    candidates: DiscoveryCandidate[],
    rankings: RankingResult[],
  ): void {
    const db = getDb();
    const stmt = db.prepare(`
      UPDATE discovery_candidates SET rank_score = ?, rank_explanation = ? WHERE id = ?
    `);
    const sorted = candidates.filter((c) => !c.filtered);
    const updateMany = db.transaction(
      (items: [DiscoveryCandidate, RankingResult][]) => {
        for (const [c, r] of items) {
          stmt.run(r.total_score, JSON.stringify(r.dimensions), c.id);
        }
      },
    );
    updateMany(sorted.map((c, i) => [c, rankings[i]]));
  }
}

// ─── DIL-05: Discovery Deduplication ───────────────────────────────────────

export class Deduplicator {
  /**
   * Deduplicate candidates across daily runs using full_name as primary key.
   * Returns only genuinely new candidates.
   */
  deduplicateNew(candidates: DiscoveryCandidate[]): DiscoveryCandidate[] {
    const db = getDb();
    const seen = new Set<string>();

    // Load existing candidate names from DB
    const existing = db
      .prepare(`SELECT DISTINCT full_name FROM discovery_candidates`)
      .all() as { full_name: string }[];
    for (const row of existing) {
      seen.add(row.full_name);
    }

    // Also deduplicate within this batch
    const newCandidates: DiscoveryCandidate[] = [];
    for (const c of candidates) {
      if (!seen.has(c.full_name)) {
        seen.add(c.full_name);
        newCandidates.push(c);
      }
    }

    return newCandidates;
  }

  /**
   * Deduplicate findings across runs using title + category + repository.
   */
  deduplicateFindings(findings: IntelligenceFinding[]): IntelligenceFinding[] {
    const db = getDb();
    const seen = new Set<string>();

    // Load existing finding fingerprints
    const existing = db
      .prepare(
        `SELECT title, category, repository_id FROM intelligence_findings`,
      )
      .all() as {
      title: string;
      category: string;
      repository_id: string | null;
    }[];
    for (const row of existing) {
      seen.add(`${row.title}|${row.category}|${row.repository_id ?? "null"}`);
    }

    const newFindings: IntelligenceFinding[] = [];
    for (const f of findings) {
      const key = `${f.title}|${f.category}|${f.repository_id ?? "null"}`;
      if (!seen.has(key)) {
        seen.add(key);
        newFindings.push(f);
      }
    }

    return newFindings;
  }
}

// ─── DIL-06: Incremental Change Intelligence ───────────────────────────────

export class ChangeDetector {
  /**
   * Detect changes between current and previous observation for a repository.
   * Returns change significance and list of changes.
   */
  detectChanges(
    current: DailyObservation,
    previous: DailyObservation | null,
  ): { changes: string[]; significance: ChangeSignificance } {
    if (!previous) {
      return {
        changes: ["first_observation"],
        significance: "minor",
      };
    }

    const changes: string[] = [];
    let significance: ChangeSignificance = "none";

    // Star changes
    const starDelta = current.stars - previous.stars;
    if (starDelta > 0) {
      changes.push(
        `stars: ${previous.stars} → ${current.stars} (+${starDelta})`,
      );
      if (starDelta > 100) significance = "major";
      else if (starDelta > 20) significance = "moderate";
      else if (starDelta > 0)
        significance = significance === "none" ? "minor" : significance;
    }

    // Fork changes
    const forkDelta = current.forks - previous.forks;
    if (forkDelta > 0) {
      changes.push(
        `forks: ${previous.forks} → ${current.forks} (+${forkDelta})`,
      );
      if (forkDelta > 10) significance = "moderate";
    }

    // Issue changes
    const issueDelta = current.open_issues - previous.open_issues;
    if (issueDelta > 0) {
      changes.push(
        `open_issues: ${previous.open_issues} → ${current.open_issues} (+${issueDelta})`,
      );
    } else if (issueDelta < 0) {
      changes.push(
        `open_issues: ${previous.open_issues} → ${current.open_issues} (${issueDelta})`,
      );
    }

    // Release changes
    if (
      current.latest_release &&
      current.latest_release !== previous.latest_release
    ) {
      changes.push(`new_release: ${current.latest_release}`);
      significance = "major";
    }

    // Commit changes
    if (
      current.latest_commit &&
      current.latest_commit !== previous.latest_commit
    ) {
      changes.push(`new_commits_detected`);
      if (significance === "none") significance = "minor";
    }

    // Topic changes
    const newTopics = current.topics.filter(
      (t) => !previous.topics.includes(t),
    );
    if (newTopics.length > 0) {
      changes.push(`new_topics: ${newTopics.join(", ")}`);
    }

    // Description changes
    if (current.description !== previous.description) {
      changes.push(`description_updated`);
    }

    // Language changes
    if (current.language !== previous.language) {
      changes.push(`language: ${previous.language} → ${current.language}`);
      significance = "moderate";
    }

    return { changes, significance };
  }

  /**
   * Build observation from repo data and detect changes.
   */
  buildObservation(
    runId: string,
    repoId: string,
    repoData: Record<string, unknown>,
    healthScore: number | null,
    techScore: number | null,
    bhavyaScore: number | null,
    recommendationType: string | null,
    previousObservation: DailyObservation | null,
  ): DailyObservation {
    const current: DailyObservation = {
      id: `obs_${repoId}_${Date.now()}`,
      run_id: runId,
      repository_id: repoId,
      observation_date: new Date().toISOString().split("T")[0],
      stars: (repoData.stargazers_count as number) ?? 0,
      forks: (repoData.forks_count as number) ?? 0,
      open_issues: (repoData.open_issues_count as number) ?? 0,
      latest_release: null,
      latest_commit: (repoData.pushed_at as string) ?? null,
      description: (repoData.description as string) ?? "",
      topics: (repoData.topics as string[]) ?? [],
      language: (repoData.language as string) ?? null,
      license:
        ((repoData.license as Record<string, unknown>)?.spdx_id as string) ??
        null,
      health_score: healthScore,
      technology_score: techScore,
      bhavya_score: bhavyaScore,
      recommendation_type: recommendationType,
      changes_detected: [],
      change_significance: "none",
      previous_observation_id: previousObservation?.id ?? null,
      metadata: "{}",
    };

    const { changes, significance } = this.detectChanges(
      current,
      previousObservation,
    );
    current.changes_detected = changes;
    current.change_significance = significance;

    return current;
  }

  persistObservation(obs: DailyObservation): void {
    const db = getDb();
    db.prepare(
      `
      INSERT OR REPLACE INTO daily_observations
      (id, run_id, repository_id, observation_date, stars, forks, open_issues,
       latest_release, latest_commit, description, topics, language, license,
       health_score, technology_score, bhavya_score, recommendation_type,
       changes_detected, change_significance, previous_observation_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      obs.id,
      obs.run_id,
      obs.repository_id,
      obs.observation_date,
      obs.stars,
      obs.forks,
      obs.open_issues,
      obs.latest_release,
      obs.latest_commit,
      obs.description,
      JSON.stringify(obs.topics),
      obs.language,
      obs.license,
      obs.health_score,
      obs.technology_score,
      obs.bhavya_score,
      obs.recommendation_type,
      JSON.stringify(obs.changes_detected),
      obs.change_significance,
      obs.previous_observation_id,
      obs.metadata,
    );
  }

  getPreviousObservation(
    repoId: string,
    beforeDate: string,
  ): DailyObservation | null {
    const db = getDb();
    const row = db
      .prepare(
        `
      SELECT * FROM daily_observations
      WHERE repository_id = ? AND observation_date < ?
      ORDER BY observation_date DESC LIMIT 1
    `,
      )
      .get(repoId, beforeDate) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.rowToObservation(row);
  }

  private rowToObservation(row: Record<string, unknown>): DailyObservation {
    return {
      id: row.id as string,
      run_id: row.run_id as string,
      repository_id: row.repository_id as string,
      observation_date: row.observation_date as string,
      stars: row.stars as number,
      forks: row.forks as number,
      open_issues: row.open_issues as number,
      latest_release: row.latest_release as string | null,
      latest_commit: row.latest_commit as string | null,
      description: row.description as string,
      topics: JSON.parse((row.topics as string) ?? "[]"),
      language: row.language as string | null,
      license: row.license as string | null,
      health_score: row.health_score as number | null,
      technology_score: row.technology_score as number | null,
      bhavya_score: row.bhavya_score as number | null,
      recommendation_type: row.recommendation_type as string | null,
      changes_detected: JSON.parse((row.changes_detected as string) ?? "[]"),
      change_significance:
        (row.change_significance as ChangeSignificance) ?? "none",
      previous_observation_id: row.previous_observation_id as string | null,
      metadata: (row.metadata as string) ?? "{}",
    };
  }
}

// ─── DIL-07: Engineering Practice Extraction ───────────────────────────────

export class EngineeringPracticeExtractor {
  /**
   * Extract engineering practices from repository analysis.
   * Uses structural signals from repo metadata and README.
   */
  extract(
    repoId: string,
    repoName: string,
    repoData: Record<string, unknown>,
    readme: string | null,
  ): EngineeringPractice[] {
    const practices: EngineeringPractice[] = [];

    // CI/CD detection
    if (
      readme &&
      /github.actions|\.github\/workflows|ci\/cd|continuous.integration/i.test(
        readme,
      )
    ) {
      practices.push({
        title: "CI/CD Pipeline",
        description:
          "Repository uses continuous integration and deployment pipelines",
        category: "automation",
        source_repository: repoName,
        source_evidence: ["README mentions CI/CD or GitHub Actions"],
        confidence: "medium",
        verification_state: "observed",
        bhavya_relevance: "high",
        applicability: ["project-runtime", "mission-runtime"],
        tradeoffs: ["Requires maintenance", "Setup complexity"],
      });
    }

    // Testing patterns
    if (
      readme &&
      /testing|test.coverage|unit.test|integration.test|e2e.test/i.test(readme)
    ) {
      practices.push({
        title: "Testing Strategy",
        description: "Repository demonstrates structured testing approach",
        category: "quality",
        source_repository: repoName,
        source_evidence: ["README discusses testing methodology"],
        confidence: "medium",
        verification_state: "observed",
        bhavya_relevance: "high",
        applicability: ["all-projects"],
        tradeoffs: ["Test maintenance overhead", "Slower development cycles"],
      });
    }

    // Monorepo structure
    const topics = (repoData.topics as string[]) ?? [];
    if (topics.includes("monorepo") || topics.includes("workspace")) {
      practices.push({
        title: "Monorepo Architecture",
        description: "Repository uses monorepo structure with shared packages",
        category: "architecture",
        source_repository: repoName,
        source_evidence: ["Topics include monorepo/workspace"],
        confidence: "high",
        verification_state: "observed",
        bhavya_relevance: "high",
        applicability: ["Bhavya Foundation structure"],
        tradeoffs: ["Complex build system", "Shared dependency management"],
      });
    }

    // Documentation emphasis
    if (readme && readme.length > 2000) {
      practices.push({
        title: "Documentation-First",
        description: "Repository has substantial README documentation",
        category: "documentation",
        source_repository: repoName,
        source_evidence: [`README length: ${readme.length} chars`],
        confidence: "low",
        verification_state: "observed",
        bhavya_relevance: "medium",
        applicability: ["all-projects"],
        tradeoffs: ["Documentation can become stale", "Time investment"],
      });
    }

    // Open source governance
    if (topics.includes("open-source") || topics.includes("oss")) {
      practices.push({
        title: "Open Source Governance",
        description: "Repository follows open source governance practices",
        category: "governance",
        source_repository: repoName,
        source_evidence: ["Topics include open-source/oss"],
        confidence: "medium",
        verification_state: "observed",
        bhavya_relevance: "medium",
        applicability: ["community-engagement"],
        tradeoffs: ["Requires community management", "Slower decision-making"],
      });
    }

    return practices;
  }
}

// ─── DIL-08: Architecture Lesson Extraction ────────────────────────────────

export class ArchitectureLessonExtractor {
  /**
   * Extract architecture lessons from repository patterns.
   */
  extract(
    repoId: string,
    repoName: string,
    repoData: Record<string, unknown>,
    readme: string | null,
    patterns: string[],
  ): ArchitectureLesson[] {
    const lessons: ArchitectureLesson[] = [];

    // Module organization
    if (readme && /modular|module|package|layer/i.test(readme)) {
      lessons.push({
        problem: "Organizing code for maintainability",
        approach: "Module-based architecture with clear boundaries",
        why_it_works:
          "Reduces coupling, enables independent development and testing",
        tradeoffs: ["Increased complexity", "Cross-module dependencies"],
        evidence: ["README describes modular architecture"],
        bhavya_relevance: "high",
        possible_experiment: "Apply modular patterns to Bhavya packages",
        source_repository: repoName,
      });
    }

    // Plugin system
    if (readme && /plugin|extension|addon|hook/i.test(readme)) {
      lessons.push({
        problem: "Extensibility without core modification",
        approach: "Plugin architecture with extension points",
        why_it_works: "Enables community contributions without forking",
        tradeoffs: ["API stability requirements", "Plugin compatibility"],
        evidence: ["README mentions plugin/extension system"],
        bhavya_relevance: "medium",
        possible_experiment: "Design Bhavya SDK extension points",
        source_repository: repoName,
      });
    }

    // Event-driven patterns
    if (patterns.includes("event-driven") || patterns.includes("pub-sub")) {
      lessons.push({
        problem: "Decoupling components for scalability",
        approach: "Event-driven architecture with message passing",
        why_it_works:
          "Components can evolve independently, enables async processing",
        tradeoffs: ["Event ordering complexity", "Debugging difficulty"],
        evidence: ["Patterns include event-driven architecture"],
        bhavya_relevance: "medium",
        possible_experiment:
          "Evaluate event-driven patterns for Bhavya events package",
        source_repository: repoName,
      });
    }

    return lessons;
  }
}

// ─── DIL-09: AI Technique Extraction ───────────────────────────────────────

export class AITechniqueExtractor {
  /**
   * Extract AI techniques from repository content.
   */
  extract(
    repoId: string,
    repoName: string,
    repoData: Record<string, unknown>,
    readme: string | null,
    topics: string[],
  ): AITechnique[] {
    const techniques: AITechnique[] = [];
    const allText = `${readme ?? ""} ${topics.join(" ")}`.toLowerCase();

    // LLM patterns
    if (
      allText.includes("llm") ||
      allText.includes("large.language.model") ||
      allText.includes("gpt") ||
      allText.includes("claude")
    ) {
      techniques.push({
        name: "LLM Integration",
        description:
          "Repository demonstrates patterns for integrating large language models",
        category: "ai-infrastructure",
        source_repository: repoName,
        source_evidence: ["README or topics reference LLM integration"],
        confidence: "medium",
        bhavya_relevance: "high",
        applicability: ["ai-institute", "knowledge-engine"],
        related_techniques: ["prompt-engineering", "rag", "fine-tuning"],
      });
    }

    // RAG patterns
    if (
      allText.includes("rag") ||
      allText.includes("retrieval.augmented") ||
      allText.includes("vector.search")
    ) {
      techniques.push({
        name: "Retrieval-Augmented Generation",
        description: "Repository uses RAG patterns for knowledge-grounded AI",
        category: "ai-infrastructure",
        source_repository: repoName,
        source_evidence: ["README or topics reference RAG"],
        confidence: "medium",
        bhavya_relevance: "high",
        applicability: ["knowledge-engine", "search-engine"],
        related_techniques: ["vector-databases", "embedding-models"],
      });
    }

    // Agent patterns
    if (
      allText.includes("agent") ||
      allText.includes("autonomous") ||
      allText.includes("multi.agent")
    ) {
      techniques.push({
        name: "Agent Architecture",
        description: "Repository implements autonomous agent patterns",
        category: "ai-agents",
        source_repository: repoName,
        source_evidence: ["README or topics reference agents"],
        confidence: "medium",
        bhavya_relevance: "high",
        applicability: ["agent-engine", "mission-runtime"],
        related_techniques: ["tool-use", "planning", "memory"],
      });
    }

    // Embedding / vector
    if (
      allText.includes("embedding") ||
      allText.includes("vector") ||
      allText.includes("similarity")
    ) {
      techniques.push({
        name: "Embedding & Vector Search",
        description: "Repository uses embeddings for semantic search",
        category: "ai-infrastructure",
        source_repository: repoName,
        source_evidence: ["README or topics reference embeddings/vectors"],
        confidence: "medium",
        bhavya_relevance: "medium",
        applicability: ["search-engine", "knowledge-graph"],
        related_techniques: ["llm-integration", "rag"],
      });
    }

    // Fine-tuning
    if (
      allText.includes("fine.tun") ||
      allText.includes("training") ||
      allText.includes("dataset")
    ) {
      techniques.push({
        name: "Model Training & Fine-tuning",
        description:
          "Repository demonstrates model training or fine-tuning patterns",
        category: "ai-infrastructure",
        source_repository: repoName,
        source_evidence: ["README or topics reference training/fine-tuning"],
        confidence: "low",
        bhavya_relevance: "medium",
        applicability: ["ai-institute"],
        related_techniques: ["llm-integration", "data-pipelines"],
      });
    }

    return techniques;
  }
}

// ─── DIL-10: Visual Design Intelligence ────────────────────────────────────

export class DesignIntelligenceExtractor {
  /**
   * Extract design principles and visual insights from repository analysis.
   */
  extract(
    repoId: string,
    repoName: string,
    repoData: Record<string, unknown>,
    readme: string | null,
    topics: string[],
  ): { principles: DesignPrinciple[]; insights: VisualInsight[] } {
    const principles: DesignPrinciple[] = [];
    const insights: VisualInsight[] = [];
    const allText = `${readme ?? ""} ${topics.join(" ")}`.toLowerCase();

    // Design system detection
    if (
      allText.includes("design.system") ||
      allText.includes("component.library") ||
      allText.includes("ui.library")
    ) {
      principles.push({
        title: "Design System Architecture",
        description: "Repository implements or uses a design system approach",
        category: "design-system",
        source_repository: repoName,
        source_evidence: ["README or topics reference design systems"],
        confidence: "medium",
        bhavya_relevance: "high",
        example: null,
        applicability: ["platform-ui", "design-system"],
      });
    }

    // Accessibility
    if (
      allText.includes("accessibility") ||
      allText.includes("a11y") ||
      allText.includes("wcag")
    ) {
      principles.push({
        title: "Accessibility-First Design",
        description: "Repository prioritizes accessibility compliance",
        category: "accessibility",
        source_repository: repoName,
        source_evidence: ["README or topics reference accessibility"],
        confidence: "medium",
        bhavya_relevance: "high",
        example: null,
        applicability: ["platform-ui", "design-system"],
      });
    }

    // Responsive / mobile
    if (
      allText.includes("responsive") ||
      allText.includes("mobile.first") ||
      allText.includes("adaptive")
    ) {
      principles.push({
        title: "Responsive Design Pattern",
        description: "Repository implements responsive/adaptive design",
        category: "responsive",
        source_repository: repoName,
        source_evidence: ["README or topics reference responsive design"],
        confidence: "medium",
        bhavya_relevance: "medium",
        example: null,
        applicability: ["platform-ui"],
      });
    }

    // Motion / animation
    if (
      allText.includes("animation") ||
      allText.includes("motion") ||
      allText.includes("transition")
    ) {
      insights.push({
        title: "Motion Design Patterns",
        description: "Repository demonstrates motion/animation techniques",
        source_repository: repoName,
        source_evidence: ["README or topics reference motion/animation"],
        principle:
          "Motion communicates state changes and guides user attention",
        bhavya_applicability:
          "Apply intentional motion to Bhavya UI components",
        confidence: "low",
      });
    }

    // Typography
    if (
      allText.includes("typography") ||
      allText.includes("font") ||
      allText.includes("type.scale")
    ) {
      insights.push({
        title: "Typography System",
        description: "Repository implements structured typography system",
        source_repository: repoName,
        source_evidence: ["README or topics reference typography"],
        principle: "Typography creates hierarchy and readability",
        bhavya_applicability:
          "Reference for Playfair Display + Inter typography system",
        confidence: "low",
      });
    }

    return { principles, insights };
  }
}

// ─── Learning Lesson Extraction ────────────────────────────────────────────

export class LearningLessonExtractor {
  extract(
    repoId: string,
    repoName: string,
    repoData: Record<string, unknown>,
    readme: string | null,
    topics: string[],
  ): LearningLesson[] {
    const lessons: LearningLesson[] = [];
    const allText = `${readme ?? ""} ${topics.join(" ")}`.toLowerCase();

    if (
      allText.includes("tutorial") ||
      allText.includes("getting.started") ||
      allText.includes("quickstart")
    ) {
      lessons.push({
        title: "Structured Onboarding",
        concept: "Progressive disclosure of complexity in developer education",
        prerequisites: [],
        explanation:
          "Repository provides structured learning path for new users",
        example: null,
        why_it_matters: "Reduces barrier to entry, improves adoption",
        source: repoName,
        evidence: ["README contains tutorial/quickstart content"],
        difficulty: "beginner",
        bhavya_relevance: "high",
      });
    }

    if (
      allText.includes("example") ||
      allText.includes("demo") ||
      allText.includes("sample")
    ) {
      lessons.push({
        title: "Example-Driven Documentation",
        concept:
          "Teaching through practical examples rather than abstract explanation",
        prerequisites: [],
        explanation: "Repository uses examples to demonstrate capabilities",
        example: null,
        why_it_matters: "Examples make abstract concepts concrete",
        source: repoName,
        evidence: ["README contains examples/demos"],
        difficulty: "beginner",
        bhavya_relevance: "medium",
      });
    }

    return lessons;
  }
}

// ─── License Gate ──────────────────────────────────────────────────────────

export class LicenseGateEvaluator {
  evaluate(license: string | null): LicenseGate {
    if (!license) {
      return {
        license: null,
        license_confidence: "low",
        license_source: "not_detected",
        is_osi_approved: false,
        is_copyleft: false,
        compatibility_notes: "No license detected",
        risk: "high",
        recommendation: "monitor",
      };
    }

    const osiApproved = [
      "MIT",
      "Apache-2.0",
      "BSD-2-Clause",
      "BSD-3-Clause",
      "ISC",
      "GPL-2.0",
      "GPL-3.0",
      "LGPL-2.1",
      "LGPL-3.0",
      "MPL-2.0",
      "Unlicense",
      "CC0-1.0",
      "BSL-1.0",
    ];

    const copyleft = ["GPL-2.0", "GPL-3.0", "LGPL-2.1", "LGPL-3.0", "AGPL-3.0"];

    const isOsi = osiApproved.includes(license);
    const isCopyleft = copyleft.includes(license);

    let risk: "none" | "low" | "medium" | "high";
    let recommendation: "adopt" | "study" | "monitor" | "reject";

    if (
      ["MIT", "Apache-2.0", "ISC", "BSD-2-Clause", "BSD-3-Clause"].includes(
        license,
      )
    ) {
      risk = "none";
      recommendation = "adopt";
    } else if (isCopyleft) {
      risk = "medium";
      recommendation = "study";
    } else if (isOsi) {
      risk = "low";
      recommendation = "adopt";
    } else {
      risk = "high";
      recommendation = "monitor";
    }

    return {
      license,
      license_confidence: "high",
      license_source: "github_api",
      is_osi_approved: isOsi,
      is_copyleft: isCopyleft,
      compatibility_notes: isCopyleft
        ? "Copyleft license — may require derivative works to be open-sourced"
        : isOsi
          ? "OSI-approved permissive license"
          : "Non-standard license — review required",
      risk,
      recommendation,
    };
  }
}

// ─── Security Gate ─────────────────────────────────────────────────────────

export class SecurityGateEvaluator {
  evaluate(readme: string | null): SecurityGate {
    const gate: SecurityGate = {
      credential_files: [],
      suspicious_patterns: [],
      dangerous_install_scripts: false,
      unusual_executables: false,
      dependency_concerns: [],
      overall_risk: "none",
      evidence: [],
      recommendation: "safe",
    };

    if (!readme) {
      gate.evidence.push("No README available for security review");
      gate.overall_risk = "low";
      gate.recommendation = "caution";
      return gate;
    }

    const text = readme.toLowerCase();

    // Check for credential patterns
    if (/api.key|secret|password|token|credential/i.test(text)) {
      gate.credential_files.push("README references credentials/secrets");
      gate.evidence.push("README mentions credentials or secrets");
    }

    // Check for dangerous install scripts
    if (/curl.*\|.*sh|wget.*\|.*sh|eval\(|exec\(/i.test(text)) {
      gate.dangerous_install_scripts = true;
      gate.evidence.push(
        "README contains potentially dangerous install commands",
      );
      gate.overall_risk = "medium";
    }

    // Check for suspicious patterns
    if (/chmod\s+777|sudo\s+rm|rm\s+-rf/i.test(text)) {
      gate.suspicious_patterns.push("Dangerous shell commands detected");
      gate.evidence.push("README contains dangerous shell commands");
      gate.overall_risk = "high";
      gate.recommendation = "investigate";
    }

    if (gate.overall_risk === "none") {
      gate.recommendation = "safe";
    }

    return gate;
  }
}

// ─── DIL Orchestrator ──────────────────────────────────────────────────────

export class DailyIntelligenceOrchestrator {
  private client: DailyGitHubClient;
  private db: ReturnType<typeof getDb>;

  constructor(token: string | null = null) {
    this.client = new DailyGitHubClient(token);
    this.db = getDb();
  }

  /**
   * Run a complete daily intelligence cycle.
   * DIL-03: Discover → DIL-04: Rank → DIL-05: Dedup → DIL-06: Inspect →
   * DIL-07-10: Extract → Evaluate → Brief
   */
  async runDailyIntelligence(
    config?: Partial<DailyRunConfig>,
  ): Promise<DailyRun> {
    const fullConfig = { ...DEFAULT_DAILY_RUN_CONFIG, ...config };
    const runDate = new Date().toISOString().split("T")[0];
    const runId = `run_${runDate}_${Date.now()}`;

    // Create run record
    const run: DailyRun = {
      id: runId,
      run_date: runDate,
      status: "running",
      started_at: new Date().toISOString(),
      completed_at: null,
      candidate_count: 0,
      inspected_count: 0,
      findings_count: 0,
      errors_count: 0,
      skipped_count: 0,
      api_calls: 0,
      duration_ms: null,
      config: JSON.stringify(fullConfig),
      error_log: "[]",
      metadata: "{}",
    };
    this.persistRun(run);

    const startTime = Date.now();
    const errors: string[] = [];

    try {
      // Load categories
      const categories = this.db
        .prepare(`SELECT * FROM discovery_categories WHERE active = 1`)
        .all() as DiscoveryCategory[];

      // DIL-03: Discovery
      const discovery = new DailyDiscoveryEngine(this.client, this.db);
      const rawCandidates = await discovery.discover(
        runId,
        categories,
        fullConfig,
      );
      run.candidate_count = rawCandidates.length;

      // DIL-04: Ranking
      const ranker = new DiscoveryRanker();
      const rankings = ranker.rank(rawCandidates, fullConfig);
      ranker.persistRankings(rawCandidates, rankings);

      // DIL-05: Deduplication
      const dedup = new Deduplicator();
      const newCandidates = dedup.deduplicateNew(rawCandidates);

      // DIL-06: Inspect top new candidates
      const toInspect = newCandidates
        .sort((a, b) => b.rank_score - a.rank_score)
        .slice(0, fullConfig.max_inspections);

      const changeDetector = new ChangeDetector();
      const practiceExtractor = new EngineeringPracticeExtractor();
      const architectureExtractor = new ArchitectureLessonExtractor();
      const aiExtractor = new AITechniqueExtractor();
      const designExtractor = new DesignIntelligenceExtractor();
      const learningExtractor = new LearningLessonExtractor();
      const licenseGate = new LicenseGateEvaluator();
      const securityGate = new SecurityGateEvaluator();

      const allFindings: IntelligenceFinding[] = [];

      for (const candidate of toInspect) {
        try {
          const repoData = await this.client.getRepo(
            candidate.owner,
            candidate.name,
          );
          if (!repoData) {
            run.skipped_count++;
            continue;
          }

          const readme = await this.client.getReadme(
            candidate.owner,
            candidate.name,
          );

          // License gate
          const lic = licenseGate.evaluate(candidate.license);
          if (lic.recommendation === "reject") {
            candidate.filtered = 1;
            candidate.filter_reason = `license_reject: ${lic.license}`;
            run.skipped_count++;
            continue;
          }

          // Security gate
          const sec = securityGate.evaluate(readme);
          if (sec.recommendation === "reject") {
            candidate.filtered = 1;
            candidate.filter_reason = "security_reject";
            run.skipped_count++;
            continue;
          }

          // Observation & change detection
          const prevObs = changeDetector.getPreviousObservation(
            candidate.repository_id ?? candidate.full_name,
            runDate,
          );
          // For new candidates, just build observation
          const obs = changeDetector.buildObservation(
            runId,
            candidate.full_name,
            repoData,
            null,
            null,
            null,
            null,
            prevObs,
          );

          // Extract findings
          const practices = practiceExtractor.extract(
            candidate.full_name,
            candidate.full_name,
            repoData,
            readme,
          );
          const archLessons = architectureExtractor.extract(
            candidate.full_name,
            candidate.full_name,
            repoData,
            readme,
            [],
          );
          const aiTechniques = aiExtractor.extract(
            candidate.full_name,
            candidate.full_name,
            repoData,
            readme,
            (repoData.topics as string[]) ?? [],
          );
          const { principles: designPrinciples, insights: designInsights } =
            designExtractor.extract(
              candidate.full_name,
              candidate.full_name,
              repoData,
              readme,
              (repoData.topics as string[]) ?? [],
            );
          const learningLessons = learningExtractor.extract(
            candidate.full_name,
            candidate.full_name,
            repoData,
            readme,
            (repoData.topics as string[]) ?? [],
          );

          // Convert to IntelligenceFinding format
          for (const p of practices) {
            allFindings.push(
              this.practiceToFinding(p, runId, candidate.full_name),
            );
          }
          for (const l of archLessons) {
            allFindings.push(
              this.archLessonToFinding(l, runId, candidate.full_name),
            );
          }
          for (const t of aiTechniques) {
            allFindings.push(
              this.aiTechToFinding(t, runId, candidate.full_name),
            );
          }
          for (const p of designPrinciples) {
            allFindings.push(
              this.designPrincipleToFinding(p, runId, candidate.full_name),
            );
          }
          for (const i of designInsights) {
            allFindings.push(
              this.visualInsightToFinding(i, runId, candidate.full_name),
            );
          }
          for (const l of learningLessons) {
            allFindings.push(
              this.learningLessonToFinding(l, runId, candidate.full_name),
            );
          }

          candidate.inspected = 1;
          run.inspected_count++;
          run.api_calls = this.client.getApiCalls();
        } catch (e) {
          errors.push(
            `Error inspecting ${candidate.full_name}: ${(e as Error).message}`,
          );
          run.errors_count++;
        }
      }

      // Deduplicate findings
      const uniqueFindings = dedup.deduplicateFindings(allFindings);
      run.findings_count = uniqueFindings.length;

      // Persist findings
      this.persistFindings(uniqueFindings);

      // DIL-10+: Generate briefing
      const briefing = this.generateBriefing(runId, runDate, uniqueFindings);
      this.persistBriefing(briefing);

      // Complete run
      run.status = "completed";
      run.completed_at = new Date().toISOString();
      run.duration_ms = Date.now() - startTime;
      run.error_log = JSON.stringify(errors);
      run.api_calls = this.client.getApiCalls();
    } catch (e) {
      run.status = "failed";
      run.completed_at = new Date().toISOString();
      run.duration_ms = Date.now() - startTime;
      errors.push(`Fatal: ${(e as Error).message}`);
      run.error_log = JSON.stringify(errors);
    }

    this.persistRun(run);
    return run;
  }

  // ─── Briefing Generation ───────────────────────────────────────────────

  private generateBriefing(
    runId: string,
    runDate: string,
    findings: IntelligenceFinding[],
  ): DailyBriefing {
    const byType = <T extends { finding_type: FindingType }>(
      type: FindingType,
    ) => findings.filter((f) => f.finding_type === type);

    const toBriefingItem = (f: IntelligenceFinding): BriefingItem => ({
      title: f.title,
      description: f.description,
      source: f.repository_id ?? "unknown",
      relevance: f.relevance_to_bhavya,
      confidence: f.confidence,
      action: f.relevance_to_bhavya === "high" ? "review_and_apply" : "monitor",
    });

    return {
      id: `briefing_${runDate}`,
      run_id: runId,
      run_date: runDate,
      top_discoveries: findings
        .filter((f) => f.relevance_to_bhavya === "high")
        .slice(0, 5)
        .map(toBriefingItem),
      engineering_practices: byType("engineering_practice").map(toBriefingItem),
      ai_techniques: byType("ai_technique").map(toBriefingItem),
      architecture_lessons: byType("architecture_lesson").map(toBriefingItem),
      design_inspiration: [
        ...byType("design_principle"),
        ...byType("visual_insight"),
      ].map(toBriefingItem),
      learning_lessons: byType("learning_lesson").map(toBriefingItem),
      experiments: byType("experiment_idea").map(toBriefingItem),
      radar_changes: [],
      warnings: findings
        .filter((f) => f.confidence === "low" || f.quality === "low")
        .slice(0, 3)
        .map(toBriefingItem),
      summary: this.generateSummary(findings),
    };
  }

  private generateSummary(findings: IntelligenceFinding[]): string {
    const total = findings.length;
    const highRelevance = findings.filter(
      (f) => f.relevance_to_bhavya === "high",
    ).length;
    const byType = (type: FindingType) =>
      findings.filter((f) => f.finding_type === type).length;

    return [
      `Daily Intelligence Summary`,
      `Total findings: ${total}`,
      `High relevance to Bhavya: ${highRelevance}`,
      `Engineering practices: ${byType("engineering_practice")}`,
      `Architecture lessons: ${byType("architecture_lesson")}`,
      `AI techniques: ${byType("ai_technique")}`,
      `Design insights: ${byType("design_principle") + byType("visual_insight")}`,
      `Learning lessons: ${byType("learning_lesson")}`,
    ].join("\n");
  }

  // ─── Conversion helpers ────────────────────────────────────────────────

  private practiceToFinding(
    p: EngineeringPractice,
    runId: string,
    repoId: string,
  ): IntelligenceFinding {
    return {
      id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      run_id: runId,
      repository_id: repoId,
      finding_type: "engineering_practice",
      category: "engineering",
      title: p.title,
      description: p.description,
      evidence: p.source_evidence,
      source_files: [],
      confidence: p.confidence,
      confidence_score:
        p.confidence === "high" ? 0.9 : p.confidence === "medium" ? 0.6 : 0.3,
      verification_state: p.verification_state,
      quality: "medium",
      relevance_to_bhavya: p.bhavya_relevance,
      applicability: p.applicability,
      tradeoffs: p.tradeoffs,
      tags: [p.category],
      metadata: JSON.stringify({ source_repository: p.source_repository }),
      created_at: new Date().toISOString(),
    };
  }

  private archLessonToFinding(
    l: ArchitectureLesson,
    runId: string,
    repoId: string,
  ): IntelligenceFinding {
    return {
      id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      run_id: runId,
      repository_id: repoId,
      finding_type: "architecture_lesson",
      category: "architecture",
      title: l.problem,
      description: `${l.approach} — ${l.why_it_works}`,
      evidence: l.evidence,
      source_files: [],
      confidence: "medium",
      confidence_score: 0.6,
      verification_state: "observed",
      quality: "medium",
      relevance_to_bhavya: l.bhavya_relevance,
      applicability: l.tradeoffs,
      tradeoffs: l.tradeoffs,
      tags: ["architecture"],
      metadata: JSON.stringify({
        source_repository: l.source_repository,
        possible_experiment: l.possible_experiment,
      }),
      created_at: new Date().toISOString(),
    };
  }

  private aiTechToFinding(
    t: AITechnique,
    runId: string,
    repoId: string,
  ): IntelligenceFinding {
    return {
      id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      run_id: runId,
      repository_id: repoId,
      finding_type: "ai_technique",
      category: "ai",
      title: t.name,
      description: t.description,
      evidence: t.source_evidence,
      source_files: [],
      confidence: t.confidence,
      confidence_score:
        t.confidence === "high" ? 0.9 : t.confidence === "medium" ? 0.6 : 0.3,
      verification_state: "observed",
      quality: "medium",
      relevance_to_bhavya: t.bhavya_relevance,
      applicability: t.applicability,
      tradeoffs: [],
      tags: [t.category, ...t.related_techniques],
      metadata: JSON.stringify({ source_repository: t.source_repository }),
      created_at: new Date().toISOString(),
    };
  }

  private designPrincipleToFinding(
    p: DesignPrinciple,
    runId: string,
    repoId: string,
  ): IntelligenceFinding {
    return {
      id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      run_id: runId,
      repository_id: repoId,
      finding_type: "design_principle",
      category: "design",
      title: p.title,
      description: p.description,
      evidence: p.source_evidence,
      source_files: [],
      confidence: p.confidence,
      confidence_score:
        p.confidence === "high" ? 0.9 : p.confidence === "medium" ? 0.6 : 0.3,
      verification_state: "observed",
      quality: "medium",
      relevance_to_bhavya: p.bhavya_relevance,
      applicability: p.applicability,
      tradeoffs: [],
      tags: [p.category],
      metadata: JSON.stringify({ example: p.example }),
      created_at: new Date().toISOString(),
    };
  }

  private visualInsightToFinding(
    i: VisualInsight,
    runId: string,
    repoId: string,
  ): IntelligenceFinding {
    return {
      id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      run_id: runId,
      repository_id: repoId,
      finding_type: "visual_insight",
      category: "design",
      title: i.title,
      description: `${i.description} — ${i.bhavya_applicability}`,
      evidence: i.source_evidence,
      source_files: [],
      confidence: i.confidence,
      confidence_score:
        i.confidence === "high" ? 0.9 : i.confidence === "medium" ? 0.6 : 0.3,
      verification_state: "observed",
      quality: "low",
      relevance_to_bhavya: "medium",
      applicability: [i.principle],
      tradeoffs: [],
      tags: ["visual-design"],
      metadata: JSON.stringify({ source_repository: i.source_repository }),
      created_at: new Date().toISOString(),
    };
  }

  private learningLessonToFinding(
    l: LearningLesson,
    runId: string,
    repoId: string,
  ): IntelligenceFinding {
    return {
      id: `finding_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      run_id: runId,
      repository_id: repoId,
      finding_type: "learning_lesson",
      category: "education",
      title: l.title,
      description: `${l.concept} — ${l.why_it_matters}`,
      evidence: l.evidence,
      source_files: [],
      confidence: "medium",
      confidence_score: 0.6,
      verification_state: "observed",
      quality: "medium",
      relevance_to_bhavya: l.bhavya_relevance,
      applicability: l.prerequisites,
      tradeoffs: [],
      tags: ["education", l.difficulty],
      metadata: JSON.stringify({ source: l.source, difficulty: l.difficulty }),
      created_at: new Date().toISOString(),
    };
  }

  // ─── Persistence ───────────────────────────────────────────────────────

  private persistRun(run: DailyRun): void {
    this.db
      .prepare(
        `
      INSERT OR REPLACE INTO daily_runs
      (id, run_date, status, started_at, completed_at, candidate_count,
       inspected_count, findings_count, errors_count, skipped_count,
       api_calls, duration_ms, config, error_log, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        run.id,
        run.run_date,
        run.status,
        run.started_at,
        run.completed_at,
        run.candidate_count,
        run.inspected_count,
        run.findings_count,
        run.errors_count,
        run.skipped_count,
        run.api_calls,
        run.duration_ms,
        run.config,
        run.error_log,
        run.metadata,
      );
  }

  private persistFindings(findings: IntelligenceFinding[]): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO intelligence_findings
      (id, run_id, repository_id, finding_type, category, title, description,
       evidence, source_files, confidence, confidence_score, verification_state,
       quality, relevance_to_bhavya, applicability, tradeoffs, tags, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMany = this.db.transaction((items: IntelligenceFinding[]) => {
      for (const f of items) {
        stmt.run(
          f.id,
          f.run_id,
          f.repository_id,
          f.finding_type,
          f.category,
          f.title,
          f.description,
          JSON.stringify(f.evidence),
          JSON.stringify(f.source_files),
          f.confidence,
          f.confidence_score,
          f.verification_state,
          f.quality,
          f.relevance_to_bhavya,
          JSON.stringify(f.applicability),
          JSON.stringify(f.tradeoffs),
          JSON.stringify(f.tags),
          f.metadata,
        );
      }
    });
    insertMany(findings);
  }

  private persistBriefing(briefing: DailyBriefing): void {
    this.db
      .prepare(
        `
      INSERT OR REPLACE INTO daily_briefings
      (id, run_id, run_date, top_discoveries, engineering_practices,
       ai_techniques, architecture_lessons, design_inspiration,
       learning_lessons, experiments, radar_changes, warnings, summary, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        briefing.id,
        briefing.run_id,
        briefing.run_date,
        JSON.stringify(briefing.top_discoveries),
        JSON.stringify(briefing.engineering_practices),
        JSON.stringify(briefing.ai_techniques),
        JSON.stringify(briefing.architecture_lessons),
        JSON.stringify(briefing.design_inspiration),
        JSON.stringify(briefing.learning_lessons),
        JSON.stringify(briefing.experiments),
        JSON.stringify(briefing.radar_changes),
        JSON.stringify(briefing.warnings),
        briefing.summary,
        "{}",
      );
  }

  // ─── Search API ────────────────────────────────────────────────────────

  searchFindings(query: IntelligenceSearchQuery): IntelligenceFinding[] {
    let sql = `SELECT * FROM intelligence_findings WHERE 1=1`;
    const params: unknown[] = [];

    if (query.repository) {
      sql += ` AND repository_id = ?`;
      params.push(query.repository);
    }
    if (query.finding_type) {
      sql += ` AND finding_type = ?`;
      params.push(query.finding_type);
    }
    if (query.category) {
      sql += ` AND category = ?`;
      params.push(query.category);
    }
    if (query.confidence_min) {
      const levels = ["low", "medium", "high"];
      const minIdx = levels.indexOf(query.confidence_min);
      sql += ` AND confidence IN (${levels
        .slice(minIdx)
        .map(() => "?")
        .join(",")})`;
      params.push(...levels.slice(minIdx));
    }
    if (query.quality_min) {
      const levels = ["low", "medium", "high", "exceptional"];
      const minIdx = levels.indexOf(query.quality_min);
      sql += ` AND quality IN (${levels
        .slice(minIdx)
        .map(() => "?")
        .join(",")})`;
      params.push(...levels.slice(minIdx));
    }
    if (query.recommendation) {
      sql += ` AND tags LIKE ?`;
      params.push(`%${query.recommendation}%`);
    }
    if (query.topic) {
      sql += ` AND (tags LIKE ? OR title LIKE ? OR description LIKE ?)`;
      params.push(`%${query.topic}%`, `%${query.topic}%`, `%${query.topic}%`);
    }
    if (query.date_from) {
      sql += ` AND created_at >= ?`;
      params.push(query.date_from);
    }
    if (query.date_to) {
      sql += ` AND created_at <= ?`;
      params.push(query.date_to);
    }

    sql += ` ORDER BY confidence_score DESC, created_at DESC`;
    if (query.limit) {
      sql += ` LIMIT ?`;
      params.push(query.limit);
    }
    if (query.offset) {
      sql += ` OFFSET ?`;
      params.push(query.offset);
    }

    return this.db.prepare(sql).all(...params) as IntelligenceFinding[];
  }

  getLatestBriefing(): DailyBriefing | null {
    const row = this.db
      .prepare(`SELECT * FROM daily_briefings ORDER BY run_date DESC LIMIT 1`)
      .get() as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      id: row.id as string,
      run_id: row.run_id as string,
      run_date: row.run_date as string,
      top_discoveries: JSON.parse((row.top_discoveries as string) ?? "[]"),
      engineering_practices: JSON.parse(
        (row.engineering_practices as string) ?? "[]",
      ),
      ai_techniques: JSON.parse((row.ai_techniques as string) ?? "[]"),
      architecture_lessons: JSON.parse(
        (row.architecture_lessons as string) ?? "[]",
      ),
      design_inspiration: JSON.parse(
        (row.design_inspiration as string) ?? "[]",
      ),
      learning_lessons: JSON.parse((row.learning_lessons as string) ?? "[]"),
      experiments: JSON.parse((row.experiments as string) ?? "[]"),
      radar_changes: JSON.parse((row.radar_changes as string) ?? "[]"),
      warnings: JSON.parse((row.warnings as string) ?? "[]"),
      summary: row.summary as string | null,
    };
  }

  getRunHistory(limit = 10): DailyRun[] {
    return this.db
      .prepare(`SELECT * FROM daily_runs ORDER BY started_at DESC LIMIT ?`)
      .all(limit) as DailyRun[];
  }

  getFindingsByRepository(repoId: string): IntelligenceFinding[] {
    return this.db
      .prepare(
        `SELECT * FROM intelligence_findings WHERE repository_id = ? ORDER BY confidence_score DESC`,
      )
      .all(repoId) as IntelligenceFinding[];
  }

  // ─── Trend Detection ──────────────────────────────────────────────────

  detectTrends(): Trend[] {
    const findings = this.db
      .prepare(
        `SELECT * FROM intelligence_findings ORDER BY created_at DESC LIMIT 500`,
      )
      .all() as IntelligenceFinding[];

    const trendMap = new Map<string, Trend>();

    for (const f of findings) {
      const tags = JSON.parse(
        (f.tags as unknown as string) ?? "[]",
      ) as string[];
      for (const tag of tags) {
        const existing = trendMap.get(tag);
        if (existing) {
          existing.evidence_count++;
          if (
            f.repository_id &&
            !existing.evidence_repositories.includes(f.repository_id)
          ) {
            existing.evidence_repositories.push(f.repository_id);
          }
          existing.last_observed = f.created_at;
        } else {
          trendMap.set(tag, {
            name: tag,
            description: `Trend based on ${f.finding_type} findings tagged "${tag}"`,
            category: f.category,
            direction: "rising",
            evidence_count: 1,
            evidence_repositories: f.repository_id ? [f.repository_id] : [],
            first_observed: f.created_at,
            last_observed: f.created_at,
            strength: "weak",
          });
        }
      }
    }

    return Array.from(trendMap.values())
      .filter((t) => t.evidence_count >= 2)
      .sort((a, b) => b.evidence_count - a.evidence_count);
  }
}
