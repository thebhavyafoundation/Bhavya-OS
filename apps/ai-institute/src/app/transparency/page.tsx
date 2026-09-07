"use client";

import { useState, useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface FinancialReport {
  id: string;
  title: string;
  period: string;
  status: string;
  type: string;
  totalRevenue: number;
  totalExpenditure: number;
}

interface GovernanceDoc {
  id: string;
  title: string;
  type: string;
  status: string;
  ratified?: string;
}

interface Project {
  id: string;
  name: string;
  mission: string;
  status: string;
  impact: string;
}

interface Policy {
  id: string;
  title: string;
  status: string;
  description: string;
}

interface TransparencyData {
  financials: FinancialReport[];
  governance: GovernanceDoc[];
  projects: Project[];
  policies: Policy[];
}

export default function TransparencyPage() {
  const [data, setData] = useState<TransparencyData>({
    financials: [],
    governance: [],
    projects: [],
    policies: [],
  });

  useEffect(() => {
    fetch("/api/transparency")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Transparency
          </h1>
          <p className="text-text-secondary">
            Open access to our financials, governance, projects, and policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Disclosures */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Financial Disclosures
            </h2>
            {data.financials.length > 0 ? (
              <ul className="space-y-2">
                {data.financials.map((f) => (
                  <li key={f.id} className="text-sm">
                    <span className="text-text-primary font-medium">
                      {f.title}
                    </span>
                    <span className="text-text-tertiary ml-2">
                      ({f.period}) — {f.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">
                Financial reports will be published as they are prepared.
              </p>
            )}
          </div>

          {/* Governance */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Governance
            </h2>
            {data.governance.length > 0 ? (
              <ul className="space-y-2">
                {data.governance.map((g) => (
                  <li key={g.id} className="text-sm">
                    <span className="text-text-primary font-medium">
                      {g.title}
                    </span>
                    <span className="text-text-tertiary ml-2">
                      ({g.type}) — {g.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">
                Governance documents will be published as they are formalized.
              </p>
            )}
          </div>

          {/* Projects */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Projects
            </h2>
            {data.projects.length > 0 ? (
              <ul className="space-y-2">
                {data.projects.map((p) => (
                  <li key={p.id} className="text-sm">
                    <span className="text-text-primary font-medium">
                      {p.name}
                    </span>
                    <span className="text-text-tertiary ml-2">
                      — {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">
                Active and completed projects will be listed here.
              </p>
            )}
          </div>

          {/* Policies */}
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Policies
            </h2>
            {data.policies.length > 0 ? (
              <ul className="space-y-2">
                {data.policies.map((p) => (
                  <li key={p.id} className="text-sm">
                    <span className="text-text-primary font-medium">
                      {p.title}
                    </span>
                    <span className="text-text-tertiary ml-2">
                      — {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">
                Institutional policies will be published for public review.
              </p>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
