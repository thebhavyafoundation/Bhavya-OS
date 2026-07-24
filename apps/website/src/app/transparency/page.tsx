"use client";

import { useState } from "react";
import { RegistryReader } from "@bhavya/mission-runtime";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, StatBox } from "../../components/ui/PageHero";
import { ClipboardList, DollarSign, Search, FileText, Leaf, Tag } from "lucide-react";

interface ServiceItem { id: string; name: string; endpoint: string; status: string; }
interface AgentItem { id: string; name: string; role: string; }

const portalSections = [
  { icon: <ClipboardList size={20} />, title: "Governance", desc: "Board resolutions, governing documents, and institutional decisions.", href: "/transparency/governance" },
  { icon: <DollarSign size={20} />, title: "Financials", desc: "Annual reports, financial statements, and donation records.", href: "/transparency/financials" },
  { icon: <Search size={20} />, title: "Audit Log", desc: "Decision audit trail with actor, action, and timestamp records.", href: "/transparency/audit" },
  { icon: <FileText size={20} />, title: "Policies", desc: "Institutional policies, standards, and operating procedures.", href: "/transparency/policies" },
  { icon: <Leaf size={20} />, title: "Projects", desc: "Active mission projects with impact metrics and status tracking.", href: "/transparency/projects" },
  { icon: <Tag size={20} />, title: "Releases", desc: "Versioned platform release history with changelogs.", href: "/transparency/releases" },
];

function loadRegistryData() {
  const registry = new RegistryReader();
  return {
    services: registry.read<{ items: ServiceItem[] }>("services.json")?.items ?? [],
    agents: registry.read<{ items: AgentItem[] }>("agents.json")?.items ?? [],
  };
}

export default function TransparencyPage() {
  const { services, agents } = loadRegistryData();
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();

  const filteredServices = services.filter(s =>
    s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.endpoint.toLowerCase().includes(q)
  );
  const filteredAgents = agents.filter(a =>
    a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)
  );
  const filteredSections = portalSections.filter(s =>
    s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
  );

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero
          badge="TRANSPARENCY PORTAL"
          title="Live Public Governance & Service Monitor"
          lead="Every institutional decision, system service, active agent, and architecture contract is exposed via machine-verifiable public APIs and live registries."
        />

        <div className="container">
          <div className="search-bar" style={{ marginBottom: "32px" }}>
            <input type="search" className="search-input" placeholder="Filter services, agents, sections..." aria-label="Filter transparency portal" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="grid-4" style={{ marginBottom: "48px" }}>
            <StatBox value={String(services.length)} label="Active Services" />
            <StatBox value={String(agents.length)} label="Registered Agents" color="blue" />
            <StatBox value="7" label="Portal Sections" color="purple" />
            <StatBox value="100%" label="Deterministic Index" color="amber" />
          </div>

          {filteredSections.length > 0 && (
            <>
              <h2 className="section-title" style={{ marginBottom: "24px" }}>Portal Sections</h2>
              <div className="grid-3" role="list" style={{ marginBottom: "48px" }}>
                {filteredSections.map(s => (
                  <a key={s.href} href={s.href} className="portal-card" role="listitem">
                    <span className="portal-card-icon" aria-hidden="true">{s.icon}</span>
                    <h3 className="portal-card-title">{s.title}</h3>
                    <p className="portal-card-desc">{s.desc}</p>
                  </a>
                ))}
              </div>
            </>
          )}

          {(!search || filteredServices.length > 0) && (
            <>
              <h2 className="section-title" style={{ marginBottom: "24px" }}>Service Registry ({filteredServices.length})</h2>
              <div className="table-wrap" style={{ marginBottom: "48px" }}>
                <table>
                  <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Registered platform services</caption>
                  <thead>
                    <tr>
                      <th scope="col">Service ID</th>
                      <th scope="col">Service Name</th>
                      <th scope="col">Endpoint</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map(svc => (
                      <tr key={svc.id}>
                        <td><code>{svc.id}</code></td>
                        <td><strong>{svc.name}</strong></td>
                        <td><code>{svc.endpoint}</code></td>
                        <td><span className={`tag ${svc.status === 'active' ? 'tag-green' : 'tag-blue'}`}>{svc.status.toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {(!search || filteredAgents.length > 0) && (
            <>
              <h2 className="section-title" style={{ marginBottom: "24px" }}>Registered Agents ({filteredAgents.length})</h2>
              <div className="table-wrap" style={{ marginBottom: "48px" }}>
                <table>
                  <caption style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden" }}>Registered autonomous agents</caption>
                  <thead>
                    <tr>
                      <th scope="col">Agent ID</th>
                      <th scope="col">Agent Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map(agent => (
                      <tr key={agent.id}>
                        <td><code>{agent.id}</code></td>
                        <td><strong>{agent.name}</strong></td>
                        <td>{agent.role}</td>
                        <td><span className="tag tag-green">ACTIVE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!filteredSections.length && !filteredServices.length && !filteredAgents.length && (
            <p>No results found for &ldquo;{search}&rdquo;. Try a different search term.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
