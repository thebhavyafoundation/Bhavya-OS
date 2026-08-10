import { NextRequest, NextResponse } from "next/server";
import {
  dbListKnowledge,
  dbCreateKnowledge,
  dbUpdateKnowledge,
  dbDeleteKnowledge,
} from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    const knowledge = await dbListKnowledge();
    return NextResponse.json(knowledge);
  } catch {
    return NextResponse.json(
      { error: "Failed to list knowledge objects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "admin" && user.role !== "instructor") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  try {
    const body = await request.json();
    if (!body.title || !body.domain) {
      return NextResponse.json(
        { error: "Title and domain are required" },
        { status: 400 },
      );
    }
    const id = `ko-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ko = await dbCreateKnowledge({
      id,
      domain: body.domain,
      title: body.title,
      description: body.description,
      grade: body.grade,
      subject: body.subject,
      concepts: body.concepts,
      definitions: body.definitions,
    });
    return NextResponse.json(ko, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create knowledge object" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "admin" && user.role !== "instructor") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    const body = await request.json();
    const ko = await dbUpdateKnowledge(id, body);
    if (!ko) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(ko);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }
    await dbDeleteKnowledge(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
