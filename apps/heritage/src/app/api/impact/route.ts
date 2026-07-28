import { NextRequest, NextResponse } from "next/server";
import { getHeritageImpactReports, createHeritageImpact } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getHeritageImpactReports());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const report = createHeritageImpact(data);
  return NextResponse.json(report, { status: 201 });
}
