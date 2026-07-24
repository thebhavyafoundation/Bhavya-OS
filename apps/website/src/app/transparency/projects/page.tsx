import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero, StatBox } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { readContentDir, type ContentItem, type ContentEnvelope } from "../../../services/content";

export const metadata: Metadata = buildMetadata({
  title: "Projects — Transparency Portal — Bhavya Foundation",
  description: "Active mission projects with impact metrics, status tracking, and resource allocation.",
  path: "/transparency/projects",
});

interface Project extends ContentItem { name: string; mission: string; budget: string; status: string; impact: string; }

const missionColors: Record<string, string> = { Nature: "tag-green", Heritage: "tag-purple", Knowledge: "tag-blue", Community: "tag-amber", Platform: "tag-blue" };

export default function ProjectsPage() {
  const projects = readContentDir<Project>("projects") as (ContentEnvelope<Project> & { data: Project })[];

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero badge="TRANSPARENCY / PROJECTS" title="Active Mission Projects & Impact Metrics" lead="Every project is tracked with budget classification, status updates, and measurable impact indicators." />
        <div className="container">
          <a href="/transparency" className="breadcrumb">← Back to Transparency Portal</a>
          <p className="content-meta" style={{ marginTop: "16px" }}>Registry last updated: {projects.reduce((l, d) => d.lastUpdated > l ? d.lastUpdated : l, "")}</p>
          <div className="grid-4" style={{ marginTop: "24px", marginBottom: "48px" }}>
            <StatBox value={String(projects.length)} label="Active Projects" />
            <StatBox value={String(new Set(projects.map(p => p.data.mission)).size)} label="Mission Areas" color="blue" />
            <StatBox value="100%" label="Funds to Impact" />
            <StatBox value="0%" label="Admin Overhead" color="amber" />
          </div>
          <div className="table-wrap">
            <table>
              <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Active mission projects</caption>
              <thead><tr><th scope="col">ID</th><th scope="col">Project Name</th><th scope="col">Mission</th><th scope="col">Budget</th><th scope="col">Status</th><th scope="col">Impact</th></tr></thead>
              <tbody>{projects.map(p => (
                <tr key={p.data.id}>
                  <td><code>{p.data.id}</code></td>
                  <td><strong>{p.data.name}</strong></td>
                  <td><span className={`tag ${missionColors[p.data.mission] ?? "tag-blue"}`}>{p.data.mission}</span></td>
                  <td><code>{p.data.budget}</code></td>
                  <td><span className="tag tag-green">{p.data.status}</span></td>
                  <td>{p.data.impact}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
