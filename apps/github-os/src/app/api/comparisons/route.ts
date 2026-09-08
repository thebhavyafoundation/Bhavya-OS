import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();
  const comparisons = db
    .prepare(
      `SELECT rc.*, 
              ra.name as repo_a_name, ra.bhavya_score as repo_a_score, ra.language as repo_a_language, ra.engineering_maturity as repo_a_maturity,
              rb.name as repo_b_name, rb.bhavya_score as repo_b_score, rb.language as repo_b_language, rb.engineering_maturity as repo_b_maturity
       FROM repository_comparisons rc
       JOIN repositories ra ON rc.repo_a_id = ra.id
       JOIN repositories rb ON rc.repo_b_id = rb.id
       ORDER BY rc.created_at DESC`,
    )
    .all();

  return NextResponse.json({ comparisons });
});

export const POST = withAuth(async (request, _user) => {
  const db = getDb();
  const { repo_a_id, repo_b_id } = await request.json();

  if (!repo_a_id || !repo_b_id) {
    return NextResponse.json(
      { error: "Both repo_a_id and repo_b_id are required" },
      { status: 400 },
    );
  }

  const repoA = db
    .prepare("SELECT * FROM repositories WHERE id = ?")
    .get(repo_a_id) as Record<string, unknown> | undefined;
  const repoB = db
    .prepare("SELECT * FROM repositories WHERE id = ?")
    .get(repo_b_id) as Record<string, unknown> | undefined;

  if (!repoA || !repoB) {
    return NextResponse.json(
      { error: "One or both repositories not found" },
      { status: 404 },
    );
  }

  const existing = db
    .prepare(
      "SELECT id FROM repository_comparisons WHERE (repo_a_id = ? AND repo_b_id = ?) OR (repo_a_id = ? AND repo_b_id = ?)",
    )
    .get(repo_a_id, repo_b_id, repo_b_id, repo_a_id);

  if (existing) {
    return NextResponse.json({ comparison: existing });
  }

  const techStackA = JSON.parse(String(repoA.tech_stack || "{}"));
  const techStackB = JSON.parse(String(repoB.tech_stack || "{}"));
  const patternsA = JSON.parse(String(repoA.patterns || "[]"));
  const patternsB = JSON.parse(String(repoB.patterns || "[]"));
  const depsA = JSON.parse(String(repoA.dependencies || "[]"));
  const depsB = JSON.parse(String(repoB.dependencies || "[]"));

  const commonTech = Object.keys(techStackA).filter((k) => k in techStackB);
  const commonPatterns = patternsA.filter((p: string) => patternsB.includes(p));
  const commonDeps = depsA.filter((d: string) => depsB.includes(d));

  const comparison = {
    score_a: repoA.bhavya_score,
    score_b: repoB.bhavya_score,
    score_delta: Number(repoA.bhavya_score) - Number(repoB.bhavya_score),
    maturity_a: repoA.engineering_maturity,
    maturity_b: repoB.engineering_maturity,
    language_a: repoA.language,
    language_b: repoB.language,
    common_technology: commonTech,
    common_patterns: commonPatterns,
    common_dependencies: commonDeps,
    recommendation:
      Number(repoA.bhavya_score) > Number(repoB.bhavya_score)
        ? `${repoA.name} scores higher (${repoA.bhavya_score} vs ${repoB.bhavya_score})`
        : Number(repoB.bhavya_score) > Number(repoA.bhavya_score)
          ? `${repoB.name} scores higher (${repoB.bhavya_score} vs ${repoA.bhavya_score})`
          : "Equal scores",
  };

  const id = `cmp-${repo_a_id}-${repo_b_id}`;
  db.prepare(
    "INSERT INTO repository_comparisons (id, repo_a_id, repo_b_id, comparison) VALUES (?, ?, ?, ?)",
  ).run(id, repo_a_id, repo_b_id, JSON.stringify(comparison));

  return NextResponse.json({ comparison: { id, ...comparison } });
});
