import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const advisors = db
    .prepare("SELECT * FROM architecture_advisor WHERE repository_id = ?")
    .all(id);

  return NextResponse.json(advisors);
}
