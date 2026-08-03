import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub OS — Engineering Workspace",
  description: "AI-native engineering operating system for Bhavya Foundation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-[#fafafa] antialiased">
        {children}
      </body>
    </html>
  );
}
