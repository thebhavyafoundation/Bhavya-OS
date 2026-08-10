"use client";

/**
 * @bhavya/platform-ui — SearchBar
 *
 * Reusable search input with debounce.
 */

import React, { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  debounceMs = 300,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || "");

  useEffect(() => {
    if (controlledValue !== undefined) setInternalValue(controlledValue);
  }, [controlledValue]);

  const debouncedOnChange = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout>;
      return (val: string) => {
        clearTimeout(timer);
        timer = setTimeout(() => onChange(val), debounceMs);
      };
    })(),
    [onChange, debounceMs],
  );

  return (
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#64748b",
          fontSize: 14,
        }}
      >
        &#128269;
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          debouncedOnChange(e.target.value);
        }}
        style={{
          width: "100%",
          padding: "10px 12px 10px 36px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#0f172a",
          color: "#f8fafc",
          fontSize: 14,
          outline: "none",
        }}
      />
    </div>
  );
}
