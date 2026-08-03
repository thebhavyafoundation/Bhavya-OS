import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { listPackages } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any)?.id;
    const packages = listPackages(userId);
    return NextResponse.json({
      packages: packages.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        version: p.version,
        domain: p.domain,
        subject: p.subject,
        grade_level: p.grade_level,
        publication_status: p.publication_status,
        immutable_hash: p.immutable_hash,
        created_at: p.created_at,
        updated_at: p.updated_at,
        lesson: p.parsed.lesson,
        assessment: p.parsed.assessment,
        teacherGuide: p.parsed.teacherGuide,
        workbook: p.parsed.workbook,
        website: p.parsed.website,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
