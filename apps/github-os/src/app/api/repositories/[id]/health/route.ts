import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const id = request.nextUrl.pathname.split("/").at(-2)!;

  const repository = db
    .prepare("SELECT id, name, bhavya_score FROM repositories WHERE id = ?")
    .get(id);

  if (!repository) {
    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 },
    );
  }

  const health = db
    .prepare("SELECT * FROM engineering_health WHERE repository_id = ?")
    .get(id);

  if (!health) {
    return NextResponse.json({ repository, health: null });
  }

  return NextResponse.json({
    repository,
    health,
  });
});
