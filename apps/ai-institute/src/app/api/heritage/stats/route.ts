import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalMissions: 0,
    totalAssets: 0,
    totalAssessments: 0,
    totalConservationPlans: 0,
  });
}
