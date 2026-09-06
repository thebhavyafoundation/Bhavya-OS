import type { Metadata } from "next";
import {
  Keyboard,
  Monitor,
  Eye,
  Maximize,
  AlertCircle,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility Statement — Bhavya Foundation",
  description:
    "Bhavya Foundation's commitment to digital accessibility, WCAG AA compliance, and inclusive design.",
};

const features = [
  {
    icon: Keyboard,
    title: "Keyboard Navigation",
    description:
      "All interactive elements are fully operable via keyboard. Focus indicators are visible and meet 3:1 contrast ratio. Tab order follows logical document flow.",
  },
  {
    icon: Monitor,
    title: "Screen Reader Support",
    description:
      "All content uses semantic HTML landmarks (header, nav, main, footer, section). ARIA labels and roles are applied where needed. Skip links are provided on every page.",
  },
  {
    icon: Eye,
    title: "Color & Contrast",
    description:
      "Text meets WCAG AA 4.5:1 contrast ratio. Information is never conveyed by color alone. Supports prefers-reduced-motion and dark mode natively.",
  },
  {
    icon: Maximize,
    title: "Screen Magnification",
    description:
      "Layouts are responsive up to 200% browser zoom without horizontal scrolling. Font sizes use relative units (rem, clamp) throughout.",
  },
];

const config = [
  {
    property: "skipLinkTarget",
    value: "#main-content",
    description: "Skip navigation target anchor",
  },
  {
    property: "aria-label",
    value: "Skip to main content",
    description: "Screen reader skip link label",
  },
  {
    property: "landmarks",
    value: "banner, navigation, main, contentinfo",
    description: "Semantic HTML5 landmarks used",
  },
  {
    property: "focusIndicator",
    value: "3:1 contrast ratio",
    description: "Visible focus ring on interactive elements",
  },
  {
    property: "contrastRatio",
    value: "WCAG AA 4.5:1",
    description: "Minimum text contrast ratio",
  },
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3">
            Accessibility
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Commitment to Inclusive Digital Access
          </h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Bhavya Foundation is committed to ensuring digital accessibility for
            all users, regardless of ability. We conform to WCAG AA standards as
            our baseline.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-2 text-center">
            Accessibility Features
          </h2>
          <p className="text-sm text-text-secondary text-center mb-8">
            Our platform is designed to be accessible to the widest possible
            audience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-bg-secondary border border-border-primary rounded-lg p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-4.5 h-4.5 text-accent-gold" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary mb-1">
                    {f.title}
                  </div>
                  <div className="text-xs text-text-tertiary leading-relaxed">
                    {f.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold text-text-primary mb-2 text-center">
            Technical Configuration
          </h2>
          <p className="text-sm text-text-secondary text-center mb-8">
            Accessibility API configuration reference.
          </p>
          <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-primary">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Property
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Value
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {config.map((row) => (
                  <tr
                    key={row.property}
                    className="border-b border-border-primary last:border-0"
                  >
                    <td className="px-5 py-3">
                      <code className="text-xs text-accent-gold font-mono">
                        {row.property}
                      </code>
                    </td>
                    <td className="px-5 py-3">
                      <code className="text-xs text-text-secondary font-mono">
                        {row.value}
                      </code>
                    </td>
                    <td className="px-5 py-3 text-xs text-text-tertiary">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-bg-secondary border border-accent-gold/20 rounded-xl p-8 text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-5 h-5 text-accent-gold" />
          </div>
          <h2 className="text-lg font-bold text-text-primary mb-2">
            Accessibility Feedback
          </h2>
          <p className="text-sm text-text-secondary mb-4 max-w-lg mx-auto">
            If you encounter any accessibility barriers on this website, please
            contact our team. We aim to respond within 5 business days and will
            work to resolve issues promptly.
          </p>
          <a
            href="mailto:accessibility@bhavyafoundation.org"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-gold text-text-inverse font-semibold text-sm hover:bg-accent-gold-hover transition-colors"
          >
            <Mail className="w-4 h-4" />
            Report an Issue
          </a>
        </div>
      </section>
    </div>
  );
}
