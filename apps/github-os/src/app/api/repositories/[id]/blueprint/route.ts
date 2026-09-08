import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
  const db = getDb();

  const blueprints = db
    .prepare("SELECT * FROM build_blueprints WHERE repository_id = ?")
    .all(id);

  return NextResponse.json(blueprints);
});
