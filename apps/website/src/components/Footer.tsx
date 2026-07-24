import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Leaf size={20} color="var(--primary)" aria-hidden="true" />
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Bhavya Foundation</span>
          </div>
          <p className="footer-brand-text">
            Serving nature, knowledge, heritage and community with radical transparency, governance discipline, and an enduring commitment to humanity.
          </p>
        </div>
        <div>
          <div className="footer-col-title">Pillars</div>
          <nav className="footer-links" aria-label="Pillar navigation">
            <a href="/mission">Our Mission</a>
            <a href="/nature">Nature</a>
            <a href="/knowledge">Knowledge</a>
            <a href="/heritage">Heritage</a>
            <a href="/community">Community</a>
          </nav>
        </div>
        <div>
          <div className="footer-col-title">Platform</div>
          <nav className="footer-links" aria-label="Platform navigation">
            <a href="/programs">Programs</a>
            <a href="/transparency">Transparency</a>
            <a href="/about">About</a>
          </nav>
        </div>
        <div>
          <div className="footer-col-title">More</div>
          <nav className="footer-links" aria-label="Legal navigation">
            <a href="/privacy">Privacy Policy</a>
            <a href="/accessibility">Accessibility</a>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Bhavya Foundation</span>
        <span>Built on Bhavya OS v3.0 &middot; Operating with Radical Transparency</span>
      </div>
    </footer>
  );
}
