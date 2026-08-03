import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const q = request.nextUrl.searchParams.get("q") || "";
    const domain = request.nextUrl.searchParams.get("domain") || "";

    if (!q && !domain) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const db = getDb();
    const conditions: string[] = [];
    const params: any[] = [];

    if (q) {
      conditions.push(
        "(title LIKE ? OR description LIKE ? OR concepts LIKE ?)",
      );
      const term = `%${q}%`;
      params.push(term, term, term);
    }
    if (domain) {
      conditions.push("domain = ?");
      params.push(domain);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = db
      .prepare(
        `SELECT * FROM knowledge_objects ${where} ORDER BY created_at DESC LIMIT 50`,
      )
      .all(...params) as any[];

    const results = rows.map((r) => ({
      packageId: r.id,
      title: r.title,
      domain: r.domain,
      subject: r.subject,
      gradeLevel: r.grade_level,
      score: q ? 1.0 : 0.5,
    }));

    return NextResponse.json({ results, query: q, total: results.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
