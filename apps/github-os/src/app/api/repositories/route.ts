import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const language = searchParams.get("language") || "";
  const maturity = searchParams.get("maturity") || "";
  const recommendation = searchParams.get("recommendation") || "";
  const sort = searchParams.get("sort") || "bhavya_score";

  let query = "SELECT * FROM repositories WHERE 1=1";
  const params: string[] = [];

  if (search) {
    query +=
      " AND (name LIKE ? OR description LIKE ? OR language LIKE ? OR topics LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  if (language) {
    query += " AND language = ?";
    params.push(language);
  }

  if (maturity) {
    query += " AND engineering_maturity = ?";
    params.push(maturity);
  }

  if (recommendation) {
    query += " AND recommendation_type = ?";
    params.push(recommendation);
  }

  const sortMap: Record<string, string> = {
    bhavya_score: "bhavya_score DESC",
    name: "name ASC",
    stars: "stars DESC",
    health: "health_score DESC",
    technology: "technology_score DESC",
    updated: "updated_at DESC",
  };

  query += ` ORDER BY ${sortMap[sort] || "bhavya_score DESC"}`;

  const repositories = db.prepare(query).all(...params);

  const languages = db
    .prepare(
      "SELECT DISTINCT language FROM repositories WHERE language IS NOT NULL ORDER BY language",
    )
    .all() as { language: string }[];

  const maturities = ["emerging", "developing", "mature", "exemplary"];
  const recommendations = ["adopt", "study", "reference", "monitor", "archive"];

  return NextResponse.json({
    repositories,
    filters: {
      languages: languages.map((l) => l.language),
      maturities,
      recommendations,
    },
  });
}
