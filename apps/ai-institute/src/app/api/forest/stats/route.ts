import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalMissions: 0,
    totalSites: 0,
    totalPlantings: 0,
    totalAreaRestored: 0,
    totalPlanted: 0,
    averageSurvivalRate: 0,
    totalImpactReports: 0,
  });
}
