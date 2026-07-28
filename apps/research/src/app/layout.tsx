import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Research — Bhavya Foundation",
  description:
    "Research lifecycle management: projects, sources, evidence, and publication pipeline.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
