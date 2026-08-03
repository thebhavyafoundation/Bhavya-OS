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

  const memory = db
    .prepare(
      "SELECT * FROM institutional_memory WHERE repository_id = ? ORDER BY confidence DESC",
    )
    .all(id);

  const crossRepo = db
    .prepare(
      `
      SELECT DISTINCT r.id, r.name, r.bhavya_score, r.language, r.engineering_maturity
      FROM repositories r
      JOIN engineering_patterns ep ON r.id = ep.repository_id
      WHERE ep.pattern_name IN (
        SELECT pattern_name FROM engineering_patterns WHERE repository_id = ?
      )
      AND r.id != ?
      ORDER BY r.bhavya_score DESC
      LIMIT 5
    `,
    )
    .all(id, id);

  return NextResponse.json({
    repository,
    memory,
    crossRepo,
  });
}
