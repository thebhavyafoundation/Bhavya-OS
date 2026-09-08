import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const framework = searchParams.get("framework") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "bhavya_relevance_score";

  let query = "SELECT * FROM website_intelligence WHERE 1=1";
  const params: string[] = [];

  if (search) {
    query +=
      " AND (name LIKE ? OR description LIKE ? OR source_url LIKE ? OR framework LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (framework) {
    query += " AND framework = ?";
    params.push(framework);
  }

  if (category) {
    query += " AND json_extract(provenance, '$.category') = ?";
    params.push(category);
  }

  const sortMap: Record<string, string> = {
    bhavya_relevance_score: "bhavya_relevance_score DESC",
    quality_score: "quality_score DESC",
    name: "name ASC",
    analyzed: "analyzed_at DESC",
  };

  query += ` ORDER BY ${sortMap[sort] || "bhavya_relevance_score DESC"}`;

  const websites = db.prepare(query).all(...params);

  const frameworks = db
    .prepare(
      "SELECT DISTINCT framework FROM website_intelligence WHERE framework IS NOT NULL ORDER BY framework",
    )
    .all() as { framework: string }[];

  return NextResponse.json({
    websites,
    filters: {
      frameworks: frameworks.map((f) => f.framework),
    },
  });
});

export const POST = withAuth(async (request, _user) => {
  const db = getDb();
  const body = await request.json();

  const {
    source_url,
    repository_id,
    name,
    description,
    framework,
    runtime,
    design_system,
    component_system,
    layout_system,
    navigation_architecture,
    typography,
    color_system,
    spacing_system,
    motion_system,
    interaction_patterns,
    responsive_patterns,
    accessibility_characteristics,
    performance_observations,
    seo_observations,
    screenshots,
    extracted_pattern_ids,
    bhavya_relevance_score,
    quality_score,
    provenance,
  } = body;

  if (!source_url || !name) {
    return NextResponse.json(
      { error: "source_url and name are required" },
      { status: 400 },
    );
  }

  const id = `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  db.prepare(
    `
    INSERT INTO website_intelligence (
      id, source_url, repository_id, name, description, framework, runtime,
      design_system, component_system, layout_system, navigation_architecture,
      typography, color_system, spacing_system, motion_system,
      interaction_patterns, responsive_patterns, accessibility_characteristics,
      performance_observations, seo_observations, screenshots,
      extracted_pattern_ids, bhavya_relevance_score, quality_score, provenance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    source_url,
    repository_id || null,
    name,
    description || null,
    framework || null,
    runtime || null,
    design_system || null,
    component_system || null,
    layout_system || null,
    navigation_architecture || null,
    typography || null,
    color_system || null,
    spacing_system || null,
    motion_system || null,
    JSON.stringify(interaction_patterns || []),
    JSON.stringify(responsive_patterns || []),
    JSON.stringify(accessibility_characteristics || {}),
    JSON.stringify(performance_observations || {}),
    JSON.stringify(seo_observations || {}),
    JSON.stringify(screenshots || []),
    JSON.stringify(extracted_pattern_ids || []),
    bhavya_relevance_score || 0,
    quality_score || 0,
    JSON.stringify(provenance || {}),
  );

  return NextResponse.json({ id, source_url, name });
});
