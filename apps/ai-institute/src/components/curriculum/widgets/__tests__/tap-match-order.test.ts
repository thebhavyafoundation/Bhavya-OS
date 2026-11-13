import { describe, it, expect, vi, afterEach } from "vitest";
import {
  initialLeftItems,
  initialRightItems,
  shuffleRightItems,
} from "../tap-match-order";

const PAIRS = [
  {
    a: "Artificial Intelligence",
    b: "The broad field of machines performing tasks that require human intelligence",
  },
  {
    a: "Machine Learning",
    b: "A subset of AI in which systems learn patterns from data",
  },
  {
    a: "Deep Learning",
    b: "Machine learning that uses neural networks with many layers",
  },
];

describe("the tap-match order", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * The property that makes hydration work: the order used for the first
   * render must not depend on anything that can differ between the server
   * and the browser.
   */
  it("renders the definitions in the same order whatever the random source does", () => {
    const random = vi.spyOn(Math, "random").mockReturnValue(0.99);
    const first = initialRightItems(PAIRS);
    random.mockReturnValue(0.01);
    const second = initialRightItems(PAIRS);

    expect(first.map((item) => item.id)).toEqual(second.map((item) => item.id));
    expect(first.map((item) => item.text)).toEqual(
      second.map((item) => item.text),
    );
  });

  it("renders the definitions in the authored order before the shuffle", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    expect(initialRightItems(PAIRS).map((item) => item.text)).toEqual(
      PAIRS.map((pair) => pair.b),
    );
  });

  it("renders the concepts in the authored order", () => {
    expect(initialLeftItems(PAIRS).map((item) => item.text)).toEqual(
      PAIRS.map((pair) => pair.a),
    );
  });

  it("pairs each concept with its definition", () => {
    const left = initialLeftItems(PAIRS);
    const right = initialRightItems(PAIRS);
    for (const item of left) {
      expect(right.map((entry) => entry.text)).toContain(item.match);
    }
  });

  /**
   * The shuffle is still there - the exercise still has to be a real
   * exercise - but it keeps every item.
   */
  it("shuffles without losing, duplicating or changing an item", () => {
    const items = initialRightItems(PAIRS);
    const shuffled = shuffleRightItems(items);

    expect(shuffled).toHaveLength(items.length);
    expect(shuffled.map((item) => item.id).sort()).toEqual(
      items.map((item) => item.id).sort(),
    );
    for (const item of shuffled) {
      expect(items.find((entry) => entry.id === item.id)).toEqual(item);
    }
  });

  it("does not change the array it was given", () => {
    const items = initialRightItems(PAIRS);
    const before = items.map((item) => item.id);
    shuffleRightItems(items);
    expect(items.map((item) => item.id)).toEqual(before);
  });
});
