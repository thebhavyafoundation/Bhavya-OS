import { NextResponse } from "next/server";
import { getHeritageStats } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getHeritageStats());
}
