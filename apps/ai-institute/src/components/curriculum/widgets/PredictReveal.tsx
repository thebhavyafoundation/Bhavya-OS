"use client";

import { useState } from "react";

interface PredictRevealProps {
  prompt: string;
  options?: string[];
  answer: string;
  reveal: string;
}

export function PredictReveal({
  prompt,
  options,
  answer,
  reveal,
}: PredictRevealProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const handleSelect = (option: string) => {
    if (checked) return;
    setSelected(option);
  };

  const handleCheck = () => {
    if (!selected && !customInput.trim()) return;
    setChecked(true);
  };

  const isCorrect =
    (selected || customInput.trim().toLowerCase()) === answer.toLowerCase();

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
      {options ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={checked}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-md)",
                border: checked
                  ? selected === opt
                    ? isCorrect
                      ? "2px solid var(--color-status-success)"
                      : "2px solid var(--color-status-error)"
                    : "1px solid var(--color-border-primary)"
                  : selected === opt
                    ? "2px solid var(--color-accent-gold)"
                    : "1px solid var(--color-border-primary)",
                background: checked
                  ? selected === opt
                    ? isCorrect
                      ? "var(--color-status-success-bg)"
                      : "var(--color-status-error-bg)"
                    : "var(--color-bg-primary)"
                  : selected === opt
                    ? "rgba(208, 170, 0, 0.1)"
                    : "var(--color-bg-primary)",
                color: checked
                  ? selected === opt
                    ? isCorrect
                      ? "var(--color-status-success)"
                      : "var(--color-status-error)"
                    : "var(--color-text-primary)"
                  : "var(--color-text-primary)",
                textAlign: "left",
                width: "100%",
                cursor: checked ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginBottom: "var(--space-4)" }}>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            disabled={checked}
            placeholder="Type your answer..."
            style={{
              width: "100%",
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-primary)",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
              fontSize: "var(--text-base)",
            }}
          />
        </div>
      )}
      {!checked && selected && (
        <button
          onClick={handleCheck}
          style={{
            padding: "var(--space-3) var(--space-5)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-brand-forest)",
            color: "white",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            marginTop: "var(--space-4)",
          }}
        >
          Check
        </button>
      )}
      {checked && (
        <div
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-lg)",
            background: isCorrect
              ? "var(--color-status-success-bg)"
              : "var(--color-status-error-bg)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              marginBottom: "var(--space-2)",
            }}
          >
            <span
              style={{
                color: isCorrect
                  ? "var(--color-status-success)"
                  : "var(--color-status-error)",
                fontWeight: 600,
              }}
            >
              {isCorrect ? "✓ Correct" : "✗ Incorrect"}
            </span>
          </div>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
            }}
          >
            <strong>Answer:</strong> {answer}
          </p>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-sm)",
              lineHeight: 1.6,
              marginTop: "var(--space-2)",
            }}
          >
            {reveal}
          </p>
        </div>
      )}
    </div>
  );
}
