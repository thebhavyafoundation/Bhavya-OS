import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId") || "";
  const sourceType = searchParams.get("sourceType") || "";

  let query = "SELECT * FROM design_scores WHERE 1=1";
  const params: string[] = [];

  if (sourceId) {
    query += " AND source_id = ?";
    params.push(sourceId);
  }

  if (sourceType) {
    query += " AND source_type = ?";
    params.push(sourceType);
  }

  query += " ORDER BY overall_score DESC";

  const scores = db.prepare(query).all(...params);

  return NextResponse.json({ scores });
});

export const POST = withAuth(async (request, _user) => {
  const db = getDb();
  const body = await request.json();

  const { source_id, source_type } = body;

  if (!source_id || !source_type) {
    return NextResponse.json(
      { error: "source_id and source_type are required" },
      { status: 400 },
    );
  }

  const id = `ds-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const overall = Math.round(
    ((body.institutional_relevance || 0) +
      (body.ux_quality || 0) +
      (body.accessibility || 0) +
      (body.performance || 0) +
      (body.visual_quality || 0) +
      (body.reusability || 0) +
      (body.technical_quality || 0) +
      (body.innovation || 0) +
      (body.maintainability || 0) +
      (body.bhavya_brand_compatibility || 0)) /
      10,
  );

  db.prepare(
    `
    INSERT INTO design_scores (
      id, source_id, source_type, institutional_relevance, ux_quality,
      accessibility, performance, visual_quality, reusability,
      technical_quality, innovation, maintainability,
      bhavya_brand_compatibility, overall_score, explanation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    source_id,
    source_type,
    body.institutional_relevance || 0,
    body.ux_quality || 0,
    body.accessibility || 0,
    body.performance || 0,
    body.visual_quality || 0,
    body.reusability || 0,
    body.technical_quality || 0,
    body.innovation || 0,
    body.maintainability || 0,
    body.bhavya_brand_compatibility || 0,
    overall,
    JSON.stringify(body.explanation || {}),
  );

  return NextResponse.json({ id, overall_score: overall });
});
