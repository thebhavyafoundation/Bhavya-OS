import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const id = request.nextUrl.pathname.split("/").at(-2)!;

  const repository = db
    .prepare("SELECT id, name FROM repositories WHERE id = ?")
    .get(id);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 },
    );
  }

  const timeline = db
    .prepare(
      "SELECT * FROM repository_timelines WHERE repository_id = ? ORDER BY event_date DESC",
    )
    .all(id);

  return NextResponse.json({
    repository,
    timeline,
  });
});
