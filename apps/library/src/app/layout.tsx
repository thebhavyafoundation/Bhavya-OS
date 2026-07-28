import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Digital Library — Bhavya Foundation",
  description: "Open access to institutional knowledge, research, governance documents, and educational resources.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
