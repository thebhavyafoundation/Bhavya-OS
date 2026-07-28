import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Knowledge Platform — Bhavya Foundation",
  description: "Institutional knowledge base: documents, research, standards, policies, and the knowledge graph.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body style={{ margin: 0, background: "#050a14", color: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
