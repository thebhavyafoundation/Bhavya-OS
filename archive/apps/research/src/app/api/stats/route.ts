import { NextResponse } from "next/server";
import { getResearchStats } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getResearchStats());
}
