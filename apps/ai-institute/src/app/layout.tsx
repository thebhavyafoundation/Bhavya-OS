import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LayoutShell } from "@/components/LayoutShell";
import { MotionProvider } from "@/components/MotionProvider";
import { SmoothScroll } from "@/components/SmoothScroll";

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

export const viewport: Viewport = {
  themeColor: "#0e382e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bhavyafoundation.org"),
  title: "Bhavya Foundation",
  description:
    "Restoring Nature. Empowering Humanity. Preserving Heritage. A public charitable trust built for generations.",
  manifest: "/manifest.json",
  icons: {
    icon: "/brand/logo-mark.png",
    apple: "/brand/logo-mark.png",
  },
  openGraph: {
    title: "Bhavya Foundation",
    description:
      "Restoring Nature. Empowering Humanity. Preserving Heritage. A public charitable trust built for generations.",
    url: "https://bhavyafoundation.org",
    siteName: "Bhavya Foundation",
    type: "website",
    images: ["/brand/logo-full.png"],
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
          <SmoothScroll>
            <MotionProvider>
              <LayoutShell>{children}</LayoutShell>
            </MotionProvider>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
