/**
 * Shared types for the component proof fixture.
 *
 * The fixture is a browser surface that records what a person (or a test)
 * actually did, so the assertions can be made against evidence rather than
 * against the presence of an element.
 */

export interface ProofClick {
  /** id of the closest element carrying an id or an aria-label. */
  id: string;
  /** aria-label of the closest labelled element, or its trimmed text. */
  label: string;
}

export interface ProofTransition {
  surface: "dialog" | "sheet";
  open: boolean;
}

export interface ProofRecord {
  clicks: ProofClick[];
  transitions: ProofTransition[];
  unmount: () => void;
  remount: () => void;
}

declare global {
  interface Window {
    __proof?: ProofRecord;
  }
}
