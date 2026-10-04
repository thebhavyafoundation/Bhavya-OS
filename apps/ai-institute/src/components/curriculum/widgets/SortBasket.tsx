"use client";

import { useState } from "react";

interface SortBasketProps {
  prompt: string;
  categories: string[];
  items: Array<{ text: string; category: string }>;
}

export function SortBasket({ prompt, categories, items }: SortBasketProps) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleCategoryClick = (itemText: string, category: string) => {
    if (submitted) return;
    setPlacements((p) => ({ ...p, [itemText]: category }));
  };

  const handleSubmit = () => {
    const res: Record<string, boolean> = {};
    items.forEach((item) => {
      res[item.text] = placements[item.text] === item.category;
    });
    setResults(res);
    setSubmitted(true);
  };

  const correctCount = Object.values(results).filter((v) => v).length;

  return (
    <div>
      <p
        style={{
          marginBottom: "var(--space-4)",
          color: "var(--color-text-secondary)",
        }}
      >
        {prompt}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-4)",
          marginBottom: "var(--space-6)",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat}
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-primary)",
              background: "var(--color-bg-elevated)",
            }}
          >
            <h5
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                color: "var(--color-brand-forest)",
                marginBottom: "var(--space-3)",
              }}
            >
              {cat}
            </h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                minHeight: "100px",
              }}
            >
              {items
                .filter((item) => placements[item.text] === cat)
                .map((item) => (
                  <span
                    key={item.text}
                    style={{
                      padding: "var(--space-2) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)",
                      background: "var(--color-bg-primary)",
                      border: "1px solid var(--color-border-primary)",
                      color:
                        submitted && results[item.text]
                          ? "var(--color-status-success)"
                          : submitted && !results[item.text]
                            ? "var(--color-status-error)"
                            : "var(--color-text-primary)",
                    }}
                  >
                    {item.text}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        {items.map((item) => {
          const isPlaced = !!placements[item.text];
          return (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  flex: 1,
                  padding: "var(--space-3) var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                {item.text}
              </span>
              {!submitted && (
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(item.text, cat)}
                      disabled={isPlaced}
                      style={{
                        padding: "var(--space-2) var(--space-3)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "var(--text-xs)",
                        background: isPlaced
                          ? "var(--color-bg-elevated)"
                          : placements[item.text] === cat
                            ? "var(--color-accent-gold)"
                            : "var(--color-bg-elevated)",
                        border: "1px solid var(--color-border-primary)",
                        color:
                          placements[item.text] === cat
                            ? "var(--color-brand-forest)"
                            : "var(--color-text-primary)",
                        cursor: isPlaced ? "not-allowed" : "pointer",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {items.map((item) => (
              <li
                key={item.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  fontSize: "var(--text-sm)",
                }}
              >
                <span
                  style={{
                    color: results[item.text]
                      ? "var(--color-status-success)"
                      : "var(--color-status-error)",
                  }}
                >
                  {results[item.text] ? "✓" : "✗"}
                </span>
                <span>{item.text}</span>
                <span style={{ color: "var(--color-text-secondary)" }}>
                  → {placements[item.text] || "(none)"} (correct:{" "}
                  {item.category})
                </span>
              </li>
            ))}
          </ul>
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
          Check Answers
        </button>
      )}
    </div>
  );
}
