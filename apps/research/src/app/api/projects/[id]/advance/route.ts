import { NextResponse } from "next/server";
import { advanceProject } from "@/lib/data";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const updated = advanceProject(id);
  if (!updated)
    return NextResponse.json({ error: "Cannot advance" }, { status: 400 });
  return NextResponse.json(updated);
}
