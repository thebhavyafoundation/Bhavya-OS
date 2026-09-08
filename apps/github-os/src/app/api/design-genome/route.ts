import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";
  const mission = searchParams.get("mission") || "";
  const sort = searchParams.get("sort") || "avg_bhavya_relevance";

  let query = "SELECT * FROM design_genome WHERE 1=1";
  const params: string[] = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (mission) {
    query += " AND recommended_for LIKE ?";
    params.push(`%${mission}%`);
  }

  const sortMap: Record<string, string> = {
    avg_bhavya_relevance: "avg_bhavya_relevance DESC",
    avg_quality_score: "avg_quality_score DESC",
    frequency: "frequency DESC",
    pattern_name: "pattern_name ASC",
  };

  query += ` ORDER BY ${sortMap[sort] || "avg_bhavya_relevance DESC"}`;

  const genome = db.prepare(query).all(...params);

  const categories = db
    .prepare("SELECT DISTINCT category FROM design_genome ORDER BY category")
    .all() as { category: string }[];

  return NextResponse.json({
    genome,
    filters: {
      categories: categories.map((c) => c.category),
    },
  });
});

export const POST = withAuth(async (request, _user) => {
  const db = getDb();
  const body = await request.json();

  const {
    category,
    pattern_name,
    frequency,
    avg_quality_score,
    avg_bhavya_relevance,
    source_ids,
    mission_relevance,
    accessibility_rating,
    performance_rating,
    mobile_rating,
    institutional_fit,
    recommended_for,
    evidence,
  } = body;

  if (!category || !pattern_name) {
    return NextResponse.json(
      { error: "category and pattern_name are required" },
      { status: 400 },
    );
  }

  const existing = db
    .prepare(
      "SELECT id FROM design_genome WHERE category = ? AND pattern_name = ?",
    )
    .get(category, pattern_name) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      `
      UPDATE design_genome SET
        frequency = ?,
        avg_quality_score = ?,
        avg_bhavya_relevance = ?,
        source_ids = ?,
        mission_relevance = ?,
        accessibility_rating = ?,
        performance_rating = ?,
        mobile_rating = ?,
        institutional_fit = ?,
        recommended_for = ?,
        evidence = ?,
        calculated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    ).run(
      frequency || 1,
      avg_quality_score || 0,
      avg_bhavya_relevance || 0,
      JSON.stringify(source_ids || []),
      JSON.stringify(mission_relevance || {}),
      accessibility_rating || "unknown",
      performance_rating || "unknown",
      mobile_rating || "unknown",
      institutional_fit || "unknown",
      JSON.stringify(recommended_for || []),
      evidence || null,
      existing.id,
    );

    return NextResponse.json({ id: existing.id, updated: true });
  }

  const id = `dg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  db.prepare(
    `
    INSERT INTO design_genome (
      id, category, pattern_name, frequency, avg_quality_score,
      avg_bhavya_relevance, source_ids, mission_relevance,
      accessibility_rating, performance_rating, mobile_rating,
      institutional_fit, recommended_for, evidence
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    category,
    pattern_name,
    frequency || 1,
    avg_quality_score || 0,
    avg_bhavya_relevance || 0,
    JSON.stringify(source_ids || []),
    JSON.stringify(mission_relevance || {}),
    accessibility_rating || "unknown",
    performance_rating || "unknown",
    mobile_rating || "unknown",
    institutional_fit || "unknown",
    JSON.stringify(recommended_for || []),
    evidence || null,
  );

  return NextResponse.json({ id, created: true });
});
