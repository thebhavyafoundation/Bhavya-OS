import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "docs",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "0.9.0",
    uptime: process.uptime(),
  });
}
