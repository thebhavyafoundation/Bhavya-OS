import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();

  const library = db
    .prepare(
      "SELECT * FROM elite_engineering_library ORDER BY quality_score DESC",
    )
    .all();

  return NextResponse.json(library);
});
