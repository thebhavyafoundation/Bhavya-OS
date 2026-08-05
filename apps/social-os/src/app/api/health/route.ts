import { NextResponse } from "next/server";
import { getDb } from "@/lib/db.js";
import { createPostizProvider } from "@/providers/postiz.js";

export async function GET() {
  const checks: Record<string, string> = {};

  try {
    const db = getDb();
    db.prepare("SELECT 1").get();
    checks.database = "ok";
  } catch (e) {
    checks.database = "error";
  }

  const postiz = createPostizProvider();
  if (postiz) {
    try {
      await postiz.listAccounts();
      checks.postiz = "ok";
    } catch {
      checks.postiz = "configured_but_unreachable";
    }
  } else {
    checks.postiz = "not_configured";
  }

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json({
    status: allOk ? "healthy" : "degraded",
    checks,
    timestamp: new Date().toISOString(),
  });
}
