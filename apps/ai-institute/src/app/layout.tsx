import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AppProviders } from "@/lib/providers/AppProviders";

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

export const metadata: Metadata = {
  title: "Bhavya Foundation — For People. For Nature. For Generations.",
  description:
    "Nature restored. Knowledge opened. Heritage kept. Communities led from within. A public charitable trust building for generations.",
};

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
          <SiteHeader variant="default" />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
