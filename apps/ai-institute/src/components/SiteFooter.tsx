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
            <a href="/missions/forest">Forest</a>
            <a href="/missions/knowledge">Knowledge</a>
            <a href="/missions/heritage">Heritage</a>
            <a href="/missions/community">Community</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Learn</h4>
          <nav>
            <a href="/courses">Courses</a>
            <a href="/learning-paths">Learning Paths</a>
            <a href="/research">Research</a>
            <a href="/impact">Impact</a>
            <a href="/library">Library</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Governance</h4>
          <nav>
            <a href="/about">About</a>
            <a href="/transparency">Transparency</a>
            <a href="/contributing">Contributing</a>
            <a href="/accessibility">Accessibility</a>
          </nav>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Platform</h4>
          <nav>
            <a href="/os">Bhavya OS</a>
            <a href="/os/api-explorer">API Explorer</a>
            <a href="/login">Sign In</a>
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
