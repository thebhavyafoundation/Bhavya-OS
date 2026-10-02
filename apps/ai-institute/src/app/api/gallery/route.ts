import { NextResponse } from "next/server";
import { listGalleryPhotos } from "@/lib/gallery-store";

/**
 * Public gallery listing. Metadata only — image bytes are served by
 * GET /api/gallery/[id]. Photos are append-only, so this response is stable.
 */
export async function GET() {
  try {
    const photos = await listGalleryPhotos();
    return NextResponse.json(
      { photos },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to list gallery photos", code: "list_failed" },
      { status: 500 },
    );
  }
}
