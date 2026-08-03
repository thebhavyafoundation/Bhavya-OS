import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const { id } = params;

  const repository = db
    .prepare("SELECT id, name, bhavya_score FROM repositories WHERE id = ?")
    .get(id);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 },
    );
  }

  const health = db
    .prepare("SELECT * FROM engineering_health WHERE repository_id = ?")
    .get(id);

  if (!health) {
    return NextResponse.json({ repository, health: null });
  }

  return NextResponse.json({
    repository,
    health,
  });
}
