"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Page error:", error); }, [error]);

  return (
    <main id="main-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center", padding: "0 24px" }}>
      <div className="hero-page-badge">500</div>
      <h1 className="hero-page-title" style={{ marginBottom: "16px" }}>Something Went Wrong</h1>
      <p className="hero-page-lead" style={{ marginBottom: "40px" }}>
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="hero-actions">
        <button onClick={reset} className="btn btn-primary">Try Again →</button>
        <Link href="/" className="btn btn-secondary">Return Home</Link>
      </div>
    </main>
  );
}
