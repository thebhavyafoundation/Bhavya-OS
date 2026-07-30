import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  title: "AI Lab — Institutional Operating System",
  description:
    "Operating system for institutional intelligence. Knowledge, courses, lessons, research, governance, and runtime — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
          background: "#09090b",
          color: "#fafafa",
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <main
            style={{
              flex: 1,
              overflow: "auto",
              marginLeft: 240,
              padding: "32px 48px",
              scrollBehavior: "smooth",
            }}
          >
            {children}
          </main>
        </div>
        <CommandPalette />
      </body>
    </html>
  );
}
