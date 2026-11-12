"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@bhavya/platform-ui";

/**
 * InteractionProof — the runtime surface the remote Playwright harness drives.
 *
 * It is not a demo page and it is not decoration. Every interactive
 * primitive the platform-ui package ships has to be checked in a real
 * browser: that it can be opened and closed repeatedly, that it can be
 * closed with the keyboard, that focus moves into it and comes back out, and
 * that closing it leaves the page scrollable again. A component name and a
 * library's reputation are not evidence of any of that.
 *
 * It is deliberately excluded from search indexing (see the route's
 * metadata) because it is a verification surface, not a reader-facing page.
 */
export function InteractionProof() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <p className="ai-prose">
        Open each surface and close it again with the keyboard. Both should
        return focus to the button you opened them from, and the page behind
        should stay scrollable once they close.
      </p>

      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          flexWrap: "wrap",
          marginTop: "var(--space-5)",
        }}
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className="btn btn-primary">Open Dialog</DialogTrigger>
          <DialogContent title="Dialog">
            <p>
              A modal dialog is centred over the page. Tab is trapped inside it,
              Escape closes it, and focus returns to the trigger.
            </p>
            <button type="button" className="btn btn-secondary">
              Inner action
            </button>
          </DialogContent>
        </Dialog>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger className="btn btn-secondary">Open Sheet</SheetTrigger>
          <SheetContent title="Sheet">
            <p>
              A sheet slides in from the right edge. It follows the same
              keyboard rules as the dialog: Escape closes it, focus is trapped
              while it is open, and the page scroll is released on close.
            </p>
            <button type="button" className="btn btn-secondary">
              Inner action
            </button>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
