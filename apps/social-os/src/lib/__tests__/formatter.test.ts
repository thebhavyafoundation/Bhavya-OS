import { describe, it, expect } from "vitest";

import {
  formatForPlatform,
  formatForAllPlatforms,
  extractHashtags,
  addHashtags,
} from "../formatter";

/**
 * Platform-formatting guards.
 *
 * These helpers decide what real published posts look like — if the truncation
 * rules or the hashtag strategies drift, a post goes out over-limit or with the
 * wrong tag count on a live platform.
 */

describe("formatForPlatform", () => {
  it("leaves the website text unchanged and unlimited", () => {
    const long = "A".repeat(20000);
    const result = formatForPlatform(long, "website", ["bhavya"]);
    expect(result.text).toBe(long);
    expect(result.isWithinLimits).toBe(true);
  });

  it("truncates an X post to 280 characters, ending with an ellipsis", () => {
    const long = "A".repeat(400);
    const result = formatForPlatform(long, "x");
    expect(result.text.length).toBe(280);
    expect(result.text.endsWith("...")).toBe(true);
    expect(result.isWithinLimits).toBe(true);
  });

  it("truncates a LinkedIn post to 3000 characters, ending with an ellipsis", () => {
    const long = "A".repeat(4000);
    const result = formatForPlatform(long, "linkedin");
    expect(result.text.length).toBe(3000);
    expect(result.text.endsWith("...")).toBe(true);
  });

  it("truncates a Discord post to 2000 characters", () => {
    const long = "A".repeat(2500);
    const result = formatForPlatform(long, "discord");
    expect(result.text.length).toBe(2000);
    expect(result.text.endsWith("...")).toBe(true);
  });

  it("limits X to 3 hashtags, LinkedIn to 5, and strips them for GitHub", () => {
    const tags = ["a", "b", "c", "d", "e", "f", "g"];
    expect(formatForPlatform("content", "x", tags).hashtags).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(formatForPlatform("content", "linkedin", tags).hashtags).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);
    expect(formatForPlatform("content", "github", tags).hashtags).toEqual([]);
  });

  it("keeps content under the limit with no truncation needed", () => {
    const result = formatForPlatform("short post", "x");
    expect(result.text).toBe("short post");
    expect(result.isWithinLimits).toBe(true);
    expect(result.characterCount).toBe("short post".length);
  });
});

describe("formatForAllPlatforms", () => {
  it("produces a result for each requested platform", () => {
    const result = formatForAllPlatforms("hello", ["x", "linkedin", "github"], [
      "one",
      "two",
    ]);
    expect(Object.keys(result).sort()).toEqual(["github", "linkedin", "x"]);
    expect(result.github.platform).toBe("github");
    expect(result.x.platform).toBe("x");
  });
});

describe("extractHashtags", () => {
  it("extracts tags without the hash", () => {
    expect(extractHashtags("reading #ethics and #governance today")).toEqual([
      "ethics",
      "governance",
    ]);
  });

  it("returns an empty list when there are no hashtags", () => {
    expect(extractHashtags("no tags here")).toEqual([]);
  });
});

describe("addHashtags", () => {
  it("returns the content unchanged when there are no hashtags", () => {
    expect(addHashtags("text", [])).toBe("text");
  });

  it("appends hashtags on their own line, each prefixed with #", () => {
    expect(addHashtags("text", ["ethics", "governance"])).toBe(
      "text\n\n#ethics #governance",
    );
  });
});
