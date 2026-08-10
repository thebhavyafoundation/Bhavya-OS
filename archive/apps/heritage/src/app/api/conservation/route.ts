import { NextRequest, NextResponse } from "next/server";
import { getConservationPlans, createConservationPlan } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getConservationPlans());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const plan = createConservationPlan(data);
  return NextResponse.json(plan, { status: 201 });
}
