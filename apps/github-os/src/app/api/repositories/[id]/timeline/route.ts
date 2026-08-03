import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const { id } = params;

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
}
