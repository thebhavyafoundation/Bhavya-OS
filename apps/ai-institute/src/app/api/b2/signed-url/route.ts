import { NextRequest, NextResponse } from "next/server";
import { getB2PresignedUrl } from "@/lib/b2/client";
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

function validateKeyPrefix(key: string): boolean {
  return ALLOWED_PREFIXES.some(p => key.startsWith(p));
}

export async function GET(request: NextRequest) {
  try {
    // Require authenticated session
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require editor/admin role for generating signed URLs
    if (!roleIsAllowed(user.role as Role, ["admin", "instructor", "educator", "staff"])) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const expires = searchParams.get("expires");

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    // Validate key prefix
    if (!validateKeyPrefix(key)) {
      return NextResponse.json({ error: "Invalid key prefix" }, { status: 400 });
    }

    const expiresIn = expires ? parseInt(expires, 10) : 3600;

    // Cap expiration at 1 hour for security
    if (expiresIn > 3600) {
      return NextResponse.json({ error: "Expiration cannot exceed 3600 seconds" }, { status: 400 });
    }

    const signedUrl = await getB2PresignedUrl(key, expiresIn);
    return NextResponse.json({ url: signedUrl, expiresIn });
  } catch (error) {
    console.error("Error generating B2 signed URL:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}