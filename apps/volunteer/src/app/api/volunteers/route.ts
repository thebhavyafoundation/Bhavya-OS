import { NextRequest, NextResponse } from "next/server";
import { getVolunteers, createVolunteer } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getVolunteers());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const volunteer = createVolunteer(data);
  return NextResponse.json(volunteer, { status: 201 });
}
