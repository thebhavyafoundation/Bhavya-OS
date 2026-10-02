"use client";

import { useState } from "react";

interface InvestigateProps {
  prompt: string;
  items: readonly { readonly text: string; readonly correct: boolean }[];
}

export function Investigate({ prompt, items }: InvestigateProps) {
  const [flagged, setFlagged] = useState<readonly number[]>([]);
  const [checked, setChecked] = useState(false);

  const toggleFlag = (index: number) => {
    if (checked) return;
    setFlagged((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const reset = () => {
    setFlagged([]);
    setChecked(false);
  };

  const correctCount = items.filter(
    (item, index) => flagged.includes(index) === item.correct,
  ).length;

  return (
    <div
      className="ai-widget"
      role="group"
      aria-label="Investigate the statements"
    >
      <p className="ai-widget-prompt">{prompt}</p>
      <ul className="ai-investigate-list">
        {items.map((item, index) => {
          const isFlagged = flagged.includes(index);
          const isRight = isFlagged === item.correct;
          return (
            <li
              key={item.text}
              className="ai-investigate-item"
              data-state={
                checked ? (isRight ? "correct" : "incorrect") : undefined
              }
            >
              <span className="ai-investigate-text">{item.text}</span>
              <button
                type="button"
                className="ai-investigate-flag"
                aria-pressed={isFlagged}
                disabled={checked}
                onClick={() => toggleFlag(index)}
              >
                {isFlagged ? "Flagged" : "Flag"}
              </button>
              {checked && (
                <span className="ai-investigate-verdict">
                  {isRight
                    ? "Right"
                    : item.correct
                      ? "Missed it"
                      : "Wrongly flagged"}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="ai-widget-actions">
        <button
          type="button"
          className="ai-widget-btn"
          disabled={flagged.length === 0 || checked}
          onClick={() => setChecked(true)}
        >
          Check
        </button>
        <button
          type="button"
          className="ai-widget-btn ai-widget-btn-quiet"
          onClick={reset}
        >
          Reset
        </button>
      </div>
      <p className="ai-widget-status" role="status" aria-live="polite">
        {checked ? `${correctCount} of ${items.length} correct.` : ""}
      </p>
    </div>
  );
}
