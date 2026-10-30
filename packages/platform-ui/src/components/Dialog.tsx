"use client";

/**
 * @bhavya/platform-ui — Dialog
 *
 * shadcn-style Dialog built on Modal. All surface, border, focus and z-index
 * values resolve to canonical design tokens in tokens.css. Controlled via
 * `open` / `onOpenChange`.
 *
 * @module platform-ui/components/Dialog
 */

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { Modal } from "./Modal";

interface DialogContextProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextProps | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return ctx;
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const value = useMemo(() => ({ open, onOpenChange }), [open, onOpenChange]);
  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

export interface DialogTriggerProps {
  children: React.ReactNode;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  const { open, onOpenChange } = useDialogContext();
  const onClick = useCallback(() => onOpenChange(!open), [open, onOpenChange]);
  return (
    <button type="button" onClick={onClick} aria-expanded={open}>
      {children}
    </button>
  );
}

export interface DialogContentProps {
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function DialogContent({
  title,
  children,
  size = "md",
}: DialogContentProps) {
  const { open, onOpenChange } = useDialogContext();
  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  return (
    <Modal open={open} onClose={handleClose} title={title} size={size}>
      {children}
    </Modal>
  );
}
