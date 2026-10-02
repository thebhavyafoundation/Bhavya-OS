"use client";

import { useState } from "react";

interface PredictRevealProps {
  prompt: string;
  options?: readonly string[];
  answer: string;
  reveal: string;
}

export function PredictReveal({
  prompt,
  options,
  answer,
  reveal,
}: PredictRevealProps) {
  const [chosen, setChosen] = useState<string | null>(null);

  const answered = chosen !== null;
  const isCorrect = chosen === answer;

  return (
    <div className="ai-widget" role="group" aria-label="Predict, then reveal">
      <p className="ai-widget-prompt">{prompt}</p>
      {options ? (
        <ul className="ai-predict-options">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className="ai-predict-option"
                aria-pressed={chosen === option}
                disabled={answered}
                onClick={() => setChosen(option)}
                data-state={
                  !answered
                    ? undefined
                    : option === answer
                      ? "correct"
                      : option === chosen
                        ? "incorrect"
                        : "dim"
                }
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <button
          type="button"
          className="ai-widget-btn"
          disabled={answered}
          onClick={() => setChosen(answer)}
        >
          Reveal answer
        </button>
      )}
      <div className="ai-widget-status" role="status" aria-live="polite">
        {answered && (
          <>
            <strong>{isCorrect ? "Correct." : "Not quite."}</strong>{" "}
            <span>{reveal}</span>
          </>
        )}
      </div>
    </div>
  );
}
