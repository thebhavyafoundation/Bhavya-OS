import Sidebar from "@/components/Sidebar";

const colors = {
  brand: {
    50: "#f0f7f2", 100: "#d8ead9", 200: "#b1d5b3", 300: "#8abf8d",
    400: "#63aa67", 500: "#2d8a45", 600: "#1a6e34", 700: "#0e382e",
    800: "#0b2d24", 900: "#071c16",
  },
  accent: {
    50: "#fdf8e8", 100: "#f9edc4", 200: "#f3db8a", 300: "#edc94f",
    400: "#e6b82e", 500: "#d4af37", 600: "#b8952d", 700: "#8a6f22",
    800: "#5c4a17", 900: "#40320c",
  },
  forest: {
    50: "#f0f7f2", 100: "#d8ead9", 200: "#b1d5b3", 300: "#8abf8d",
    400: "#63aa67", 500: "#2d8a45", 600: "#1a6e34", 700: "#0e382e",
    800: "#0b2d24", 900: "#071c16",
  },
  heritage: {
    50: "#f2f5f3", 100: "#e0e7e2", 200: "#c1cfc5", 300: "#a2b7a8",
    400: "#8a9a8b", 500: "#6e8270", 600: "#5a6b5c", 700: "#465447",
    800: "#313c33", 900: "#0e2210",
  },
};

const semanticTokens = [
  { name: "--primary", value: "var(--color-brand-700)", color: "#0e382e", description: "Primary brand color (Forest)" },
  { name: "--accent", value: "var(--color-accent-500)", color: "#d4af37", description: "Accent / highlight color (Gold)" },
  { name: "--success", value: "var(--color-forest-500)", color: "#2d8a45", description: "Success state" },
  { name: "--warning", value: "var(--color-accent-500)", color: "#d4af37", description: "Warning state" },
  { name: "--danger", value: "var(--color-red-500)", color: "#c0392b", description: "Error / danger state" },
  { name: "--info", value: "var(--color-heritage-400)", color: "#8a9a8b", description: "Informational state (Sage)" },
];

const spacingTokens = [
  { name: "--space-1", value: "0.25rem", px: "4px" },
  { name: "--space-2", value: "0.5rem", px: "8px" },
  { name: "--space-3", value: "0.75rem", px: "12px" },
  { name: "--space-4", value: "1rem", px: "16px" },
  { name: "--space-6", value: "1.5rem", px: "24px" },
  { name: "--space-8", value: "2rem", px: "32px" },
  { name: "--space-10", value: "2.5rem", px: "40px" },
  { name: "--space-12", value: "3rem", px: "48px" },
  { name: "--space-16", value: "4rem", px: "64px" },
  { name: "--space-20", value: "5rem", px: "80px" },
  { name: "--space-24", value: "6rem", px: "96px" },
];

const shadowTokens = [
  { name: "--shadow-sm", value: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  { name: "--shadow-md", value: "0 4px 6px -1px rgb(0 0 0 / 0.1)" },
  { name: "--shadow-lg", value: "0 10px 15px -3px rgb(0 0 0 / 0.1)" },
  { name: "--shadow-xl", value: "0 20px 25px -5px rgb(0 0 0 / 0.1)" },
];

export default function TokensPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Design Tokens</h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            Primitive, semantic, and component-level tokens for consistent theming.
          </p>

          {/* Colors */}
          <section className="mb-16">
            <h2 className="section-title">Colors</h2>
            <p className="section-subtitle">Brand color palettes with 10 shades each.</p>

            {Object.entries(colors).map(([name, shades]) => (
              <div key={name} className="mb-8">
                <h3 className="text-lg font-semibold capitalize mb-3">{name}</h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(shades).map(([shade, hex]) => (
                    <div key={shade} className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg border border-[var(--border)] mb-1"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-xs text-[var(--text-muted)]">{shade}</span>
                      <br />
                      <span className="text-xs text-[var(--text-subtle)]">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Semantic Tokens */}
          <section className="mb-16">
            <h2 className="section-title">Semantic Tokens</h2>
            <p className="section-subtitle">Meaning-based tokens that map to primitive colors.</p>

            <div className="space-y-3">
              {semanticTokens.map((token) => (
                <div key={token.name} className="token-row">
                  <div
                    className="token-swatch flex-shrink-0"
                    style={{ backgroundColor: token.color }}
                  />
                  <div className="flex-1">
                    <code className="text-sm font-mono">{token.name}</code>
                    <p className="text-xs text-[var(--text-muted)]">{token.description}</p>
                  </div>
                  <code className="text-xs text-[var(--text-subtle)] font-mono">{token.value}</code>
                </div>
              ))}
            </div>
          </section>

          {/* Spacing */}
          <section className="mb-16">
            <h2 className="section-title">Spacing</h2>
            <p className="section-subtitle">Consistent spacing scale for padding, margins, and gaps.</p>

            <div className="space-y-3">
              {spacingTokens.map((token) => (
                <div key={token.name} className="token-row">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="h-3 bg-[var(--primary)] rounded"
                      style={{ width: token.px }}
                    />
                    <code className="text-sm font-mono">{token.name}</code>
                  </div>
                  <code className="text-xs text-[var(--text-subtle)] font-mono">{token.value}</code>
                  <code className="text-xs text-[var(--text-subtle)] font-mono">{token.px}</code>
                </div>
              ))}
            </div>
          </section>

          {/* Shadows */}
          <section className="mb-16">
            <h2 className="section-title">Shadows</h2>
            <p className="section-subtitle">Elevation system for cards, modals, and overlays.</p>

            <div className="grid grid-cols-2 gap-6">
              {shadowTokens.map((token) => (
                <div key={token.name} className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--border)]" style={{ boxShadow: token.value }}>
                  <code className="text-sm font-mono">{token.name}</code>
                  <p className="text-xs text-[var(--text-muted)] mt-2 break-all">{token.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Border Radius */}
          <section className="mb-16">
            <h2 className="section-title">Border Radius</h2>
            <p className="section-subtitle">Consistent rounding for all interactive elements.</p>

            <div className="flex gap-6 flex-wrap">
              {[
                { name: "sm", value: "0.375rem" },
                { name: "md", value: "0.5rem" },
                { name: "lg", value: "0.75rem" },
                { name: "xl", value: "1rem" },
                { name: "2xl", value: "1.5rem" },
                { name: "full", value: "9999px" },
              ].map((r) => (
                <div key={r.name} className="text-center">
                  <div
                    className="w-16 h-16 bg-[var(--primary)] mb-2"
                    style={{ borderRadius: r.value }}
                  />
                  <code className="text-xs font-mono">{r.name}</code>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
