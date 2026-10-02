import { NextRequest, NextResponse } from "next/server";
import { getGalleryPhoto } from "@/lib/gallery-store";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Serves a stored photo's bytes. Rows are append-only, so the response is
 * safely cacheable; ids are validated before touching the database.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json(
      { error: "Photo not found", code: "not_found" },
      { status: 404 },
    );
  }

  try {
    const photo = await getGalleryPhoto(id);
    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found", code: "not_found" },
        { status: 404 },
      );
    }

    const comma = photo.imageData.indexOf(",");
    const base64 =
      comma >= 0 ? photo.imageData.slice(comma + 1) : photo.imageData;
    const body = Buffer.from(base64, "base64");

    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": photo.mimeType,
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to serve photo", code: "serve_failed" },
      { status: 500 },
    );
  }
}
