import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const blueprints = db
    .prepare("SELECT * FROM build_blueprints WHERE repository_id = ?")
    .all(id);

  return NextResponse.json(blueprints);
}
