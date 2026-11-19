/**
 * Ordering helpers for the tap-match widget.
 *
 * The widget is a matching exercise: a column of concepts on the left, a
 * column of definitions on the right, and the learner pairs them. The
 * definitions are shuffled so that the exercise is not a matter of reading
 * two aligned columns.
 *
 * The shuffle is the reason these helpers exist.
 *
 * The component is server-rendered and then hydrated. If the order were
 * chosen during render, the server and the browser would each pick a
 * different random order, the markup they produced would not match, and
 * React would report a hydration mismatch - error #418 - on every load
 * where the two orders differed. The order used for the first render is
 * therefore fixed here and depends on nothing that can differ between the
 * two environments. The shuffle happens afterwards, once the component is
 * mounted in the browser.
 */

export interface MatchItem {
  readonly id: string;
  readonly text: string;
  readonly match: string;
}

export interface MatchPair {
  readonly a: string;
  readonly b: string;
}

/**
 * The concepts column, in the order they were authored.
 *
 * This is the order the server renders and the order the browser must
 * reproduce during hydration.
 */
export function initialLeftItems(pairs: readonly MatchPair[]): MatchItem[] {
  return pairs.map((pair, index) => ({
    id: `l-${index}`,
    text: pair.a,
    match: pair.b,
  }));
}

/**
 * The definitions column, in the order it is first rendered.
 *
 * Deliberately deterministic: the server and the browser have to agree on
 * this order for hydration to succeed.
 */
export function initialRightItems(pairs: readonly MatchPair[]): MatchItem[] {
  return pairs.map((pair, index) => ({
    id: `r-${index}`,
    text: pair.b,
    match: pair.a,
  }));
}

/**
 * The shuffled definitions column.
 *
 * Only safe to call after the component has mounted in the browser. The
 * result is a permutation of the input: no item is lost, duplicated or
 * changed.
 */
export function shuffleRightItems(items: readonly MatchItem[]): MatchItem[] {
  return [...items].sort(() => Math.random() - 0.5);
}
