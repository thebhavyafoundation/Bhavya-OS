import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "AI Institute — Bhavya Foundation",
  description:
    "Learn AI by building real things. A research-driven, open-source institute for the next generation of AI builders.",
  openGraph: {
    title: "Bhavya AI Institute",
    description:
      "Learn AI by building real things. Not another course platform.",
    url: "https://ai.bhavya.foundation",
    siteName: "Bhavya AI Institute",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavya AI Institute",
    description:
      "Learn AI by building real things. Not another course platform.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-bg-primary text-text-primary antialiased">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
