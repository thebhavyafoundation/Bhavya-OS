import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@bhavya/platform-ui";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LayoutShell } from "@/components/LayoutShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bhavyafoundation.org"),
  title: "Bhavya Foundation",
  description:
    "Restoring Nature. Empowering Humanity. Preserving Heritage. A public charitable trust built for generations.",
  manifest: "/manifest.json",
  themeColor: "#0e382e",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Bhavya Foundation",
    description:
      "Restoring Nature. Empowering Humanity. Preserving Heritage. A public charitable trust built for generations.",
    url: "https://bhavyafoundation.org",
    siteName: "Bhavya Foundation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavya Foundation",
    description:
      "Restoring Nature. Empowering Humanity. Preserving Heritage. A public charitable trust built for generations.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
