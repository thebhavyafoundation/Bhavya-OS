"use client";

/**
 * @bhavya/platform-ui — Modal
 *
 * Reusable modal dialog component. All color, radius, shadow, focus and
 * z-index values resolve to canonical design tokens in tokens.css. No
 * backdrop-filter / glassmorphism (constitution 01 §7.1 #2 prohibits it).
 */

import React, { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: 400, md: 560, lg: 720 };

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = title ? `modal-title-${React.useId()}` : undefined;

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const dialogEl = dialogRef.current;
    if (dialogEl) {
      const focusableSelector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable =
        dialogEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const dialogEl = dialogRef.current;
      if (!dialogEl) return;

      const focusableSelector =
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable =
        dialogEl.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--color-bg-overlay)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--z-modal)",
        padding: "var(--space-4)",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)",
          border: `1px solid var(--color-border-primary)`,
          borderRadius: "var(--radius-xl)",
          width: "100%",
          maxWidth: SIZES[size],
          maxHeight: "85vh",
          overflow: "auto",
          padding: 0,
          boxShadow: "var(--shadow-xl)",
        }}
      >
        {title && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: `1px solid var(--color-border-secondary)`,
            }}
          >
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
            <button
              onClick={onClose}
              aria-label="Close modal"
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
        )}
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}
