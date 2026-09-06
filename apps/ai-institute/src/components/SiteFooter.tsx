"use client";

import { BhavyaLogo } from "./BhavyaLogo";
import { getFooterColumns } from "@/lib/useNavigation";

export function SiteFooter() {
  // Read footer columns from canonical registry
  const footerColumns = getFooterColumns();

  return (
    <footer
      style={{
        background: "var(--color-forest-950)",
        color: "var(--color-text-inverse)",
        padding: "var(--space-16) 0 var(--space-8)",
      }}
    >
      <div className="container">
        {/* Top section — logo + tagline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "var(--space-12)",
            paddingBottom: "var(--space-8)",
            borderBottom: "1px solid rgba(247, 244, 236, 0.1)",
          }}
        >
          <div>
            <BhavyaLogo size="sm" />
            <p
              style={{
                marginTop: "var(--space-4)",
                fontSize: "var(--text-sm)",
                color: "rgba(247, 244, 236, 0.6)",
                maxWidth: "300px",
                lineHeight: 1.6,
              }}
            >
              A living institution connecting nature, knowledge, heritage, and
              community. Constitution bound. Community governed.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              fontSize: "var(--text-xs)",
              color: "rgba(247, 244, 236, 0.4)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "var(--radius-full)",
                background: "var(--color-accent-green)",
                animation: "pulse-soft 2s ease-in-out infinite",
              }}
            />
            Building in the open
          </div>
        </div>

        {/* Columns grid — from registry */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "var(--space-8)",
            marginBottom: "var(--space-12)",
          }}
        >
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-text-inverse)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {column.title}
              </h4>
              <nav>
                {column.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "block",
                      fontSize: "var(--text-sm)",
                      color: "rgba(247, 244, 236, 0.5)",
                      textDecoration: "none",
                      padding: "var(--space-1) 0",
                      transition: "color var(--duration-fast) ease",
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "var(--space-6)",
            borderTop: "1px solid rgba(247, 244, 236, 0.1)",
            fontSize: "var(--text-xs)",
            color: "rgba(247, 244, 236, 0.4)",
          }}
        >
          <p>© 2026 Bhavya Foundation. Building for Generations.</p>
          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            <a
              href="/privacy"
              style={{
                color: "rgba(247, 244, 236, 0.4)",
                textDecoration: "none",
              }}
            >
              Privacy
            </a>
            <a
              href="/terms"
              style={{
                color: "rgba(247, 244, 236, 0.4)",
                textDecoration: "none",
              }}
            >
              Terms
            </a>
            <a
              href="/accessibility"
              style={{
                color: "rgba(247, 244, 236, 0.4)",
                textDecoration: "none",
              }}
            >
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
