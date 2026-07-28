import { NextResponse } from "next/server";
import { getForestStats } from "@/lib/data";

export async function GET() {
  const stats = getForestStats();
  return NextResponse.json(stats);
}
