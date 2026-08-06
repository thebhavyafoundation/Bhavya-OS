import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Updates — Bhavya Foundation",
  description: "Current initiatives, milestones, and impact reports.",
};

export default function ProjectsPage() {
  return (
    <main id="main-content" role="main">
      <section className="container">
        <div className="section-group">
          <p className="section-eyebrow">Transparency Portal</p>
          <h1 className="section-title">Project Updates</h1>
          <p className="section-desc">
            Current initiatives, milestones, and impact reports.
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h2>Bhavya Forest Mission</h2>
            <p>Forest restoration and biodiversity conservation.</p>
          </div>
          <div className="card">
            <h2>Bhavya Knowledge Mission</h2>
            <p>AI education and digital literacy programmes.</p>
          </div>
          <div className="card">
            <h2>Bhavya Heritage Mission</h2>
            <p>Traditional knowledge and cultural preservation.</p>
          </div>
          <div className="card">
            <h2>Bhavya Community Mission</h2>
            <p>Community development and volunteer engagement.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
