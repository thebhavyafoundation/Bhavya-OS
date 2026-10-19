/**
 * @bhavya/platform-ui — Callout
 *
 * A block of text that must not be skimmed past.
 *
 * Tone is a semantic role, never a colour. The component references only the
 * `--color-callout-*` component tokens, which resolve to `--color-status-*`
 * semantic tokens in `styles/tokens.css`. Nothing here names a hue, so a
 * palette rebalance or a light/dark switch needs no change to this file.
 *
 * `caution` is the tone for information where getting it wrong has a real
 * consequence — safety instructions, safeguarding conditions.
 */

import React from "react";

export type CalloutTone = "note" | "tip" | "caution";

interface CalloutProps {
  children: React.ReactNode;
  /** Defaults to `note`. */
  tone?: CalloutTone;
  /** Short label rendered ahead of the body. Omit when the tone is self-evident. */
  title?: string;
  className?: string;
  as?: "aside" | "div" | "section";
}

/*
 * Written out in full rather than interpolated from the tone name: Tailwind
 * extracts candidates by scanning source text, so a template literal like
 * `bg-callout-${tone}-bg` produces no detectable class and silently renders
 * unstyled. Each string below is complete and statically discoverable.
 */
const toneClasses: Record<CalloutTone, string> = {
  note: "bg-callout-note-bg text-callout-note-fg border-callout-note-rule",
  tip: "bg-callout-tip-bg text-callout-tip-fg border-callout-tip-rule",
  caution:
    "bg-callout-caution-bg text-callout-caution-fg border-callout-caution-rule",
};

const ruleClasses: Record<CalloutTone, string> = {
  note: "bg-callout-note-rule",
  tip: "bg-callout-tip-rule",
  caution: "bg-callout-caution-rule",
};

/*
 * The caution tone carries consequences, so it must never be identifiable by
 * colour alone. In forced-colors mode every tint is flattened to the system
 * canvas and the three tones become indistinguishable; in greyscale they
 * collapse too. A guaranteed label is the one channel that always survives.
 *
 * A caller who passes an explicit title still controls the wording — this only
 * supplies a default for the tone that most needs one.
 */
const toneLabels: Record<CalloutTone, string | undefined> = {
  note: undefined,
  tip: undefined,
  caution: "Caution",
};

export function Callout({
  children,
  tone = "note",
  title,
  className = "",
  as: Tag = "aside",
}: CalloutProps) {
  const label = title ?? toneLabels[tone];
  return (
    <Tag
      data-tone={tone}
      className={`relative flex gap-3 rounded-md border-l-4 py-3 pl-4 pr-3 text-sm leading-relaxed ${toneClasses[tone]} ${className}`}
    >
      {/*
       * The left rule carries the signal. Tone colour alone is not enough:
       * colour is unavailable to some readers, and this is exactly the
       * content that must not be skimmed. The rule survives greyscale and
       * forced-colours, where the background tint does not.
       */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 rounded-l ${ruleClasses[tone]}`}
      />
      <span className="min-w-0 flex-1">
        {label && <strong className="mr-1 font-semibold">{label}</strong>}
        {children}
      </span>
    </Tag>
  );
}
