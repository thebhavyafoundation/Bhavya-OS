import type { ReactNode } from "react";
import type { Metadata } from "next";
import { organizationJsonLd, buildMetadata } from "../lib/metadata";
import { Providers } from "../components/Providers";
import "@bhavya/platform-ui";
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/brand/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/brand/apple-touch-icon.svg" />
        <link rel="mask-icon" href="/brand/icon.svg" color="#15803d" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#052e16" />
        <meta name="msapplication-TileColor" content="#052e16" />
        <meta property="og:image" content="/brand/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta
          property="og:image:alt"
          content="Bhavya Foundation — Nature. Knowledge. Heritage."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/brand/og-image.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="alternate"
          hrefLang="en-IN"
          href="https://thebhavyafoundation.github.io/Bhavya-OS"
        />
        <link
          rel="alternate"
          hrefLang="hi"
          href="https://thebhavyafoundation.github.io/Bhavya-OS/hi"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://thebhavyafoundation.github.io/Bhavya-OS"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
