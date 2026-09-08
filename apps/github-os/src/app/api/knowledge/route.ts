import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();
  const packages = db
    .prepare(
      "SELECT id, title, category, quality_score FROM knowledge_packages ORDER BY created_at DESC LIMIT 10",
    )
    .all();

  return NextResponse.json({ packages });
});
