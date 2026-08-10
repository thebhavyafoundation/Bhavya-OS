import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capability Center — Bhavya OS",
  description:
    "Capability registry — every discovered technology becomes a capability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
