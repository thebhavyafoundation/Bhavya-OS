import { NextRequest, NextResponse } from "next/server";
import { getRecognitions, createRecognition } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getRecognitions());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const recognition = createRecognition(data);
  return NextResponse.json(recognition, { status: 201 });
}
