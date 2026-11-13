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

// The metadata itself lives in `src/lib/seo/site-metadata.ts` so that the
// favicon and asset references are assertable from a test. The browser's
// default /favicon.ico is not in public/, and nothing declared the SVG that
// is there, which is why the homepage produced one console error.
export const metadata: Metadata = siteMetadata;

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
