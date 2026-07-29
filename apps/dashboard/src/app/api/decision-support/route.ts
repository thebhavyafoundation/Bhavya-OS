import { NextResponse } from "next/server";
import { generateDecisionSupport } from "@bhavya/intelligence";

export async function GET() {
  const decisionSupport = generateDecisionSupport();

  return NextResponse.json({
    ...decisionSupport,
    generatedAt: new Date().toISOString(),
  });
}
