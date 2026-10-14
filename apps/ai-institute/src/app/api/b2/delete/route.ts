import { NextRequest, NextResponse } from "next/server";
import { deleteFromB2Server } from "@/lib/b2/server";
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

export async function DELETE(request: NextRequest) {
  try {
    // Require authenticated session
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require admin role for deletion
    if (!roleIsAllowed(user.role as Role, ["admin", "staff"])) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    // Validate key to prevent directory traversal
    const isValidKey = ALLOWED_PREFIXES.some(p => key.startsWith(p));
    if (!isValidKey) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    // Additional validation
    if (key.includes("..") || key.startsWith("/") || key.includes("\\")) {
      return NextResponse.json({ error: "Invalid key: traversal attempt" }, { status: 400 });
    }

    await deleteFromB2Server(key);

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error("Error deleting from B2:", error);
    return NextResponse.json({ error: "Failed to delete object" }, { status: 500 });
  }
}