"use client";

/**
 * @bhavya/platform-ui — Sheet
 *
 * Slide-over panel built on canonical design tokens. Sheet slides in from the
 * right edge. Motion uses `transform` (compositor-only) and is gated by
 * `prefers-reduced-motion`. All surface, border, shadow and z-index values
 * resolve to tokens.css.
 *
 * Behaviour contract (the same contract Modal honours, so a learner is not
 * surprised by a different set of rules in a different surface):
 * - The overlay sits on the modal layer; the panel sits one step above it.
 *   An overlay raised above the panel paints over it and swallows every
 *   click on the panel's own controls, including the close button.
 * - Escape closes the sheet.
 * - Focus moves into the panel on open and returns to the trigger on close.
 * - Tab is trapped inside the panel while it is open.
 * - Body scroll is locked while open and released on close.
 * - While closed the panel is inert: not in the tab order, not in the
 *   accessibility tree, and not a pointer target. It is still mounted so
 *   the slide-out transition can play.
 *
 * @module platform-ui/components/Sheet
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  /** Optional class for the trigger button. */
  className?: string;
}

export function SheetTrigger({ children, className }: SheetTriggerProps) {
  const { open, onOpenChange } = useSheetContext();
  const onClick = useCallback(() => onOpenChange(!open), [open, onOpenChange]);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={className}
    >
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SheetContent({
  title,
  children,
  size = "md",
}: SheetContentProps) {
  const { open, onOpenChange } = useSheetContext();
  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const translateX = open ? "0" : "100%";
  const opacity = open ? 1 : 0;

  const transition = prefersReducedMotion
    ? "none"
    : `transform var(--duration-normal) var(--ease-out), opacity var(--duration-fast) ease`;

  // Focus and scroll behaviour, mirroring Modal.
  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const panelEl = panelRef.current;
    if (panelEl) {
      const focusable =
        panelEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        panelEl.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [open]);

  // Escape closes; Tab is trapped inside the panel while it is open.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab") return;

      const panelEl = panelRef.current;
      if (!panelEl) return;

      const focusable =
        panelEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <>
      {/* Overlay — on the modal layer, always below the panel. */}
      {open && (
        <div
          onClick={handleClose}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--color-bg-overlay)",
            zIndex: "var(--z-modal)",
          }}
        />
      )}
      {/* Panel — one step above the overlay it belongs to. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-hidden={open ? undefined : true}
        inert={open ? undefined : true}
        tabIndex={-1}
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
          zIndex: "var(--z-modal-panel)",
          display: "flex",
          flexDirection: "column",
          transform: `translateX(${translateX})`,
          transition: transition,
          opacity,
          pointerEvents: open ? "auto" : "none",
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
              id={titleId}
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
