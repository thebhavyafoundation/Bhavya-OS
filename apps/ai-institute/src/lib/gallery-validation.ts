/**
 * AI Institute — Gallery upload validation.
 *
 * Pure functions with no framework or database imports so the rules are unit
 * tested directly. The route handler is the only caller: the browser check in
 * the upload form is a convenience, never the authority.
 */

export const MAX_GALLERY_BYTES = 750_000;
export const MAX_GALLERY_TITLE_LENGTH = 120;
export const MAX_GALLERY_DESCRIPTION_LENGTH = 500;

export const ALLOWED_IMAGE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ImageMimeType = (typeof ALLOWED_IMAGE_MIME)[number];

export type ImageParseResult =
  | {
      ok: true;
      dataUrl: string;
      mimeType: ImageMimeType;
      byteSize: number;
    }
  | { ok: false; reason: ImageRejectReason };

export type ImageRejectReason =
  | "not_a_data_url"
  | "unsupported_type"
  | "invalid_base64"
  | "too_large"
  | "empty_payload";

const DATA_URL_PATTERN =
  /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/i;

function matchesMagicBytes(mimeType: ImageMimeType, bytes: Buffer): boolean {
  if (mimeType === "image/jpeg") {
    return (
      bytes.length > 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }
  if (mimeType === "image/png") {
    return (
      bytes.length > 4 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }
  // webp: RIFF container with WEBP fourcc at offset 8
  return (
    bytes.length > 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  );
}

/**
 * Validate an uploaded image data URL.
 *
 * Order matters: cheap structural checks run before the base64 decode, and
 * the declared type must agree with the file's magic bytes so a script or a
 * text file cannot be stored as an image.
 */
export function parseImagePayload(value: unknown): ImageParseResult {
  if (typeof value !== "string" || value.length === 0) {
    return { ok: false, reason: "empty_payload" };
  }

  const match = DATA_URL_PATTERN.exec(value);
  if (!match) {
    if (/^data:image\/(jpeg|png|webp);base64,?$/i.test(value)) {
      return { ok: false, reason: "invalid_base64" };
    }
    return {
      ok: false,
      reason: value.startsWith("data:") ? "unsupported_type" : "not_a_data_url",
    };
  }

  const mimeType = match[1].toLowerCase() as ImageMimeType;
  const base64 = match[2];

  // 4/3 expansion of the decoded size; reject before allocating a buffer.
  if (base64.length > Math.ceil((MAX_GALLERY_BYTES * 4) / 3) + 4) {
    return { ok: false, reason: "too_large" };
  }

  const bytes = Buffer.from(base64, "base64");
  if (bytes.length === 0) {
    return { ok: false, reason: "empty_payload" };
  }
  if (bytes.length > MAX_GALLERY_BYTES) {
    return { ok: false, reason: "too_large" };
  }
  if (!matchesMagicBytes(mimeType, bytes)) {
    return { ok: false, reason: "unsupported_type" };
  }

  return { ok: true, dataUrl: value, mimeType, byteSize: bytes.length };
}

/** Trim and collapse whitespace; null when empty or over the limit. */
export function normalizeTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim().replace(/\s+/g, " ");
  if (!title || title.length > MAX_GALLERY_TITLE_LENGTH) return null;
  return title;
}

/**
 * Trim a description. Absent values become ""; a present value that is too
 * long comes back as null so the route can reject it instead of dropping it.
 */
export function normalizeDescription(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string") return null;
  const description = value.trim();
  if (description.length > MAX_GALLERY_DESCRIPTION_LENGTH) return null;
  return description;
}

export type GalleryRejectReason =
  "invalid_title" | "invalid_description" | ImageRejectReason;
