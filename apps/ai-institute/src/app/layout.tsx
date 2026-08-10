import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LayoutShell } from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "Bhavya Foundation",
  description:
    "Restoring Nature. Empowering Humanity. Preserving Heritage. A public charitable trust built for generations.",
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
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutShell>{children}</LayoutShell>
        </AuthProvider>
      </body>
    </html>
  );
}
