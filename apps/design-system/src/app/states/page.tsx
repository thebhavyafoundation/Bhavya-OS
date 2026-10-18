import type { Metadata } from "next";
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  LoadingSpinner,
} from "@bhavya/platform-ui";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "States — Bhavya Design System",
  description:
    "Live proofs of the loading, empty and error state primitives, rendered against the canonical tokens in both themes.",
};

/**
 * States proof.
 *
 * The `/components` route catalogues component names and variants as prose.
 * This route renders the primitives live, because a state surface is only
 * reviewable when you can see it: the whole point of EmptyState is how it
 * sits inside a real page's whitespace, and the whole point of
 * LoadingSkeleton is whether it reserves the right box.
 *
 * Both themes are shown side by side. Every one of these primitives was
 * hardened to be token-only and theme-stable, so a proof that only showed
 * one theme would hide the regression this page exists to catch.
 */

function Panel({
  title,
  note,
  children,
  dark = false,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      className={`rounded-lg border p-5 ${
        dark ? "border-white/10 bg-[#0a1f15]" : "border-black/10 bg-[#f7f4ec]"
      }`}
    >
      <header className="mb-4">
        <h3
          className={`text-sm font-semibold ${
            dark ? "text-[#f7f4ec]" : "text-[#0e382e]"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-1 text-xs ${
            dark ? "text-[#8a9a8b]" : "text-[#546342]"
          }`}
        >
          {note}
        </p>
      </header>
      <div
        className={`rounded-md border ${
          dark ? "border-white/10" : "border-black/10"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

export default function StatesPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-display text-[#f7f4ec]">States</h1>
          <p className="mt-2 max-w-prose text-sm text-[#b8c7bc]">
            Loading, empty and error surfaces. Each primitive reserves space,
            announces itself to assistive technology, and renders from tokens
            alone — no literal colour, no theme-specific variant.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel
            title="EmptyState"
            note="role=status, polite. Announces a filter change that produced nothing."
          >
            <EmptyState
              title="No missions published yet"
              description="When a mission publishes progress with sources, it will appear here."
              meta="Filter: all statuses"
            />
          </Panel>

          <Panel
            title="EmptyState with action"
            note="The caller supplies the action, so a link and a button are equally possible."
          >
            <EmptyState
              title="No audit events recorded"
              description="Sensitive actions are recorded here as they happen."
              action={
                <button
                  type="button"
                  className="rounded-md px-4 py-2 text-sm font-medium"
                  style={{
                    background: "var(--color-brand-forest)",
                    color: "var(--color-brand-ivory)",
                  }}
                >
                  Clear filters
                </button>
              }
            />
          </Panel>

          <Panel
            title="LoadingSkeleton"
            note="aria-hidden placeholder plus an sr-only status. Shimmer is motion-safe only."
          >
            <div className="p-4">
              <LoadingSkeleton lines={3} label="Loading modules" />
            </div>
          </Panel>

          <Panel
            title="LoadingSkeleton with media"
            note="Reserves a 18rem box so arriving content does not shift the layout."
          >
            <div className="p-4">
              <LoadingSkeleton lines={2} withMedia label="Loading lesson" />
            </div>
          </Panel>

          <Panel
            title="ErrorState with retry"
            note="role=alert. Retry is a real focusable button."
          >
            <ErrorState
              title="We could not load this module"
              message="The curriculum registry did not respond. Nothing has been lost."
              retryLabel="Try again"
              onRetry={() => undefined}
            />
          </Panel>

          <Panel
            title="ErrorState without retry"
            note="Used when retrying is pointless. No button is rendered rather than a dead one."
          >
            <ErrorState
              title="This lesson has no content yet"
              message="The lesson exists in the registry but its body has not been authored."
            />
          </Panel>

          <Panel
            title="LoadingSpinner"
            note="Token-coloured. Inherits the theme border."
          >
            <LoadingSpinner label="Loading records" />
          </Panel>

          <Panel
            title="Dark theme"
            note="Same primitives, dark tokens. The plate must stay legible in both."
            dark
          >
            <EmptyState
              title="No documents published"
              description="Published records appear here with their source."
            />
          </Panel>
        </div>
      </main>
    </div>
  );
}
