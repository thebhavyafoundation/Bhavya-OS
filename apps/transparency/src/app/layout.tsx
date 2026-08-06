import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transparency Portal — Bhavya Foundation",
  description:
    "Public access to Bhavya Foundation's governance, financial disclosures, and impact reports.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
