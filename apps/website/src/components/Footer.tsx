import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Leaf size={20} color="var(--primary)" aria-hidden="true" />
            <span
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              Bhavya Foundation
            </span>
          </div>
          <p className="footer-brand-text">
            Restoring nature. Empowering humanity. Preserving heritage. A public
            charitable trust built for generations.
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              marginTop: "var(--space-5)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "var(--font-mono)",
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  boxShadow: "0 0 0 4px var(--primary-glow)",
                  animation: "pulse 2s infinite",
                }}
              />
              Active since 2026
            </span>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Missions</div>
          <nav className="footer-links" aria-label="Mission navigation">
            <a href="/nature">Bhavya Forest Mission</a>
            <a href="/knowledge">Bhavya Knowledge Mission</a>
            <a href="/heritage">Bhavya Heritage Mission</a>
            <a href="/community">Bhavya Community Mission</a>
          </nav>
        </div>
        <div>
          <div className="footer-col-title">Governance</div>
          <nav className="footer-links" aria-label="Governance navigation">
            <a href="/about">About</a>
            <a href="/transparency">Transparency</a>
            <a href="/about">Governance Structure</a>
            <a href="/mission">Constitution</a>
          </nav>
        </div>
        <div>
          <div className="footer-col-title">Legal</div>
          <nav className="footer-links" aria-label="Legal navigation">
            <a href="/privacy">Privacy Policy</a>
            <a href="/accessibility">Accessibility</a>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Bhavya Foundation</span>
        <span>Built for Generations &middot; Nature. Knowledge. Heritage.</span>
      </div>
    </footer>
  );
}
