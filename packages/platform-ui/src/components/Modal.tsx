/**
 * @bhavya/platform-ui — Modal
 *
 * Reusable modal dialog component.
 */

import React, { useEffect } from "react";

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
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1e293b",
          borderRadius: 12,
          border: "1px solid #334155",
          width: "100%",
          maxWidth: SIZES[size],
          maxHeight: "80vh",
          overflow: "auto",
          padding: 0,
        }}
      >
        {title && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: "1px solid #334155",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#f8fafc",
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: 20,
                cursor: "pointer",
                padding: 4,
              }}
            >
              &#10005;
            </button>
          </div>
        )}
        <div style={{ padding: "16px 24px" }}>{children}</div>
      </div>
    </div>
  );
}
