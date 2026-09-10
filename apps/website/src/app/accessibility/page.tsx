import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader } from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement — Bhavya Foundation",
  description: "Bhavya Foundation's commitment to digital accessibility, WCAG AA compliance, and inclusive design.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  const skip = { href: "#main-content", "aria-label": "Skip to main content", className: "skip-link" };

  return (
    <>
      <Header currentPath="/accessibility" />
      <main id="main-content">
        <PageHero
          badge="ACCESSIBILITY"
          title="Commitment to Inclusive Digital Access"
          lead="Bhavya Foundation is committed to ensuring digital accessibility for all users, regardless of ability. We conform to WCAG AA standards as our baseline."
        />

        <div className="container">
          <SectionHeader eyebrow="Standards" title="Accessibility Features" />

          <div className="grid-2" style={{ marginBottom: "64px" }}>
            <div className="card">
              <h3 className="card-title">Keyboard Navigation</h3>
              <p className="card-desc">All interactive elements are fully operable via keyboard. Focus indicators are visible and meet 3:1 contrast ratio. Tab order follows logical document flow.</p>
            </div>
            <div className="card">
              <h3 className="card-title">Screen Reader Support</h3>
              <p className="card-desc">All content uses semantic HTML landmarks (header, nav, main, footer, section). ARIA labels and roles are applied where needed. Skip links are provided on every page.</p>
            </div>
            <div className="card">
              <h3 className="card-title">Color & Contrast</h3>
              <p className="card-desc">Text meets WCAG AA 4.5:1 contrast ratio. Information is never conveyed by color alone. Supports prefers-reduced-motion and dark mode natively.</p>
            </div>
            <div className="card">
              <h3 className="card-title">Screen Magnification</h3>
              <p className="card-desc">Layouts are responsive up to 200% browser zoom without horizontal scrolling. Font sizes use relative units (rem, clamp) throughout.</p>
            </div>
          </div>

          <SectionHeader eyebrow="Technical" title="Accessibility API Configuration" />

          <div className="table-wrap" style={{ marginBottom: "64px" }}>
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Accessibility configuration reference</caption>
              <thead>
                <tr>
                  <th scope="col">Property</th>
                  <th scope="col">Value</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>skipLinkTarget</code></td><td><code>{skip.href}</code></td><td>Skip navigation target anchor</td></tr>
                <tr><td><code>aria-label</code></td><td><code>{skip["aria-label"]}</code></td><td>Screen reader skip link label</td></tr>
                <tr><td><code>className</code></td><td><code>{skip.className}</code></td><td>Skip link CSS class</td></tr>
                <tr><td><code>landmarks</code></td><td><code>banner, navigation, main, contentinfo</code></td><td>Semantic HTML5 landmarks used</td></tr>
              </tbody>
            </table>
          </div>

          <SectionHeader eyebrow="Report an Issue" title="Accessibility Feedback" />
          <p style={{ fontSize: 15, color: "var(--text-2)", maxWidth: 640, lineHeight: 1.65, marginTop: 12 }}>
            If you encounter any accessibility barriers on this website, please contact our team through the Community page. We aim to respond within 5 business days and will work to resolve issues promptly.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
