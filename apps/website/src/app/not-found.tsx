import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center", padding: "0 24px" }}>
      <div className="hero-page-badge">404</div>
      <h1 className="hero-page-title" style={{ marginBottom: "16px" }}>Page Not Found</h1>
      <p className="hero-page-lead" style={{ marginBottom: "40px" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="hero-actions">
        <Link href="/" className="btn btn-primary">Return Home →</Link>
        <Link href="/transparency" className="btn btn-secondary">View Transparency Portal</Link>
      </div>
    </main>
  );
}
