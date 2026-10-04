"use client";

import { useState } from "react";

interface InvestigateProps {
  prompt: string;
  mode: "flag" | "answer";
  dataset: string[];
  items: Array<{ text: string; correct: boolean | string }>;
}

export function Investigate({
  prompt,
  mode,
  dataset,
  items,
}: InvestigateProps) {
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFlag = (index: number) => {
    if (submitted) return;
    setFlags((f) => {
      const n = new Set(f);
      if (n.has(index)) n.delete(index);
      else n.add(index);
      return n;
    });
  };

  const handleAnswer = (index: number, value: boolean) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [index]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  let correctCount = 0;
  if (submitted) {
    if (mode === "flag") {
      items.forEach((item, i) => {
        const shouldFlag = item.correct === true;
        const didFlag = flags.has(i);
        if (shouldFlag === didFlag) correctCount++;
      });
    } else {
      items.forEach((item, i) => {
        const expected = item.correct === true || item.correct === "true";
        if (answers[i] === expected) correctCount++;
      });
    }
  }

  return (
    <div
      style={{
        padding: "var(--space-4)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border-primary)",
        background: "var(--color-bg-primary)",
      }}
    >
      <p
        style={{
          marginBottom: "var(--space-4)",
          color: "var(--color-text-secondary)",
        }}
      >
        {prompt}
      </p>
      {mode === "flag" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          {dataset.map((line, i) => (
            <div
              key={i}
              onClick={() => handleFlag(i)}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: submitted
                  ? flags.has(i) && items[i]?.correct === true
                    ? "2px solid var(--color-status-success)"
                    : flags.has(i) && items[i]?.correct !== true
                      ? "2px solid var(--color-status-error)"
                      : !flags.has(i) && items[i]?.correct === true
                        ? "2px solid var(--color-status-error)"
                        : "1px solid var(--color-border-primary)"
                  : flags.has(i)
                    ? "2px solid var(--color-accent-gold)"
                    : "1px solid var(--color-border-primary)",
                background: flags.has(i)
                  ? "rgba(208, 170, 0, 0.1)"
                  : "var(--color-bg-elevated)",
                cursor: submitted ? "default" : "pointer",
                opacity: submitted ? 0.8 : 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: submitted
                      ? flags.has(i) && items[i]?.correct === true
                        ? "2px solid var(--color-status-success)"
                        : flags.has(i) && items[i]?.correct !== true
                          ? "2px solid var(--color-status-error)"
                          : !flags.has(i) && items[i]?.correct === true
                            ? "2px solid var(--color-status-error)"
                            : "1px solid var(--color-border-primary)"
                      : "2px solid var(--color-accent-gold)",
                    background: flags.has(i)
                      ? "var(--color-accent-gold)"
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {flags.has(i) ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : null}
                </span>
                <code
                  style={{
                    flex: 1,
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {line}
                </code>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            marginBottom: "var(--space-4)",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-primary)",
                background: "var(--color-bg-elevated)",
              }}
            >
              <p
                style={{
                  marginBottom: "var(--space-3)",
                  color: "var(--color-text-primary)",
                }}
              >
                {item.text}
              </p>
              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <button
                  onClick={() => handleAnswer(i, true)}
                  disabled={submitted}
                  style={{
                    padding: "var(--space-2) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: submitted
                      ? answers[i] === true
                        ? item.correct === true || item.correct === "true"
                          ? "2px solid var(--color-status-success)"
                          : "2px solid var(--color-status-error)"
                        : answers[i] === false
                          ? item.correct === false || item.correct === "false"
                            ? "2px solid var(--color-status-success)"
                            : "2px solid var(--color-status-error)"
                          : "1px solid var(--color-border-primary)"
                      : "1px solid var(--color-border-primary)",
                    background: submitted
                      ? answers[i] === true
                        ? item.correct === true || item.correct === "true"
                          ? "var(--color-status-success-bg)"
                          : "var(--color-status-error-bg)"
                        : "var(--color-bg-primary)"
                      : answers[i] === true
                        ? "rgba(208, 170, 0, 0.1)"
                        : "var(--color-bg-primary)",
                    color: "var(--color-text-primary)",
                    cursor: submitted ? "default" : "pointer",
                  }}
                >
                  True
                </button>
                <button
                  onClick={() => handleAnswer(i, false)}
                  disabled={submitted}
                  style={{
                    padding: "var(--space-2) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: submitted
                      ? answers[i] === false
                        ? item.correct === false || item.correct === "false"
                          ? "2px solid var(--color-status-success)"
                          : "2px solid var(--color-status-error)"
                        : "1px solid var(--color-border-primary)"
                      : "1px solid var(--color-border-primary)",
                    background: submitted
                      ? answers[i] === false
                        ? item.correct === false || item.correct === "false"
                          ? "var(--color-status-success-bg)"
                          : "var(--color-status-error-bg)"
                        : "var(--color-bg-primary)"
                      : answers[i] === false
                        ? "rgba(208, 170, 0, 0.1)"
                        : "var(--color-bg-primary)",
                    color: "var(--color-text-primary)",
                    cursor: submitted ? "default" : "pointer",
                  }}
                >
                  False
                </button>
              </div>
              {submitted && (
                <p
                  style={{
                    marginTop: "var(--space-3)",
                    fontSize: "var(--text-sm)",
                    color:
                      answers[i] ===
                      (item.correct === true || item.correct === "true")
                        ? "var(--color-status-success)"
                        : "var(--color-status-error)",
                  }}
                >
                  {answers[i] ===
                  (item.correct === true || item.correct === "true")
                    ? "✓ Correct"
                    : "✗ Incorrect"}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {!submitted && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3) var(--space-5)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-brand-forest)",
            color: "white",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      )}
      {submitted && (
        <div
          style={{
            marginTop: "var(--space-6)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
          }}
        >
          <h4
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-2)",
            }}
          >
            Results: {correctCount} / {items.length} correct
          </h4>
        </div>
      )}
    </div>
  );
}
