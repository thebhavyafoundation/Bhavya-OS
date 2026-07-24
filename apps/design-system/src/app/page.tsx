import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Bhavya Foundation Design System
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            Canonical reference for design tokens, components, icons, typography, and patterns
            across all Bhavya Foundation applications.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/tokens" className="block p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
              <h2 className="text-lg font-semibold mb-2">Design Tokens</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Colors, spacing, typography, shadows, and semantic tokens used across all apps.
              </p>
            </a>

            <a href="/components" className="block p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
              <h2 className="text-lg font-semibold mb-2">Components</h2>
              <p className="text-sm text-[var(--text-muted)]">
                BDL primitive components with specs, tokens, and usage examples.
              </p>
            </a>

            <a href="/icons" className="block p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
              <h2 className="text-lg font-semibold mb-2">Icons</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Lucide React icon library with size variants and usage guidelines.
              </p>
            </a>

            <a href="/typography" className="block p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
              <h2 className="text-lg font-semibold mb-2">Typography</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Font families, scale, line heights, and typography patterns.
              </p>
            </a>

            <a href="/patterns" className="block p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
              <h2 className="text-lg font-semibold mb-2">Patterns</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Layout patterns, grid systems, and common UI compositions.
              </p>
            </a>

            <a href="/playground" className="block p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors">
              <h2 className="text-lg font-semibold mb-2">Playground</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Interactive sandbox to test tokens, components, and patterns.
              </p>
            </a>
          </div>

          <div className="mt-12 p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
            <h2 className="text-lg font-semibold mb-3">Quick Start</h2>
            <div className="code-block">
{`// Import tokens
import { tokens } from "@bhavya/design-system";

// Use in your app
<div style={{ color: tokens.colors.brand[500] }}>
  Hello Bhavya
</div>`}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
