import { describe, expect, test } from "vitest";
import { servedSvgPath } from "../served-svg-path";

describe("servedSvgPath", () => {
  test("maps a repository public path to the site-root URL the app serves", () => {
    expect(
      servedSvgPath(
        "apps/ai-institute/public/diagrams/curriculum/curriculum-learning-pathway.svg",
      ),
    ).toBe("/diagrams/curriculum/curriculum-learning-pathway.svg");
  });

  test("leaves an already-rooted path unchanged", () => {
    expect(
      servedSvgPath("/diagrams/science/environmental-system.svg"),
    ).toBe("/diagrams/science/environmental-system.svg");
  });

  test("leaves an absolute URL unchanged", () => {
    expect(servedSvgPath("https://example.com/diagram.svg")).toBe(
      "https://example.com/diagram.svg",
    );
  });

  test("roots a bare relative path at the site root", () => {
    expect(servedSvgPath("diagrams/curriculum/x.svg")).toBe(
      "/diagrams/curriculum/x.svg",
    );
  });
});
