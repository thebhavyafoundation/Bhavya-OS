import { NextRequest, NextResponse } from "next/server";
import { getPendingApprovals, approve, deny } from "@/lib/engine";
import { requireOperator, requireAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuthenticated(req);
  if (auth.error) return auth.error;

  const pending = getPendingApprovals();
  return NextResponse.json({ ok: true, approvals: pending });
}

export async function PUT(req: NextRequest) {
  const auth = await requireOperator(req);
  if (auth.error) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const { id, action, approvedBy, reason } = body as {
    id?: string;
    action?: string;
    approvedBy?: string;
    reason?: string;
  };

  if (!id || !action) {
    return NextResponse.json(
      { ok: false, error: "id and action are required" },
      { status: 400 },
    );
  }

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
