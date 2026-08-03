import { NextRequest, NextResponse } from "next/server";
import { getPendingApprovals, approve, deny } from "@/lib/engine";

export async function GET() {
  const pending = getPendingApprovals();
  return NextResponse.json({ ok: true, approvals: pending });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, action, approvedBy, reason } = body;

  if (action === "approve") {
    approve(id, approvedBy || "human");
    return NextResponse.json({ ok: true });
  }
  if (action === "deny") {
    deny(id, approvedBy || "human", reason || "No reason provided");
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { ok: false, error: "Invalid action" },
    { status: 400 },
  );
}
