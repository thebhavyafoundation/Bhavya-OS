"use client";

import { useState } from "react";

interface TapMatchProps {
  pairs: readonly { readonly a: string; readonly b: string }[];
}

export function TapMatch({ pairs }: TapMatchProps) {
  const rightOrder = pairs.map((_, index) => index).reverse();
  if (rightOrder.length > 2) {
    rightOrder.push(rightOrder.shift() ?? 0);
  }

  const [selected, setSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<readonly number[]>([]);
  const [message, setMessage] = useState("");

  const isMatched = (pairIndex: number) => matched.includes(pairIndex);

  const selectLeft = (pairIndex: number) => {
    if (isMatched(pairIndex)) return;
    setSelected(pairIndex);
    setMessage("");
  };

  const selectRight = (pairIndex: number) => {
    if (isMatched(pairIndex)) return;
    if (selected === null) {
      setMessage("Pick a term on the left first.");
      return;
    }
    if (pairIndex === selected) {
      const next = [...matched, pairIndex];
      setMatched(next);
      setSelected(null);
      setMessage(
        next.length === pairs.length
          ? "All pairs matched."
          : "Matched. Keep going.",
      );
    } else {
      setSelected(null);
      setMessage("Not a match. Try again.");
    }
  };

  return (
    <div className="ai-widget" role="group" aria-label="Match the pairs">
      <div className="ai-tap-grid">
        <ul className="ai-tap-col">
          {pairs.map((pair, index) => (
            <li key={pair.a}>
              <button
                type="button"
                className="ai-tap-item"
                data-state={
                  isMatched(index)
                    ? "matched"
                    : selected === index
                      ? "selected"
                      : undefined
                }
                aria-pressed={selected === index}
                disabled={isMatched(index)}
                onClick={() => selectLeft(index)}
              >
                {pair.a}
              </button>
            </li>
          ))}
        </ul>
        <ul className="ai-tap-col">
          {rightOrder.map((pairIndex) => (
            <li key={pairs[pairIndex]?.b}>
              <button
                type="button"
                className="ai-tap-item"
                data-state={
                  isMatched(pairIndex)
                    ? "matched"
                    : selected !== null && !isMatched(pairIndex)
                      ? "target"
                      : undefined
                }
                disabled={isMatched(pairIndex)}
                onClick={() => selectRight(pairIndex)}
              >
                {pairs[pairIndex]?.b}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p className="ai-widget-status" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
