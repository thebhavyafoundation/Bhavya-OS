import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT =
  process.env.PROJECT_ROOT || join(process.cwd(), "..", "..", "..", "..");

function countItems(file: string): number {
  try {
    const parsed = JSON.parse(readFileSync(join(ROOT, file), "utf-8")) as {
      items?: unknown[];
    };
    return Array.isArray(parsed.items) ? parsed.items.length : 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  // Real counts from the machine-readable registries. No invented numbers:
  // anything unreadable reports 0, never a placeholder.
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "0.1.0",
    inventory: {
      apps: countItems("registry/apps.json"),
      packages: countItems("registry/packages.json"),
    },
  });
}
