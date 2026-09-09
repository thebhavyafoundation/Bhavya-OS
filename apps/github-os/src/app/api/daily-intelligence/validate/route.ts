import { NextResponse } from "next/server";
import { validateConstitutionalCompliance } from "@/lib/constitutional-validation";

/**
 * GET /api/daily-intelligence/validate — Run constitutional validation
 */
export async function GET() {
  try {
    const result = validateConstitutionalCompliance();
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
