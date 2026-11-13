import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SkipLink } from "@/components/SkipLink";
import { AppProviders } from "@/lib/providers/AppProviders";
import { siteMetadata } from "@/lib/seo/site-metadata";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = siteMetadata;

// Public content pages are prerendered with no per-request data, so sharing
// them at the edge is correct. They opt into incremental static regeneration
// with a five-minute window: long enough to serve from the CDN, short
// enough that a content correction is live within minutes rather than a
// year (risk R-15, approved 2026-11-13).
//
// Authenticated, personalized and administrative surfaces are unaffected:
// those routes are dynamic (cookies or force-dynamic) or redirect at the
// middleware before rendering, and the fail-closed cache policy in
// src/lib/http/cache-policy.ts governs them.
//
// Descendants may set a stricter static level (for example 0) but not a
// weaker one; Next.js makes such a combination fail the build.
export const revalidate = 300;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        style={{
          background: "var(--color-bg-primary)",
          fontFamily: `${inter.variable}, ${playfair.variable}, sans-serif`,
        }}
        className={`${inter.className} ${playfair.className}`}
      >
        <AppProviders>
          {/* The skip link must be the first focusable element on the page,
              before the header's navigation, so that a keyboard user can
              bypass it in one keystroke. */}
          <SkipLink />
          <SiteHeader variant="default" />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
