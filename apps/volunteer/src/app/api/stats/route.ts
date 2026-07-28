import { NextResponse } from "next/server";
import { getVolunteerStats } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getVolunteerStats());
}
