export default function HomePage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1 }}>
        Building the Future of AI Education
      </h1>
      <p style={{ fontSize: 18, color: '#666', marginTop: 16 }}>
        Learn AI by building real projects. From beginner to contributor in 6 months.
      </p>

      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700 }}>Start Your Journey</h2>
        <ul style={{ marginTop: 16, lineHeight: 2 }}>
          <li><a href="/docs/ai-institute">AI Foundations</a> — Master the fundamentals</li>
          <li><a href="/docs/kp/kp-001">Knowledge Packages</a> — Interactive learning modules</li>
          <li><a href="/blog">Blog</a> — Updates and insights</li>
        </ul>
      </div>

      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        <div style={{ padding: 24, border: '1px solid #e5e5e5', borderRadius: 12 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600 }}>Hands-On Learning</h3>
          <p style={{ color: '#666', marginTop: 8 }}>Every concept comes with a project. Build while you learn.</p>
        </div>
        <div style={{ padding: 24, border: '1px solid #e5e5e5', borderRadius: 12 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600 }}>Open Source</h3>
          <p style={{ color: '#666', marginTop: 8 }}>Contribute to real projects. Build your portfolio.</p>
        </div>
        <div style={{ padding: 24, border: '1px solid #e5e5e5', borderRadius: 12 }}>
          <h3 style={{ fontSize: 20, fontWeight: 600 }}>Community</h3>
          <p style={{ color: '#666', marginTop: 8 }}>Learn with others. Mentor those who follow.</p>
        </div>
      </div>
    </main>
  );
}
