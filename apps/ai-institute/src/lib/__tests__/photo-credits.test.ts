import { describe, it, expect } from "vitest";
import { photoCredit, PHOTO_CREDITS } from "../photo-credits";
import { PHOTO } from "../photos";

// D4: credits carry author + license only. These tokens must never appear.
const PLACE_TOKENS =
  /uttarakhand|garhwal|himachal|shimla|himalaya|churdhar|ransi|shirgul|india/i;

describe("photo credits (D4)", () => {
  it("covers every wired PHOTO key", () => {
    for (const key of Object.keys(PHOTO)) {
      expect(PHOTO_CREDITS[key as keyof typeof PHOTO]).toBeDefined();
    }
  });

  it("credit strings carry author and license, no place names", () => {
    for (const key of Object.keys(PHOTO)) {
      const credit = photoCredit(key as keyof typeof PHOTO);
      expect(credit).toContain("Photo ·");
      expect(credit).not.toMatch(PLACE_TOKENS);
      expect(
        PHOTO_CREDITS[key as keyof typeof PHOTO].author.length,
      ).toBeGreaterThan(0);
      expect(
        PHOTO_CREDITS[key as keyof typeof PHOTO].license.length,
      ).toBeGreaterThan(0);
    }
  });

  it("no credit author or license contains a place name", () => {
    for (const c of Object.values(PHOTO_CREDITS)) {
      expect(`${c.author} ${c.license}`).not.toMatch(PLACE_TOKENS);
    }
  });
});
