import { NextRequest, NextResponse } from "next/server";
import { getTrainings, createTraining } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getTrainings());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const training = createTraining(data);
  return NextResponse.json(training, { status: 201 });
}
