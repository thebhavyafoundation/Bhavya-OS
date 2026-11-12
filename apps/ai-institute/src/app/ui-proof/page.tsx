import type { Metadata } from "next";
import { InteractionProof } from "./InteractionProof";

/**
 * Interaction proof — the surface the remote Playwright harness drives.
 *
 * It is a verification route, not a reader-facing page, so it is excluded
 * from search indexing and is not linked from anywhere in the site
 * navigation. The content itself is a small, honest explanation of what the
 * page is for.
 */
export const metadata: Metadata = {
  title: "Interaction proof — Bhavya Foundation",
  description:
    "Verification surface for the interactive primitives: open, close, keyboard behaviour, focus handling and scroll-lock release.",
  robots: { index: false, follow: false },
};

export default function UiProofPage() {
  return (
    <div
      id="main-content"
      className="ai-page"
      style={{ paddingTop: "var(--header-h)" }}
    >
      <p className="ai-eyebrow">Verification surface</p>
      <h1 className="ai-page-title">Interaction proof</h1>
      <p className="ai-page-lead">
        A plain surface for checking that the shared interactive primitives
        behave the way they are documented to behave, in a real browser, on
        every deploy.
      </p>
      <InteractionProof />
    </div>
  );
}
