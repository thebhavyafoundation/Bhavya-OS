import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const db = getDb();
  const results: {
    id: string;
    type: string;
    title: string;
    description: string;
  }[] = [];

  const repos = db
    .prepare(
      "SELECT id, name, description FROM repositories WHERE name LIKE ? OR description LIKE ? LIMIT 5",
    )
    .all(`%${query}%`, `%${query}%`) as {
    id: string;
    name: string;
    description: string | null;
  }[];

  for (const repo of repos) {
    results.push({
      id: repo.id,
      type: "repository",
      title: repo.name,
      description: repo.description || "Repository",
    });
  }

  const kps = db
    .prepare(
      "SELECT id, title, category FROM knowledge_packages WHERE title LIKE ? OR content LIKE ? LIMIT 5",
    )
    .all(`%${query}%`, `%${query}%`) as {
    id: string;
    title: string;
    category: string;
  }[];

  for (const kp of kps) {
    results.push({
      id: kp.id,
      type: "knowledge",
      title: kp.title,
      description: `Knowledge Package — ${kp.category}`,
    });
  }

  return NextResponse.json({ results });
});
