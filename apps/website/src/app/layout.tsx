import type { ReactNode } from "react";
import type { Metadata } from "next";
import { organizationJsonLd, buildMetadata } from "../lib/metadata";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  title:
    "Bhavya Foundation — Restoring Nature. Empowering Humanity. Preserving Heritage.",
  description:
    "Bhavya Foundation is a public charitable trust dedicated to environmental conservation, education, heritage preservation, and community development. Building institutions for generations.",
  path: "/",
});

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          hrefLang="en-IN"
          href="https://bhavya.foundation"
        />
        <link
          rel="alternate"
          hrefLang="hi"
          href="https://bhavya.foundation/hi"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://bhavya.foundation"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
