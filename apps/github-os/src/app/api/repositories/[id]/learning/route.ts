import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const { id } = params;

  const repository = db
    .prepare(
      "SELECT id, name, description, learning_difficulty, why_bhavya_cares FROM repositories WHERE id = ?",
    )
    .get(id);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 },
    );
  }

  const learningPath = db
    .prepare("SELECT * FROM learning_paths WHERE repository_id = ?")
    .get(id);

  const health = db
    .prepare(
      "SELECT overall_score, educational_completeness_score FROM engineering_health WHERE repository_id = ?",
    )
    .get(id);

  const knowledge = db
    .prepare(
      "SELECT id, category, title, quality_score FROM knowledge_packages WHERE repository_id = ? ORDER BY quality_score DESC",
    )
    .all(id);

  const patterns = db
    .prepare(
      "SELECT pattern_name, confidence FROM engineering_patterns WHERE repository_id = ? ORDER BY confidence DESC",
    )
    .all(id);

  const exports = db
    .prepare(
      "SELECT id, export_type, title, metadata FROM educational_exports WHERE repository_id = ?",
    )
    .all(id);

  return NextResponse.json({
    repository,
    learningPath,
    health,
    knowledge,
    patterns,
    exports,
  });
}
