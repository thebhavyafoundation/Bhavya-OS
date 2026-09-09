import type { Metadata } from "next";
import "@bhavya/platform-ui";
import "./globals.css";
import MobileMenuToggle from "@/components/MobileMenuToggle";

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
      <head>
        <style>{`
          .skip-link {
            position: absolute;
            left: -10000px;
            top: auto;
            width: 1px;
            height: 1px;
            overflow: hidden;
            z-index: 10000;
          }
          .skip-link:focus {
            position: fixed;
            top: 12px;
            left: 12px;
            width: auto;
            height: auto;
            padding: 8px 16px;
            background: var(--color-brand-forest);
            color: var(--color-brand-ivory);
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            z-index: 10000;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: block !important;
            }
            [data-sidebar] {
              position: fixed !important;
              left: 0;
              top: 0;
              bottom: 0;
              z-index: 1000;
              transform: translateX(-100%);
              transition: transform 0.2s ease;
            }
            [data-sidebar][data-open="true"] {
              transform: translateX(0) !important;
            }
          }
        `}</style>
      </head>
      <body style={{ margin: 0 }}>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <MobileMenuToggle />
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Institutional Sidebar */}
          <aside
            data-sidebar
            data-open="false"
            style={{
              width: 256,
              background: "var(--color-sidebar-bg)",
              borderRight: "1px solid var(--color-sidebar-border)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-accent-gold)",
                }}
              >
                Social OS
              </div>
              <div style={{ fontSize: 11, color: "var(--color-sidebar-text)" }}>
                Communication Operations
              </div>
            </div>
            <nav aria-label="Social OS navigation" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <a
                href="/"
                style={{
                  color: "var(--color-sidebar-text)",
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
                  color: "var(--color-sidebar-text)",
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
                  color: "var(--color-sidebar-text)",
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
                borderTop: "1px solid var(--color-sidebar-border)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <a
                href="/os"
                style={{
                  color: "var(--color-sidebar-text)",
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
                  color: "var(--color-text-secondary)",
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
          <main id="main-content" style={{ flex: 1 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
