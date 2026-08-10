"use client";

import { useState, useEffect } from "react";

interface TransparencyData {
  financials?: unknown[];
  governance?: unknown[];
  projects?: unknown[];
  policies?: unknown[];
}

export default function TransparencyPage() {
  const [data, setData] = useState<TransparencyData>({});

  useEffect(() => {
    fetch("/api/transparency")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
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
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Financial Disclosures
            </h2>
            <p className="text-sm text-text-secondary">
              Financial data will be published here.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Governance
            </h2>
            <p className="text-sm text-text-secondary">
              Governance documents and decisions.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Projects
            </h2>
            <p className="text-sm text-text-secondary">
              Active and completed projects.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-3">
              Policies
            </h2>
            <p className="text-sm text-text-secondary">
              Institutional policies and standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
