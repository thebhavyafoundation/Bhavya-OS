import Sidebar from "@/components/Sidebar";

const fontFamilies = [
  { name: "Sans (Inter)", value: "Inter, system-ui, sans-serif", variable: "--font-sans" },
  { name: "Mono (JetBrains Mono)", value: "JetBrains Mono, monospace", variable: "--font-mono" },
];

const typeScale = [
  { name: "Display XL", size: "clamp(48px, 8vw, 96px)", lineHeight: "1.05", letterSpacing: "-0.03em", use: "Hero headings" },
  { name: "Display LG", size: "clamp(36px, 6vw, 72px)", lineHeight: "1.1", letterSpacing: "-0.025em", use: "Page titles" },
  { name: "Display MD", size: "clamp(28px, 4vw, 56px)", lineHeight: "1.15", letterSpacing: "-0.02em", use: "Section headings" },
  { name: "Display SM", size: "clamp(22px, 3vw, 40px)", lineHeight: "1.2", letterSpacing: "-0.015em", use: "Subsection headings" },
  { name: "H1", size: "2.25rem (36px)", lineHeight: "1.25", letterSpacing: "-0.02em", use: "Page heading" },
  { name: "H2", size: "1.875rem (30px)", lineHeight: "1.3", letterSpacing: "-0.015em", use: "Section heading" },
  { name: "H3", size: "1.5rem (24px)", lineHeight: "1.35", letterSpacing: "-0.01em", use: "Subsection heading" },
  { name: "H4", size: "1.25rem (20px)", lineHeight: "1.4", letterSpacing: "-0.005em", use: "Card heading" },
  { name: "Body LG", size: "1.125rem (18px)", lineHeight: "1.6", letterSpacing: "0", use: "Lead text, introductions" },
  { name: "Body", size: "1rem (16px)", lineHeight: "1.6", letterSpacing: "0", use: "Default body text" },
  { name: "Body SM", size: "0.875rem (14px)", lineHeight: "1.5", letterSpacing: "0", use: "Secondary text, captions" },
  { name: "Caption", size: "0.75rem (12px)", lineHeight: "1.5", letterSpacing: "0.01em", use: "Labels, metadata" },
  { name: "Overline", size: "0.75rem (12px)", lineHeight: "1.5", letterSpacing: "0.05em", use: "Category labels, uppercase" },
];

const fontWeights = [
  { name: "Regular", value: 400, use: "Body text" },
  { name: "Medium", value: 500, use: "Emphasis, labels" },
  { name: "Semibold", value: 600, use: "Headings, buttons" },
  { name: "Bold", value: 700, use: "Strong emphasis, titles" },
];

export default function TypographyPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Typography</h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            Font families, scale, line heights, and typography patterns.
          </p>

          {/* Font Families */}
          <section className="mb-16">
            <h2 className="section-title">Font Families</h2>
            <p className="section-subtitle">Two families for all interface text.</p>

            <div className="space-y-4">
              {fontFamilies.map((font) => (
                <div key={font.name} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{font.name}</h3>
                    <code className="text-xs bg-[var(--bg-subtle)] px-2 py-1 rounded font-mono">{font.variable}</code>
                  </div>
                  <p style={{ fontFamily: font.value }} className="text-lg">
                    The quick brown fox jumps over the lazy dog. 0123456789
                  </p>
                  <code className="text-xs text-[var(--text-subtle)] mt-2 block font-mono">{font.value}</code>
                </div>
              ))}
            </div>
          </section>

          {/* Type Scale */}
          <section className="mb-16">
            <h2 className="section-title">Type Scale</h2>
            <p className="section-subtitle">Responsive typography for every context.</p>

            <div className="space-y-6">
              {typeScale.map((type) => (
                <div key={type.name} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-muted)]">{type.name}</span>
                    <span className="text-xs text-[var(--text-subtle)]">{type.use}</span>
                  </div>
                  <p
                    style={{
                      fontSize: type.size,
                      lineHeight: type.lineHeight,
                      letterSpacing: type.letterSpacing,
                    }}
                    className="font-semibold"
                  >
                    Bhavya Foundation
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-[var(--text-subtle)] font-mono">
                    <span>{type.size}</span>
                    <span>lh: {type.lineHeight}</span>
                    <span>ls: {type.letterSpacing}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Font Weights */}
          <section className="mb-16">
            <h2 className="section-title">Font Weights</h2>
            <p className="section-subtitle">Four weights for hierarchy and emphasis.</p>

            <div className="space-y-3">
              {fontWeights.map((weight) => (
                <div key={weight.name} className="token-row">
                  <div className="flex-1">
                    <p style={{ fontWeight: weight.value }} className="text-lg">
                      {weight.name} — The quick brown fox
                    </p>
                  </div>
                  <code className="text-xs text-[var(--text-subtle)] font-mono">{weight.value}</code>
                  <span className="text-xs text-[var(--text-muted)]">{weight.use}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Usage */}
          <section className="mb-16">
            <h2 className="section-title">Usage</h2>
            <div className="code-block">
{`// Tailwind classes
<h1 className="text-display-lg font-bold">Page Title</h1>
<p className="text-body-lg text-[var(--text-muted)]">Lead text</p>
<span className="text-caption uppercase tracking-wider">Label</span>

// CSS variables
font-family: var(--font-sans);
font-size: var(--text-lg);
line-height: 1.6;`}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
