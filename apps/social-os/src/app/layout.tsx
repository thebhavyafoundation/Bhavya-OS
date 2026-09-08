import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "Social OS — Bhavya Foundation",
  description:
    "Content publishing and social media management for Bhavya Foundation",
};

export default function SocialOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Institutional Sidebar */}
          <aside
            style={{
              width: 256,
              background: "#0a1f1a",
              borderRight: "1px solid #1a3a2e",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#D4AF37" }}>
                Social OS
              </div>
              <div style={{ fontSize: 11, color: "#8A9A8B" }}>
                Communication Operations
              </div>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a
                href="/"
                style={{
                  color: "#8A9A8B",
                  textDecoration: "none",
                  fontSize: 14,
                  padding: "8px 12px",
                  borderRadius: 6,
                }}
              >
                Home
              </a>
              <a
                href="/dashboard"
                style={{
                  color: "#8A9A8B",
                  textDecoration: "none",
                  fontSize: 14,
                  padding: "8px 12px",
                  borderRadius: 6,
                }}
              >
                Dashboard
              </a>
              <a
                href="/ceo"
                style={{
                  color: "#8A9A8B",
                  textDecoration: "none",
                  fontSize: 14,
                  padding: "8px 12px",
                  borderRadius: 6,
                }}
              >
                CEO View
              </a>
            </nav>
            {/* Institutional Return Path */}
            <div
              style={{
                marginTop: "auto",
                paddingTop: 16,
                borderTop: "1px solid #1a3a2e",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <a
                href="/os"
                style={{
                  color: "#8A9A8B",
                  textDecoration: "none",
                  fontSize: 14,
                  padding: "8px 12px",
                  borderRadius: 6,
                }}
              >
                Bhavya OS
              </a>
              <a
                href="/"
                style={{
                  color: "#6A7C52",
                  textDecoration: "none",
                  fontSize: 11,
                  padding: "4px 12px",
                }}
              >
                Bhavya Foundation
              </a>
            </div>
          </aside>
          {/* Main Content */}
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
