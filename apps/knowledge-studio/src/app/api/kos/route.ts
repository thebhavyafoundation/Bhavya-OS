import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listKOs } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    const kos = listKOs(userId || undefined);
    return NextResponse.json({
      kos: kos.map((ko) => ({
        id: ko.id,
        title: ko.title,
        domain: ko.domain,
        subject: ko.subject,
        grade_level: ko.grade_level,
        description: ko.description,
        source_type: ko.source_type,
        status: ko.status,
        concepts: ko.parsed.concepts,
        created_at: ko.created_at,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
