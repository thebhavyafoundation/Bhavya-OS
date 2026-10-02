import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  roleIsAllowed,
  CONTENT_MANAGEMENT_ROLES,
  type Role,
} from "@/lib/roles";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { recordAuditEvent } from "@/lib/audit-repository";
import {
  normalizeDescription,
  normalizeTitle,
  parseImagePayload,
  type GalleryRejectReason,
} from "@/lib/gallery-validation";
import { insertGalleryPhoto, listGalleryPhotos } from "@/lib/gallery-store";

const REJECT_MESSAGES: Record<GalleryRejectReason, string> = {
  invalid_title: "A title of 120 characters or fewer is required",
  invalid_description: "Descriptions must be 500 characters or fewer",
  not_a_data_url: "The image must be uploaded as a data URL",
  unsupported_type: "Only JPEG, PNG and WebP images are accepted",
  invalid_base64: "The image payload is not valid base64",
  too_large: "The image must be 750 KB or smaller",
  empty_payload: "The image payload is empty",
};

function statusFor(reason: GalleryRejectReason): number {
  if (reason === "too_large") return 413;
  if (reason === "unsupported_type") return 415;
  return 400;
}

function jsonError(error: string, code: string, status: number) {
  return NextResponse.json({ error, code }, { status });
}

async function authorize(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user)
    return { error: jsonError("Authentication required", "unauthorized", 401) };
  if (!roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
    return { error: jsonError("Insufficient permissions", "forbidden", 403) };
  }
  return { user };
}

export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;

  try {
    const photos = await listGalleryPhotos();
    return NextResponse.json({ photos });
  } catch {
    return jsonError("Failed to list gallery photos", "list_failed", 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (auth.error) return auth.error;
  const user = auth.user;

  const limit = checkRateLimit(
    `gallery-upload:${user.id}`,
    RateLimits.galleryUpload,
  );
  if (limit.limited) {
    return jsonError("Too many uploads", "rate_limited", 429);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null) throw new Error("shape");
    body = parsed as Record<string, unknown>;
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  const title = normalizeTitle(body.title);
  if (!title) {
    return jsonError(REJECT_MESSAGES.invalid_title, "invalid_title", 400);
  }

  const description = normalizeDescription(body.description);
  if (description === null) {
    return jsonError(
      REJECT_MESSAGES.invalid_description,
      "invalid_description",
      400,
    );
  }

  const image = parseImagePayload(body.image);
  if (!image.ok) {
    return jsonError(
      REJECT_MESSAGES[image.reason],
      image.reason,
      statusFor(image.reason),
    );
  }

  try {
    const photo = await insertGalleryPhoto({
      title,
      description,
      mimeType: image.mimeType,
      byteSize: image.byteSize,
      imageData: image.dataUrl,
      uploadedBy: user.id,
    });

    await recordAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: "gallery.upload",
      resource: "gallery_photo",
      resourceId: photo.id,
      result: "success",
      metadata: { title: photo.title, byteSize: photo.byteSize },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch {
    return jsonError("Failed to store the photo", "store_failed", 500);
  }
}
