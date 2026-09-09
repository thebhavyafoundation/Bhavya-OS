import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhavya Intelligence Network — BIN",
  description:
    "Central nervous system of Bhavya OS — autonomous intelligence loop",
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
