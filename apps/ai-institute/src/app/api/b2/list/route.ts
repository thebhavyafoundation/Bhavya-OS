import { NextRequest, NextResponse } from "next/server";
import { listB2ObjectsServer } from "@/lib/b2/server";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, type Role } from "@/lib/roles";

const ALLOWED_PREFIXES = [
  "models/",
  "models/glb/",
  "models/gltf/",
  "textures/",
  "hdris/",
  "videos/",
];

export async function GET(request: NextRequest) {
  try {
    // Require authenticated session
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require admin role for listing
    if (!roleIsAllowed(user.role as Role, ["admin", "staff"])) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix") || "models/";
    const maxKeys = parseInt(searchParams.get("maxKeys") || "1000", 10);

    // Validate prefix to prevent directory traversal
    const isValidPrefix = ALLOWED_PREFIXES.some(p => prefix.startsWith(p)) || prefix === "";
    if (!isValidPrefix) {
      return NextResponse.json({ error: "Invalid prefix" }, { status: 400 });
    }

    // Validate maxKeys
    if (maxKeys > 10000 || maxKeys < 1) {
      return NextResponse.json({ error: "maxKeys must be between 1 and 10000" }, { status: 400 });
    }

    const objects = await listB2ObjectsServer(prefix, maxKeys);

    return NextResponse.json({
      objects,
      count: objects.length,
      prefix,
    });
  } catch (error) {
    console.error("Error listing B2 objects:", error);
    return NextResponse.json({ error: "Failed to list objects" }, { status: 500 });
  }
}