/**
 * @bhavya/design-system — Accessibility Utilities
 *
 * WCAG 2.1 compliance helpers for Bhavya Foundation interfaces.
 * All utilities are framework-agnostic and work with any CSS-in-JS solution.
 */

// ─── Focus Ring ─────────────────────────────────────────────────────────────

export interface FocusRingStyles {
  outline: string;
  outlineOffset: string;
  boxShadow: string;
}

/**
 * Returns focus-visible styles that match Bhavya Foundation's design tokens.
 * Use with `:focus-visible` pseudo-class for keyboard-only focus indicators.
 *
 * @param color - Focus ring color (default: token border-focus value)
 * @param width - Ring width in pixels (default: 2)
 * @returns CSS properties for focus ring
 *
 * @example
 * ```tsx
 * <button style={{ ...focusRing() }} />
 * ```
 */
export function focusRing(color = "#3b82f6", width = 2): FocusRingStyles {
  return {
    outline: `${width}px solid ${color}`,
    outlineOffset: "2px",
    boxShadow: `0 0 0 ${width + 2}px ${color}20`,
  };
}

/**
 * Returns CSS class string for focus-visible styles.
 * Useful when working with Tailwind or CSS modules.
 */
export function focusRingClass(): string {
  return "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
}

// ─── Screen Reader Only ─────────────────────────────────────────────────────

export interface ScreenReaderOnlyStyles {
  position: string;
  width: string;
  height: string;
  padding: string;
  margin: string;
  overflow: string;
  whiteSpace: string;
  clip: string;
  clipPath: string;
}

/**
 * Returns styles that hide content visually but keep it accessible to screen readers.
 *
 * @returns CSS properties for screen-reader-only content
 *
 * @example
 * ```tsx
 * <span style={{ ...srOnly() }}>Skip to main content</span>
 * ```
 */
export function srOnly(): ScreenReaderOnlyStyles {
  return {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    clip: "rect(0, 0, 0, 0)",
    clipPath: "inset(50%)",
  };
}

/**
 * Returns CSS class string for screen-reader-only content.
 */
export function srOnlyClass(): string {
  return "sr-only";
}

// ─── ARIA Helpers ───────────────────────────────────────────────────────────

export interface AriaAttributes {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-atomic"?: boolean;
  role?: string;
}

/**
 * Returns aria-label attribute for an element.
 *
 * @param id - Element ID (used for aria-labelledby fallback)
 * @param label - Accessible label text
 * @returns ARIA attributes object
 *
 * @example
 * ```tsx
 * <button {...ariaLabel('close-btn', 'Close dialog')}>×</button>
 * ```
 */
export function ariaLabel(id: string, label: string): AriaAttributes {
  return {
    "aria-labelledby": id,
    "aria-label": label,
  };
}

/**
 * Returns aria-describedby attributes for helper text.
 *
 * @param id - ID of the descriptive element
 * @returns ARIA attributes object
 */
export function ariaDescribedBy(id: string): AriaAttributes {
  return {
    "aria-describedby": id,
  };
}

/**
 * Returns attributes for a live region that announces changes to screen readers.
 *
 * @param politeness - 'polite' waits for user to finish, 'assertive' interrupts
 * @returns ARIA attributes object
 *
 * @example
 * ```tsx
 * <div {...ariaLive('polite')} role="status">
 *   {statusMessage}
 * </div>
 * ```
 */
export function ariaLive(
  politeness: "polite" | "assertive" = "polite",
): AriaAttributes {
  return {
    "aria-live": politeness,
    "aria-atomic": true,
    role: "status",
  };
}

// ─── WCAG Contrast Calculation ──────────────────────────────────────────────

/**
 * Parses a hex color string to RGB values.
 * Supports 3-digit (#RGB), 4-digit (#RGBA), 6-digit (#RRGGBB), and 8-digit (#RRGGBBAA) hex.
 *
 * @param hex - Hex color string (with or without #)
 * @returns RGB values [0-255] and optional alpha [0-1]
 */
function parseHex(hex: string): [number, number, number, number] {
  let clean = hex.replace("#", "");

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  } else if (clean.length === 4) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const a = clean.length === 8 ? parseInt(clean.substring(6, 8), 16) / 255 : 1;

  return [r, g, b, a];
}

/**
 * Converts RGB values to relative luminance per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculates the contrast ratio between two colors per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 *
 * @param color1 - First color (hex string)
 * @param color2 - Second color (hex string)
 * @returns Contrast ratio (1:1 to 21:1)
 *
 * @example
 * ```ts
 * const ratio = contrastRatio('#ffffff', '#000000');
 * // ratio === 21
 * ```
 */
export function contrastRatio(color1: string, color2: string): number {
  const [r1, g1, b1] = parseHex(color1);
  const [r2, g2, b2] = parseHex(color2);

  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// ─── WCAG Compliance Check ──────────────────────────────────────────────────

export type WCAGLevel = "AA" | "AAA";

export interface AccessibilityCheckResult {
  pass: boolean;
  ratio: number;
  required: number;
  level: WCAGLevel;
  forLargeText: boolean;
}

/**
 * Checks if two colors meet WCAG contrast requirements.
 *
 * @param foreground - Foreground color (hex string)
 * @param background - Background color (hex string)
 * @param level - WCAG compliance level ('AA' or 'AAA')
 * @param forLargeText - Whether this is for large text (18px+ bold or 24px+ regular)
 * @returns Whether the combination passes, along with ratio details
 *
 * @example
 * ```ts
 * const result = isAccessible('#fafafa', '#0a0a0a', 'AA', false);
 * // result.pass === true (ratio ≈ 19.3, required 4.5)
 * ```
 */
export function isAccessible(
  foreground: string,
  background: string,
  level: WCAGLevel = "AA",
  forLargeText = false,
): AccessibilityCheckResult {
  const ratio = contrastRatio(foreground, background);

  const requirements: Record<WCAGLevel, Record<string, number>> = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 },
  };

  const required = forLargeText
    ? requirements[level].large
    : requirements[level].normal;

  return {
    pass: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required,
    level,
    forLargeText,
  };
}

/**
 * Suggests a compliant color by adjusting lightness.
 * Useful for generating accessible color variants programmatically.
 *
 * @param foreground - Original foreground color
 * @param background - Background color to check against
 * @param level - Target WCAG level
 * @returns Suggested foreground color that meets the contrast requirement
 */
export function suggestAccessibleColor(
  foreground: string,
  background: string,
  level: WCAGLevel = "AA",
): string {
  const [r, g, b] = parseHex(foreground);
  const [bgr, bgg, bgb] = parseHex(background);
  const bgLum = relativeLuminance(bgr, bgg, bgb);
  const fgLum = relativeLuminance(r, g, b);

  const isLighter = fgLum > bgLum;

  // Binary search for the right lightness
  let low = isLighter ? 0 : 0;
  let high = isLighter ? 255 : 255;
  let best = foreground;

  for (let i = 0; i < 50; i++) {
    const mid = Math.round((low + high) / 2);
    const candidate = isLighter
      ? `#${mid.toString(16).padStart(2, "0")}${mid.toString(16).padStart(2, "0")}${mid.toString(16).padStart(2, "0")}`
      : `#${(255 - mid).toString(16).padStart(2, "0")}${(255 - mid).toString(16).padStart(2, "0")}${(255 - mid).toString(16).padStart(2, "0")}`;

    const result = isAccessible(candidate, background, level);

    if (result.pass) {
      best = candidate;
      if (isLighter) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      if (isLighter) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return best;
}

// ─── Keyboard Navigation ────────────────────────────────────────────────────

export type KeyboardKey =
  | "Enter"
  | "Space"
  | "Escape"
  | "Tab"
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Home"
  | "End";

/**
 * Handles keyboard events for interactive components.
 *
 * @param event - Keyboard event
 * @param handlers - Map of key names to handler functions
 *
 * @example
 * ```tsx
 * <div onKeyDown={(e) => handleKeyboard(e, {
 *   Enter: () => selectItem(),
 *   Escape: () => closeMenu(),
 * })} />
 * ```
 */
export function handleKeyboard(
  event: React.KeyboardEvent,
  handlers: Partial<Record<KeyboardKey, () => void>>,
): void {
  const handler = handlers[event.key as KeyboardKey];
  if (handler) {
    event.preventDefault();
    handler();
  }
}

/**
 * Returns focus management utilities for trapping focus within a container.
 */
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  let previousFocus: HTMLElement | null = null;

  const getFocusableElements = (): HTMLElement[] => {
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return Array.from(container.querySelectorAll(selectors));
  };

  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return {
    activate() {
      previousFocus = document.activeElement as HTMLElement;
      container.addEventListener("keydown", handleKeyDown);
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    },
    deactivate() {
      container.removeEventListener("keydown", handleKeyDown);
      if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
      }
    },
  };
}
