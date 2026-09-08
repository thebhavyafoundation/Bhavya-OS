import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId") || "";
  const sourceType = searchParams.get("sourceType") || "";

  let query = "SELECT * FROM design_intelligence WHERE 1=1";
  const params: string[] = [];

  if (sourceId) {
    query += " AND source_id = ?";
    params.push(sourceId);
  }

  if (sourceType) {
    query += " AND source_type = ?";
    params.push(sourceType);
  }

  query += " ORDER BY analyzed_at DESC";

  const records = db.prepare(query).all(...params);

  return NextResponse.json({ records });
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

  const id = `di-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  db.prepare(
    `
    INSERT INTO design_intelligence (
      id, source_id, source_type, typography, color, spacing, imagery, surfaces,
      grid, container, section_structure, responsive_behavior,
      primary_nav, secondary_nav, contextual_nav, command_nav,
      hover, focus, scroll, transitions,
      motion_library, motion_techniques, motion_intensity,
      semantics, keyboard, contrast, reduced_motion,
      image_strategy, loading, javascript, rendering,
      extracted_pattern_ids, bhavya_relevance, recommended_use, risks, adaptation_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    source_id,
    source_type,
    JSON.stringify(body.typography || {}),
    JSON.stringify(body.color || {}),
    JSON.stringify(body.spacing || {}),
    JSON.stringify(body.imagery || {}),
    JSON.stringify(body.surfaces || {}),
    JSON.stringify(body.grid || {}),
    JSON.stringify(body.container || {}),
    JSON.stringify(body.section_structure || {}),
    JSON.stringify(body.responsive_behavior || {}),
    JSON.stringify(body.primary_nav || {}),
    JSON.stringify(body.secondary_nav || {}),
    JSON.stringify(body.contextual_nav || {}),
    JSON.stringify(body.command_nav || {}),
    JSON.stringify(body.hover || {}),
    JSON.stringify(body.focus || {}),
    JSON.stringify(body.scroll || {}),
    JSON.stringify(body.transitions || {}),
    body.motion_library || null,
    JSON.stringify(body.motion_techniques || []),
    body.motion_intensity || null,
    JSON.stringify(body.semantics || {}),
    JSON.stringify(body.keyboard || {}),
    JSON.stringify(body.contrast || {}),
    JSON.stringify(body.reduced_motion || {}),
    body.image_strategy || null,
    body.loading || null,
    body.javascript || null,
    body.rendering || null,
    JSON.stringify(body.extracted_pattern_ids || []),
    body.bhavya_relevance || null,
    body.recommended_use || null,
    JSON.stringify(body.risks || []),
    body.adaptation_notes || null,
  );

  return NextResponse.json({ id, source_id, source_type });
});
