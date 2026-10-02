"use client";

import { useState } from "react";

interface SortBasketProps {
  prompt: string;
  categories: readonly string[];
  items: readonly { readonly text: string; readonly category: string }[];
}

export function SortBasket({ prompt, categories, items }: SortBasketProps) {
  const [assigned, setAssigned] = useState<(string | null)[]>(() =>
    items.map(() => null),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const assign = (category: string) => {
    if (selected === null || checked) return;
    const target = selected;
    setAssigned((current) =>
      current.map((value, index) => (index === target ? category : value)),
    );
    setSelected(null);
  };

  const reset = () => {
    setAssigned(items.map(() => null));
    setSelected(null);
    setChecked(false);
  };

  const allPlaced = assigned.every((value) => value !== null);
  const correctCount = items.filter(
    (item, index) => assigned[index] === item.category,
  ).length;

  return (
    <div className="ai-widget" role="group" aria-label="Sort into baskets">
      <p className="ai-widget-prompt">{prompt}</p>
      <p className="ai-widget-hint">
        Select an item, then choose where it belongs.
      </p>
      <ul className="ai-sort-items">
        {items.map((item, index) => (
          <li key={item.text}>
            <button
              type="button"
              className="ai-sort-item"
              aria-pressed={selected === index}
              disabled={checked}
              onClick={() => setSelected(selected === index ? null : index)}
              data-state={
                checked
                  ? assigned[index] === item.category
                    ? "correct"
                    : "incorrect"
                  : selected === index
                    ? "selected"
                    : assigned[index] !== null
                      ? "placed"
                      : undefined
              }
            >
              <span className="ai-sort-text">{item.text}</span>
              <span className="ai-sort-placement">
                {assigned[index] ?? "Not placed"}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="ai-sort-baskets">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="ai-sort-basket"
            disabled={selected === null || checked}
            onClick={() => assign(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="ai-widget-actions">
        <button
          type="button"
          className="ai-widget-btn"
          disabled={!allPlaced || checked}
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
        {checked
          ? `${correctCount} of ${items.length} placed correctly.`
          : allPlaced
            ? "Ready to check."
            : ""}
      </p>
    </div>
  );
}
