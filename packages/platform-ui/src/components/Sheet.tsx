"use client";

/**
 * @bhavya/platform-ui — Sheet
 *
 * Slide-over panel built on canonical design tokens. Sheet slides in from the
 * right edge. Motion uses `transform` (compositor-only) and is gated by
 * `prefers-reduced-motion`. All surface, border, shadow and z-index values
 * resolve to tokens.css.
 *
 * @module platform-ui/components/Sheet
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

interface SheetContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextProps | null>(null);

function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("Sheet components must be used within <Sheet>");
  }
  return ctx;
}

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  const value = useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

export interface SheetTriggerProps {
  children: React.ReactNode;
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { open, onOpenChange } = useSheetContext();
  const onClick = useCallback(() => onOpenChange(!open), [open, onOpenChange]);
  return (
    <button type="button" onClick={onClick} aria-expanded={open}>
      {children}
    </button>
  );
}

export interface SheetContentProps {
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const WIDTHS = { sm: 400, md: 560, lg: 720 };

export function SheetContent({
  title,
  children,
  size = "md",
}: SheetContentProps) {
  const { open, onOpenChange } = useSheetContext();
  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
  const panelRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const translateX = open ? "0" : "100%";
  const opacity = open ? 1 : 0;

  const transition = prefersReducedMotion
    ? "none"
    : `transform var(--duration-normal) var(--ease-out), opacity var(--duration-fast) ease`;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--color-bg-overlay)",
            zIndex: "var(--z-modal)",
            display: open ? "block" : "none",
          }}
        />
      )}
      {/* Panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: WIDTHS[size],
          maxWidth: "100vw",
          background: "var(--color-surface)",
          borderLeft: `1px solid var(--color-border-primary)`,
          boxShadow: "var(--shadow-xl)",
          zIndex: "var(--z-modal)",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${translateX})`,
          transition: transition,
          opacity,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: `1px solid var(--color-border-secondary)`,
          }}
        >
          {title && (
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text-primary)",
                margin: 0,
                fontFamily: "var(--font-sans)",
              }}
            >
              {title}
            </h2>
          )}
          <button
            onClick={handleClose}
            aria-label="Close sheet"
            style={{
              background: "transparent",
              border: `1px solid var(--color-border-secondary)`,
              color: "var(--color-text-secondary)",
              fontSize: 20,
              cursor: "pointer",
              padding: 4,
              borderRadius: "var(--radius-sm)",
              transition:
                "border-color var(--duration-fast) ease, color var(--duration-fast) ease",
            }}
          >
            &#10005;
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
