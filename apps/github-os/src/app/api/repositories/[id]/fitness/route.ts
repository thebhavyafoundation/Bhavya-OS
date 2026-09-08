import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
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
});
