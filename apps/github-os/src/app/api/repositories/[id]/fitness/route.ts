import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const fitness = db
    .prepare("SELECT * FROM repository_fitness WHERE repository_id = ?")
    .get(id);

  if (!fitness) {
    return NextResponse.json(
      { error: "No fitness report available" },
      { status: 404 },
    );
  }

  return NextResponse.json(fitness);
}
