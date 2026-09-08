import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
  const db = getDb();

  const debt = db
    .prepare(
      "SELECT * FROM technical_debt WHERE repository_id = ? ORDER BY CASE severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END",
    )
    .all(id);

  return NextResponse.json(debt);
});
