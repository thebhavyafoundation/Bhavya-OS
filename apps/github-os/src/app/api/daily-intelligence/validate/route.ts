import { NextResponse } from "next/server";
import { validateConstitutionalCompliance } from "@/lib/constitutional-validation";
import { withAuth } from "@/lib/api-auth";

/**
 * GET /api/daily-intelligence/validate — Run constitutional validation
 */
export const GET = withAuth(async () => {
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
});
