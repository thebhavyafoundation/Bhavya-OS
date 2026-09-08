import { NextResponse } from "next/server";
import { seedData } from "@/lib/seed";
import { withAuth } from "@/lib/api-auth";

export const POST = withAuth(async (_request, _user) => {
  try {
    seedData();
    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
});
