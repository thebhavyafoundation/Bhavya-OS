import { NextResponse } from "next/server";
import { getKnowledgeStats } from "@/lib/data";

export async function GET() {
  const stats = getKnowledgeStats();
  return NextResponse.json(stats);
}
