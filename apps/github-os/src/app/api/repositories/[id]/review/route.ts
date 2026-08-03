import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const review = db
    .prepare("SELECT * FROM engineering_reviews WHERE repository_id = ?")
    .get(id);
  if (!review) {
    return NextResponse.json({ error: "No review found" }, { status: 404 });
  }

  return NextResponse.json(review);
}
