import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();
  const radar = db
    .prepare("SELECT * FROM technology_radar ORDER BY score DESC")
    .all();
  return NextResponse.json({ radar });
});
