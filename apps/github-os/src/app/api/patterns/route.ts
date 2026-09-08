import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";

  let query = "SELECT * FROM pattern_library WHERE 1=1";
  const params: string[] = [];

  if (search) {
    query +=
      " AND (name LIKE ? OR explanation LIKE ? OR educational_value LIKE ?)";
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (difficulty) {
    query += " AND difficulty = ?";
    params.push(difficulty);
  }

  query += " ORDER BY name ASC";

  const patterns = db.prepare(query).all(...params);

  const categories = db
    .prepare("SELECT DISTINCT category FROM pattern_library ORDER BY category")
    .all() as { category: string }[];

  return NextResponse.json({
    patterns,
    filters: {
      categories: categories.map((c) => c.category),
      difficulties: ["beginner", "intermediate", "advanced", "expert"],
    },
  });
});
