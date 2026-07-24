import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Bhavya Foundation | Institutional Knowledge Platform",
  description: "Canonical source for governance, decisions, standards, and releases across Bhavya Foundation. Browse ADRs, policies, standards, releases, and the knowledge graph.",
  keywords: ["Bhavya Foundation", "governance", "knowledge platform", "ADR", "standards", "releases"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
