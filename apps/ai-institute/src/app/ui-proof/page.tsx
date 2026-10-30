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

export default function UiProofPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <h1>UI Proof</h1>
      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent title="Dialog Title">
            <p>Dialog body content.</p>
            <button type="button">Inner action</button>
          </DialogContent>
        </Dialog>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent title="Sheet Title">
            <p>Sheet body content.</p>
            <button type="button">Inner action</button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
