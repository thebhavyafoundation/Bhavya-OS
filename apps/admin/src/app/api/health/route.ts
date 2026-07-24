import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    services: {
      apps: 4,
      packages: 3,
      lastRelease: "v1.0.0-rc2",
    },
  });
}
