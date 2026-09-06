"use client";

import { BhavyaLogo } from "./BhavyaLogo";
import { getFooterColumns } from "@/lib/useNavigation";

export function SiteFooter() {
  const footerColumns = getFooterColumns();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <BhavyaLogo size="sm" />
          <p
            className="footer-brand-name"
            style={{ marginTop: "var(--space-4)" }}
          >
            Bhavya Foundation
          </p>
          <p className="footer-brand-desc">
            A living institution connecting nature, knowledge, heritage, and
            community. Constitution bound. Community governed. Transparency
            first.
          </p>
          <div className="footer-status">
            <div className="footer-status-dot" />
            Building in the open
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="footer-col">
            <h4 className="footer-col-title">{column.title}</h4>
            <nav>
              {column.links.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>Bhavya Foundation. Constitution of Bhavya Foundation.</p>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <a href="/privacy">Privacy</a>
          <a href="/accessibility">Accessibility</a>
        </div>
      </div>
    </footer>
  );
}
