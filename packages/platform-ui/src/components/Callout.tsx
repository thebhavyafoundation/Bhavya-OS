/**
 * @bhavya/platform-ui — Callout
 *
 * A block of text that must not be skimmed past.
 *
 * Built only from existing brand tokens. The brand palette has exactly three
 * accents — green (forest), gold, and earth — so there is deliberately no
 * "danger" or "error" hue available. `caution` therefore uses gold, which is
 * already the platform's attention colour, rather than introducing a red that
 * constitutional design authority has not approved.
 */

import React from "react";

export type CalloutTone = "note" | "tip" | "caution";

interface CalloutProps {
  children: React.ReactNode;
  /**
   * Defaults to `note`. `caution` is for information where getting it wrong
   * has a real consequence — safety instructions, safeguarding conditions.
   */
  tone?: CalloutTone;
  /** Short label rendered in the margin. Omit when the tone is self-evident. */
  title?: string;
  className?: string;
  as?: "aside" | "div" | "section";
}

const toneStyles: Record<CalloutTone, string> = {
  note: "bg-bg-hover border-border-primary text-text-secondary",
  tip: "bg-accent-green-subtle border-accent-green/40 text-text-primary",
  caution: "bg-accent-gold-glow border-accent-gold/50 text-text-primary",
};

/**
 * The left rule is the part that actually carries the signal. Tone colour alone
 * is not enough, because colour is not available to every reader — the rule is
 * a non-colour cue that survives both greyscale and forced-colours mode.
 */
const ruleStyles: Record<CalloutTone, string> = {
  note: "bg-text-tertiary",
  tip: "bg-accent-green",
  caution: "bg-accent-gold",
};

export function Callout({
  children,
  tone = "note",
  title,
  className = "",
  as: Tag = "aside",
}: CalloutProps) {
  return (
    <Tag
      className={`relative flex gap-3 rounded-md border-l-4 py-3 pl-4 pr-3 text-sm leading-relaxed ${toneStyles[tone]} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 rounded-l ${ruleStyles[tone]}`}
      />
      <span className="min-w-0 flex-1">
        {title && (
          <strong className="mr-1 font-semibold text-text-primary">
            {title}
          </strong>
        )}
        {children}
      </span>
    </Tag>
  );
}
