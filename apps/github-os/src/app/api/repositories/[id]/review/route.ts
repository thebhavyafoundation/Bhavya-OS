import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
  const db = getDb();

  const review = db
    .prepare("SELECT * FROM engineering_reviews WHERE repository_id = ?")
    .get(id);
  if (!review) {
    return NextResponse.json({ error: "No review found" }, { status: 404 });
  }

  return NextResponse.json(review);
});
