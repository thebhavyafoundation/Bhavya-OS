import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhavya Foundation Design System",
  description: "Canonical design tokens, components, icons, typography, and patterns for all Bhavya Foundation applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
