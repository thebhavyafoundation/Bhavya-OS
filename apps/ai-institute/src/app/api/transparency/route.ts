import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    financials: [],
    governance: [],
    projects: [],
    policies: [],
  });
}
