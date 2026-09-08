import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (_request, _user) => {
  const db = getDb();
  const recommendations = db
    .prepare("SELECT * FROM recommendations ORDER BY created_at DESC")
    .all();
  return NextResponse.json({ recommendations });
});
