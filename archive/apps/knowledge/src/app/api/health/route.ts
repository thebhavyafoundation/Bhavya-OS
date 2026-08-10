import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    app: "knowledge",
    version: "0.5.0",
    timestamp: new Date().toISOString(),
  });
}
