import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Source Intelligence — Bhavya OS",
  description:
    "Continuous engineering knowledge base of the best open-source software, AI frameworks, MCP servers, and developer tools",
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
