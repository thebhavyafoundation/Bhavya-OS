"use client";

import { BhavyaLogo } from "./BhavyaLogo";

export function SiteFooter() {
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
            A nation-scale institution for knowledge, nature, and community.
            Constitution bound. Community governed. Transparency first.
          </p>
          <div className="footer-status">
            <div className="footer-status-dot" />
            Building in the open
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Missions</h4>
          <nav>
            <a href="/forest">Forest</a>
            <a href="/knowledge">Knowledge</a>
            <a href="/heritage">Heritage</a>
            <a href="/community">Community</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Learn</h4>
          <nav>
            <a href="/knowledge/academy">Academy</a>
            <a href="/knowledge/library">Library</a>
            <a href="/knowledge/ai">AI Labs</a>
            <a href="/knowledge/research">Research</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Institution</h4>
          <nav>
            <a href="/about">About</a>
            <a href="/transparency">Transparency</a>
            <a href="/donate">Donate</a>
            <a href="/mission">Constitution</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Connect</h4>
          <nav>
            <a href="/community">Community</a>
            <a href="https://github.com/thebhavyafoundation">GitHub</a>
            <a href="mailto:hello@bhavyafoundation.org">Email</a>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Bhavya Foundation. Constitution of Bhavya Foundation.</p>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}
