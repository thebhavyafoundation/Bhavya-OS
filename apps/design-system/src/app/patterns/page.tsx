import Sidebar from "@/components/Sidebar";

const patterns = [
  {
    name: "Page Header",
    description: "Standard page header with title, subtitle, and optional actions.",
    code: `<div className="hero-section">
  <span className="hero-badge">New</span>
  <h1 className="hero-title">Page Title</h1>
  <p className="hero-subtitle">Page description text</p>
  <div className="hero-actions">
    <button className="btn btn-primary">Primary Action</button>
    <button className="btn btn-secondary">Secondary</button>
  </div>
</div>`,
  },
  {
    name: "Card Grid",
    description: "Responsive grid of cards for features, projects, or content items.",
    code: `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">
    <div className="card-header">
      <Icon size={20} />
      <h3>Card Title</h3>
    </div>
    <p>Card description text</p>
  </div>
</div>`,
  },
  {
    name: "Stat Box",
    description: "Metric display with label, value, and optional trend indicator.",
    code: `<div className="stat-box">
  <span className="stat-label">Total Projects</span>
  <span className="stat-value">42</span>
  <span className="stat-trend positive">+12%</span>
</div>`,
  },
  {
    name: "Section Header",
    description: "Section divider with title and optional description.",
    code: `<div className="section-header">
  <h2 className="section-title">Section Title</h2>
  <p className="section-subtitle">Section description</p>
</div>`,
  },
  {
    name: "Navigation Bar",
    description: "Top navigation with logo, links, and utility actions.",
    code: `<header className="nav-header">
  <div className="nav-brand">
    <Logo size={24} />
    <span>Bhavya Foundation</span>
  </div>
  <nav className="nav-links">
    <a href="/mission">Mission</a>
    <a href="/programs">Programs</a>
    <a href="/transparency">Transparency</a>
  </nav>
  <div className="nav-actions">
    <ThemeToggle />
    <MobileMenu />
  </div>
</header>`,
  },
  {
    name: "Footer",
    description: "Site footer with columns, links, and copyright.",
    code: `<footer className="footer">
  <div className="footer-grid">
    <div className="footer-brand">
      <Logo />
      <p>Bhavya Foundation</p>
    </div>
    <div className="footer-links">
      <h4>Pillars</h4>
      <a href="/mission">Mission</a>
      <a href="/programs">Programs</a>
    </div>
    <div className="footer-links">
      <h4>Legal</h4>
      <a href="/privacy">Privacy</a>
      <a href="/accessibility">Accessibility</a>
    </div>
  </div>
  <div className="footer-bottom">
    <p>&copy; 2026 Bhavya Foundation</p>
  </div>
</footer>`,
  },
  {
    name: "Form Layout",
    description: "Standard form layout with labels, inputs, and validation.",
    code: `<form className="form-layout">
  <div className="form-group">
    <label htmlFor="name">Full Name</label>
    <input id="name" type="text" placeholder="Enter name" />
    <span className="form-hint">Required field</span>
  </div>
  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input id="email" type="email" placeholder="you@example.com" />
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form>`,
  },
  {
    name: "Timeline",
    description: "Vertical timeline for milestones, releases, or history.",
    code: `<div className="timeline">
  <div className="timeline-item">
    <div className="timeline-dot active" />
    <div className="timeline-content">
      <span className="timeline-date">Jan 2026</span>
      <h3>Milestone Title</h3>
      <p>Description text</p>
    </div>
  </div>
</div>`,
  },
];

export default function PatternsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Patterns</h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            Layout patterns, grid systems, and common UI compositions.
          </p>

          <div className="space-y-8">
            {patterns.map((pattern) => (
              <div
                key={pattern.name}
                className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <h2 className="text-xl font-semibold mb-2">{pattern.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">{pattern.description}</p>
                <div className="code-block text-xs">{pattern.code}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
