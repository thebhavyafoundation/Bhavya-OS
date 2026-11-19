import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@bhavya/platform-ui/components/Dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@bhavya/platform-ui/components/Sheet";
import type { ProofClick, ProofTransition } from "./proof-types";

/**
 * Component proof fixture.
 *
 * This surface exists to be driven by the remote Playwright harness. It
 * renders the real shared components from @bhavya/platform-ui; it does not
 * re-implement any of their behaviour.
 *
 * Two details are deliberate:
 *
 * 1. The fixed navigation bar sits at z-index 50, the same layer the
 *    application navigation uses. The overlay components resolve their own
 *    z-index from a design token, so a token that fails to reach the
 *    browser puts the overlay below this bar and the bar swallows the
 *    clicks aimed at the overlay's own close control. Reproducing that
 *    stacking condition is the only way the harness can see the defect.
 *
 * 2. Every click and every open/close transition is recorded, so the
 *    harness can assert what actually happened rather than that an element
 *    exists.
 */

function describeTarget(target: EventTarget | null): ProofClick {
  const element =
    target instanceof Element ? target.closest("[id], [aria-label]") : null;
  if (!(element instanceof HTMLElement)) {
    return { id: "", label: "" };
  }
  const label = element.getAttribute("aria-label");
  return {
    id: element.id,
    label: label ?? (element.textContent ?? "").trim().slice(0, 60),
  };
}

function Proof() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(true);

  const recordTransition = useCallback(
    (surface: ProofTransition["surface"], open: boolean) => {
      window.__proof?.transitions.push({ surface, open });
    },
    [],
  );

  const handleDialogChange = useCallback(
    (open: boolean) => {
      setDialogOpen(open);
      recordTransition("dialog", open);
    },
    [recordTransition],
  );

  const handleSheetChange = useCallback(
    (open: boolean) => {
      setSheetOpen(open);
      recordTransition("sheet", open);
    },
    [recordTransition],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      window.__proof?.clicks.push(describeTarget(event.target));
    };
    document.addEventListener("click", onClick, true);
    window.__proof = {
      clicks: [],
      transitions: [],
      unmount: () => setMounted(false),
      remount: () => setMounted(true),
    };
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <header
        id="proof-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 72,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 24px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border-primary)",
        }}
      >
        <span style={{ fontWeight: 600 }}>Bhavya Foundation</span>
        <button type="button" id="nav-cta">
          Nav CTA
        </button>
      </header>

      <main style={{ padding: "96px 24px 24px" }}>
        <h1>Component proof</h1>
        <p id="proof-intro">
          The shared interactive primitives, rendered from the package the
          applications consume.
        </p>

        <button type="button" id="background-action">
          Background action
        </button>

        <div
          id="proof-triggers"
          style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}
        >
          {mounted ? (
            <>
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent title="Dialog">
                  <p>Dialog body content.</p>
                  <button type="button" id="dialog-inner-action">
                    Inner action
                  </button>
                </DialogContent>
              </Dialog>

              <Sheet open={sheetOpen} onOpenChange={handleSheetChange}>
                <SheetTrigger>Open Sheet</SheetTrigger>
                <SheetContent title="Sheet">
                  <p>Sheet body content.</p>
                  <button type="button" id="sheet-inner-action">
                    Inner action
                  </button>
                </SheetContent>
              </Sheet>
            </>
          ) : null}

          <button
            type="button"
            id="programmatic-toggle-dialog"
            onClick={() => handleDialogChange(!dialogOpen)}
          >
            Toggle dialog from outside
          </button>
          <button
            type="button"
            id="programmatic-toggle-sheet"
            onClick={() => handleSheetChange(!sheetOpen)}
          >
            Toggle sheet from outside
          </button>
        </div>
      </main>
    </>
  );
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("fixture root element is missing");
}
createRoot(container).render(<Proof />);
