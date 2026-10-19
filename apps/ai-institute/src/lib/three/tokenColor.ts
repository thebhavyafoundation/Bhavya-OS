import * as THREE from "three";

/**
 * Read a canonical token as a Three colour.
 *
 * 3D materials sit outside the CSS cascade, so a Tailwind class cannot reach
 * them — the token has to be resolved by name. Reading the custom property is
 * what keeps the palette single-sourced: a rebalance in `tokens.css` reaches
 * the canvas, whereas a hex written here would drift immediately.
 *
 * @theme emits these on `:root`, so this returns the canonical value.
 */
export function readTokenColor(token: string, fallback: string): THREE.Color {
  if (typeof document === "undefined") return new THREE.Color(fallback);
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();
    return value ? new THREE.Color(value) : new THREE.Color(fallback);
  } catch {
    return new THREE.Color(fallback);
  }
}
