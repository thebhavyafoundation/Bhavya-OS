import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const { id } = params;

  const repository = db
    .prepare("SELECT * FROM repositories WHERE id = ?")
    .get(id);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 },
    );
  }

  const patterns = db
    .prepare(
      "SELECT * FROM engineering_patterns WHERE repository_id = ? ORDER BY confidence DESC",
    )
    .all(id);

  const adrs = db
    .prepare("SELECT * FROM adrs WHERE repository_id = ? ORDER BY number ASC")
    .all(id);

  const knowledge = db
    .prepare(
      "SELECT * FROM knowledge_packages WHERE repository_id = ? ORDER BY quality_score DESC",
    )
    .all(id);

  return NextResponse.json({
    repository,
    patterns,
    adrs,
    knowledge,
  });
}
