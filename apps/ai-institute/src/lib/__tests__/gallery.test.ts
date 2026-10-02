import { describe, it, expect } from "vitest";
import {
  MAX_GALLERY_BYTES,
  MAX_GALLERY_DESCRIPTION_LENGTH,
  MAX_GALLERY_TITLE_LENGTH,
  normalizeDescription,
  normalizeTitle,
  parseImagePayload,
} from "@/lib/gallery-validation";
import {
  countGalleryPhotos,
  getGalleryPhoto,
  insertGalleryPhoto,
  listGalleryPhotos,
} from "@/lib/gallery-store";

function dataUrl(mime: string, bytes: Buffer): string {
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

const PNG_BYTES = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  Buffer.alloc(64, 1),
]);
const JPEG_BYTES = Buffer.concat([
  Buffer.from([0xff, 0xd8, 0xff, 0xe0]),
  Buffer.alloc(64, 2),
]);
const WEBP_BYTES = Buffer.concat([
  Buffer.from("RIFF", "ascii"),
  Buffer.from([0x24, 0x00, 0x00, 0x00]),
  Buffer.from("WEBP", "ascii"),
  Buffer.alloc(32, 3),
]);

describe("parseImagePayload", () => {
  it("accepts well-formed PNG, JPEG and WebP payloads", () => {
    const png = parseImagePayload(dataUrl("image/png", PNG_BYTES));
    const jpeg = parseImagePayload(dataUrl("image/jpeg", JPEG_BYTES));
    const webp = parseImagePayload(dataUrl("image/webp", WEBP_BYTES));

    expect(png).toMatchObject({ ok: true, mimeType: "image/png" });
    expect(jpeg).toMatchObject({ ok: true, mimeType: "image/jpeg" });
    expect(webp).toMatchObject({ ok: true, mimeType: "image/webp" });

    if (png.ok) expect(png.byteSize).toBe(PNG_BYTES.length);
  });

  it("rejects values that are not data URLs", () => {
    expect(parseImagePayload("/tmp/photo.png")).toEqual({
      ok: false,
      reason: "not_a_data_url",
    });
    expect(parseImagePayload(undefined)).toEqual({
      ok: false,
      reason: "empty_payload",
    });
    expect(parseImagePayload("")).toEqual({
      ok: false,
      reason: "empty_payload",
    });
  });

  it("rejects declared types outside the allowed set", () => {
    const gif = dataUrl("image/gif", PNG_BYTES);
    expect(parseImagePayload(gif)).toEqual({
      ok: false,
      reason: "unsupported_type",
    });
    const html = "data:text/html;base64,PHNjcmlwdD4=";
    expect(parseImagePayload(html)).toEqual({
      ok: false,
      reason: "unsupported_type",
    });
  });

  it("rejects payloads whose bytes do not match the declared type", () => {
    const script = dataUrl("image/png", Buffer.from("not an image at all"));
    expect(parseImagePayload(script)).toEqual({
      ok: false,
      reason: "unsupported_type",
    });

    // JPEG magic bytes declared as PNG
    const swapped = dataUrl("image/png", JPEG_BYTES);
    expect(parseImagePayload(swapped)).toEqual({
      ok: false,
      reason: "unsupported_type",
    });

    // WebP magic bytes declared as JPEG
    const swappedBack = dataUrl("image/jpeg", WEBP_BYTES);
    expect(parseImagePayload(swappedBack)).toEqual({
      ok: false,
      reason: "unsupported_type",
    });
  });

  it("rejects an allowed type with an empty body", () => {
    expect(parseImagePayload("data:image/png;base64,")).toEqual({
      ok: false,
      reason: "invalid_base64",
    });
  });

  it("rejects payloads larger than the size cap before decoding", () => {
    const oversized = `data:image/png;base64,${"A".repeat(
      Math.ceil((MAX_GALLERY_BYTES * 4) / 3) + 16,
    )}`;
    expect(parseImagePayload(oversized)).toEqual({
      ok: false,
      reason: "too_large",
    });

    const oneByteOver = Buffer.concat([
      PNG_BYTES,
      Buffer.alloc(MAX_GALLERY_BYTES + 1),
    ]);
    expect(parseImagePayload(dataUrl("image/png", oneByteOver))).toEqual({
      ok: false,
      reason: "too_large",
    });
  });
});

describe("normalizeTitle", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeTitle("  Seedling   beds \n")).toBe("Seedling beds");
  });

  it("rejects empty and over-long titles", () => {
    expect(normalizeTitle("   ")).toBeNull();
    expect(normalizeTitle(42)).toBeNull();
    expect(normalizeTitle("x".repeat(MAX_GALLERY_TITLE_LENGTH + 1))).toBeNull();
    expect(normalizeTitle("x".repeat(MAX_GALLERY_TITLE_LENGTH))).toHaveLength(
      MAX_GALLERY_TITLE_LENGTH,
    );
  });
});

describe("normalizeDescription", () => {
  it("treats absent descriptions as empty strings", () => {
    expect(normalizeDescription(undefined)).toBe("");
    expect(normalizeDescription(null)).toBe("");
    expect(normalizeDescription("")).toBe("");
    expect(normalizeDescription("  Neat rows.  ")).toBe("Neat rows.");
  });

  it("rejects a present description that is too long", () => {
    expect(
      normalizeDescription("x".repeat(MAX_GALLERY_DESCRIPTION_LENGTH + 1)),
    ).toBeNull();
  });
});

describe("gallery store", () => {
  const uploadedBy = "test-user-gallery";

  it("stores, lists and reads back a photo", async () => {
    const before = await countGalleryPhotos();

    const photo = await insertGalleryPhoto({
      title: "Neat rows of seedlings",
      description: "Taken after the first monsoon rain.",
      mimeType: "image/png",
      byteSize: PNG_BYTES.length,
      imageData: dataUrl("image/png", PNG_BYTES),
      uploadedBy,
    });

    expect(photo.id).toBeTruthy();
    expect(photo.title).toBe("Neat rows of seedlings");
    expect(photo.uploadedBy).toBe(uploadedBy);

    const rows = await listGalleryPhotos();
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows[0].createdAt).toBeTruthy();
    // list responses must not carry image bytes
    expect(rows[0]).not.toHaveProperty("imageData");
    expect(await countGalleryPhotos()).toBe(before + 1);

    const full = await getGalleryPhoto(photo.id);
    expect(full?.imageData).toContain("data:image/png;base64,");
    expect(full?.byteSize).toBe(PNG_BYTES.length);
  });

  it("returns null for an unknown id", async () => {
    expect(
      await getGalleryPhoto("00000000-0000-4000-8000-000000000000"),
    ).toBeNull();
  });
});
