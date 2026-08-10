"use client";

/**
 * @bhavya/platform-ui — Tabs
 *
 * Reusable tabs component.
 */

import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange: (tabId: string) => void;
}

export function Tabs({
  tabs,
  activeTab: controlledActive,
  onChange,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id || "");
  const activeTab = controlledActive || internalActive;

  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e293b" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setInternalActive(tab.id);
            onChange(tab.id);
          }}
          style={{
            padding: "10px 16px",
            background: "none",
            border: "none",
            borderBottom:
              tab.id === activeTab
                ? "2px solid #3b82f6"
                : "2px solid transparent",
            color: tab.id === activeTab ? "#3b82f6" : "#94a3b8",
            fontSize: 14,
            fontWeight: tab.id === activeTab ? 600 : 400,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
