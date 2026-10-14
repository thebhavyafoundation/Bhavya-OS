import { NextRequest, NextResponse } from "next/server";
import { uploadToB2Server } from "@/lib/b2/server";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, type Role } from "@/lib/roles";

const ALLOWED_PATHS = [
  "models/",
  "models/glb/",
  "models/gltf/",
  "textures/",
  "hdris/",
  "videos/",
];

const ALLOWED_TYPES: Record<string, string[]> = {
  "models/": ["model/gltf-binary", "model/gltf+json"],
  "models/glb/": ["model/gltf-binary"],
  "models/gltf/": ["model/gltf+json"],
  "textures/": ["image/png", "image/jpeg", "image/webp", "image/exr", "image/hdr"],
  "hdris/": ["image/exr", "image/hdr"],
  "videos/": ["video/mp4", "video/webm"],
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request: NextRequest) {
  try {
    // Require authenticated session
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Require editor/admin role for uploads
    if (!roleIsAllowed(user.role as Role, ["admin", "instructor", "educator", "staff"])) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;
    const metadataString = formData.get("metadata") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
    }

    // Validate path to prevent directory traversal
    const isValidPath = ALLOWED_PATHS.some(p => path.startsWith(p));
    if (!isValidPath) {
      return NextResponse.json(
        { error: "Invalid path. Allowed: models/, models/glb/, models/gltf/, textures/, hdris/, videos/" },
        { status: 400 }
      );
    }

    // Validate file type based on path
    const allowedTypesForPath = ALLOWED_TYPES[path];
    if (allowedTypesForPath && !allowedTypesForPath.includes(file.type)) {
      return NextResponse.json({
        error: `Invalid file type for ${path}. Allowed: ${allowedTypesForPath.join(", ")}`
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const filename = file.name;
    const key = `${path}${filename}`;

    // Additional key validation - prevent traversal
    if (key.includes("..") || key.startsWith("/") || key.includes("\\")) {
      return NextResponse.json({ error: "Invalid key: traversal attempt" }, { status: 400 });
    }

    let fileMetadata: Record<string, string> = {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.id,
    };

    if (metadataString) {
      try {
        const parsed = JSON.parse(metadataString);
        fileMetadata = { ...fileMetadata, ...parsed };
      } catch {
        // Ignore invalid metadata JSON
      }
    }

    const result = await uploadToB2Server({
      key,
      body: file,
      contentType: file.type,
      metadata: fileMetadata,
      cacheControl: "public, max-age=31536000, immutable",
    });

    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.publicUrl,
      size: result.size,
      etag: result.etag,
    });
  } catch (error) {
    console.error("Error uploading to B2:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}