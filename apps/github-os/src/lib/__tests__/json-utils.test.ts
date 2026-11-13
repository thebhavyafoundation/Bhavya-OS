import { describe, it, expect } from "vitest";

import { parseJson, parseJsonArray, parseJsonObject } from "../json-utils";

/**
 * JSON parsing guards.
 *
 * Database fields hold JSON text, and a row with corrupt JSON must never
 * throw at render time — it degenerates to null/empty and the page shows
 * nothing rather than crashing.
 */

describe("parseJson", () => {
  it("parses valid JSON", () => {
    expect(parseJson('{"a":1}')).toEqual({ a: 1 });
    expect(parseJson("[1,2]")).toEqual([1, 2]);
    expect(parseJson("\"x\"")).toBe("x");
  });

  it("returns null for empty input", () => {
    expect(parseJson("")).toBeNull();
  });

  it("returns null for malformed input rather than throwing", () => {
    expect(parseJson("{not json")).toBeNull();
    expect(parseJson("[")).toBeNull();
    expect(parseJson("undefined")).toBeNull();
  });
});

describe("parseJsonArray", () => {
  it("returns the array for a JSON array", () => {
    expect(parseJsonArray('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns an empty array for a non-array JSON value", () => {
    expect(parseJsonArray('{"a":1}')).toEqual([]);
    expect(parseJsonArray("\"x\"")).toEqual([]);
    expect(parseJsonArray("42")).toEqual([]);
  });

  it("returns an empty array for malformed input", () => {
    expect(parseJsonArray("not json")).toEqual([]);
    expect(parseJsonArray("")).toEqual([]);
  });
});

describe("parseJsonObject", () => {
  it("returns the object for a JSON object", () => {
    expect(parseJsonObject('{"a":1,"b":"two"}')).toEqual({ a: 1, b: "two" });
  });

  it("returns an empty object for JSON null and for non-object JSON", () => {
    expect(parseJsonObject("null")).toEqual({});
    expect(parseJsonObject("[1,2]")).toEqual({});
    expect(parseJsonObject("\"x\"")).toEqual({});
  });

  it("returns an empty object for malformed input and for empty input", () => {
    expect(parseJsonObject("")).toEqual({});
    expect(parseJsonObject("{")).toEqual({});
  });
});
