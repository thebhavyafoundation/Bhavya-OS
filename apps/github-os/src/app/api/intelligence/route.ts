import { NextResponse } from "next/server";
import { IntelligenceEngine } from "@/lib/intelligence-engine";
import { withAuth } from "@/lib/api-auth";

/**
 * POST /api/intelligence — Run the Git OS intelligence pipeline
 *
 * Body:
 * {
 *   "action": "discover" | "analyze" | "discover-and-analyze",
 *   "query"?: string,
 *   "language"?: string,
 *   "topic"?: string,
 *   "minStars"?: number,
 *   "maxStars"?: number,
 *   "sort"?: "stars" | "updated" | "created",
 *   "limit"?: number,
 *   "repo"?: string  // for single-repo analysis: "owner/name"
 * }
 */
export const POST = withAuth(async (request, _user) => {
  try {
    const body = await request.json();
    const {
      action,
      query,
      language,
      topic,
      minStars,
      maxStars,
      sort,
      limit,
      repo,
    } = body;

    // GitHub token from environment (optional — unauthenticated has lower rate limits)
    const githubToken = process.env.GITHUB_TOKEN;

    const engine = new IntelligenceEngine(githubToken);

    switch (action) {
      case "discover": {
        const repos = await engine.discover({
          query,
          language,
          topic,
          minStars,
          maxStars,
          sort,
          limit,
        });
        return NextResponse.json({
          success: true,
          count: repos.length,
          repositories: repos,
        });
      }

      case "analyze": {
        if (!repo) {
          return NextResponse.json(
            { error: "repo field required for single analysis (owner/name)" },
            { status: 400 },
          );
        }

        const [owner, name] = repo.split("/");
        if (!owner || !name) {
          return NextResponse.json(
            { error: "repo must be in owner/name format" },
            { status: 400 },
          );
        }

        // First discover the repo to get metadata
        const discovered = await engine.discover({
          query: repo,
          limit: 1,
        });

        const target = discovered.find((r) => r.fullName === repo);
        if (!target) {
          // Try direct lookup via the engine's discover with specific query
          const directRepos = await engine.discover({
            query: `${repo} in:name`,
            limit: 5,
          });
          const directRepo =
            directRepos.find((r) => r.fullName === repo) || null;
          if (!directRepo) {
            return NextResponse.json(
              { error: `Repository ${repo} not found` },
              { status: 404 },
            );
          }
          const analysis = await engine.analyzeRepository(directRepo);
          const storedId = engine.storeAnalysis(directRepo, analysis);
          return NextResponse.json({
            success: true,
            repositoryId: storedId,
            analysis,
          });
        }

        const analysis = await engine.analyzeRepository(target);
        const storedId = engine.storeAnalysis(target, analysis);
        return NextResponse.json({
          success: true,
          repositoryId: storedId,
          analysis,
        });
      }

      case "discover-and-analyze": {
        const result = await engine.discoverAndAnalyze({
          query,
          language,
          topic,
          minStars,
          maxStars,
          sort,
          limit: limit || 10,
        });
        return NextResponse.json({
          success: true,
          discovered: result.discovered,
          analyzed: result.analyzed,
          errors: result.errors,
          results: result.results.map((r) => ({
            repository: r.provenance.repository,
            scores: r.scores,
            recommendation: r.recommendation,
            skills: r.skills.length,
            patterns: r.patterns.length,
          })),
        });
      }

      default:
        return NextResponse.json(
          {
            error:
              "action must be one of: discover, analyze, discover-and-analyze",
          },
          { status: 400 },
        );
    }
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
});

/**
 * GET /api/intelligence — Get intelligence pipeline status and stats
 */
export const GET = withAuth(async (_request, _user) => {
  try {
    const { getDb } = await import("@/lib/db");
    const db = getDb();

    const repoCount = db
      .prepare("SELECT COUNT(*) as count FROM repositories")
      .get() as { count: number };

    const graphNodeCount = db
      .prepare("SELECT COUNT(*) as count FROM knowledge_graph_nodes")
      .get() as { count: number };

    const graphEdgeCount = db
      .prepare("SELECT COUNT(*) as count FROM knowledge_graph_edges")
      .get() as { count: number };

    const activityCount = db
      .prepare("SELECT COUNT(*) as count FROM activity_events")
      .get() as { count: number };

    const patternCount = db
      .prepare("SELECT COUNT(*) as count FROM engineering_patterns")
      .get() as { count: number };

    const latestActivity = db
      .prepare("SELECT * FROM activity_events ORDER BY created_at DESC LIMIT 5")
      .all();

    return NextResponse.json({
      success: true,
      engine: "Git OS Intelligence Engine v1.0.0",
      status: "operational",
      stats: {
        repositories: repoCount.count,
        knowledgeGraphNodes: graphNodeCount.count,
        knowledgeGraphEdges: graphEdgeCount.count,
        activities: activityCount.count,
        patterns: patternCount.count,
      },
      latestActivity,
      capabilities: [
        "Repository Discovery (GitHub API)",
        "Repository Ingestion (metadata, README, structure)",
        "Repository Inspection (structure, deps, CI, tests)",
        "License Intelligence (SPDX detection, compatibility)",
        "Security Assessment (pattern detection, credential scanning)",
        "Quality Scoring (health, technology, Bhavya relevance)",
        "Skill Extraction (testing, CI/CD, TypeScript, monorepo)",
        "Pattern Extraction (architectural, operational, creational)",
        "Recommendation Engine (adopt/study/reference/monitor/archive)",
        "Knowledge Graph Construction",
        "Provenance Tracking",
        "Database Persistence",
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
});
