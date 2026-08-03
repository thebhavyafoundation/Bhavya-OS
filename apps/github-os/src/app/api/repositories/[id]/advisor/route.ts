import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const repo = db.prepare("SELECT * FROM repositories WHERE id = ?").get(id);
  if (!repo) {
    return NextResponse.json(
      { error: "Repository not found" },
      { status: 404 },
    );
  }

  const review = db
    .prepare("SELECT * FROM engineering_reviews WHERE repository_id = ?")
    .get(id);
  const debt = db
    .prepare("SELECT * FROM technical_debt WHERE repository_id = ?")
    .all(id);
  const fitness = db
    .prepare("SELECT * FROM repository_fitness WHERE repository_id = ?")
    .get(id);
  const knowledgePackages = db
    .prepare("SELECT * FROM knowledge_packages WHERE repository_id = ?")
    .all(id);
  const patterns = db
    .prepare("SELECT * FROM engineering_patterns WHERE repository_id = ?")
    .all(id);

  const advisor = {
    repository: repo,
    review,
    debt,
    fitness,
    knowledge_packages: knowledgePackages,
    patterns,
    strengths: review
      ? JSON.parse((review as Record<string, string>).strengths || "[]")
      : [],
    weaknesses: review
      ? JSON.parse((review as Record<string, string>).weaknesses || "[]")
      : [],
    missingPatterns: review
      ? JSON.parse((review as Record<string, string>).missing_patterns || "[]")
      : [],
    recommendations: review
      ? JSON.parse((review as Record<string, string>).recommendations || "[]")
      : [],
    verdict:
      (review as Record<string, string>)?.verdict || "No review available",
  };

  return NextResponse.json(advisor);
}
