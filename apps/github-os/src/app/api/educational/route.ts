import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const exportType = searchParams.get("type") || "";
  const repositoryId = searchParams.get("repository") || "";

  let query = `
    SELECT ee.*, r.name as repository_name
    FROM educational_exports ee
    LEFT JOIN repositories r ON ee.repository_id = r.id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (exportType) {
    query += " AND ee.export_type = ?";
    params.push(exportType);
  }

  if (repositoryId) {
    query += " AND ee.repository_id = ?";
    params.push(repositoryId);
  }

  query += " ORDER BY ee.created_at DESC";

  const exports = db.prepare(query).all(...params);

  const types = db
    .prepare(
      "SELECT DISTINCT export_type FROM educational_exports ORDER BY export_type",
    )
    .all() as { export_type: string }[];

  const repositories = db
    .prepare(
      "SELECT DISTINCT r.id, r.name FROM repositories r JOIN educational_exports ee ON r.id = ee.repository_id ORDER BY r.name",
    )
    .all();

  return NextResponse.json({
    exports,
    filters: {
      types: types.map((t) => t.export_type),
      repositories,
    },
  });
}
