import { NextRequest, NextResponse } from "next/server";
import { createKOFromText, createKOFromStructured } from "@/lib/ingestion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, text, domain, subject, gradeLevel, sourceType, sourceUrl } =
      body;

    if (!title || !text) {
      return NextResponse.json(
        { error: "title and text are required" },
        { status: 400 },
      );
    }

    const ko = createKOFromText({
      title,
      text,
      domain,
      subject,
      gradeLevel,
      sourceType,
      sourceUrl,
    });
    return NextResponse.json({ success: true, ko });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
