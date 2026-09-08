import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();
  const activities = db
    .prepare("SELECT * FROM activity_events ORDER BY created_at DESC LIMIT 20")
    .all();

  return NextResponse.json({ activities });
});
