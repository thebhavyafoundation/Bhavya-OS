"use client";

import { useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader } from "../../components/ui/PageHero";
import {
  Shield,
  FileText,
  DollarSign,
  Users,
  Scale,
  BookOpen,
} from "lucide-react";
import { useGsapStagger, useGsapFadeIn } from "../../lib/animations";

const policies = [
  {
    icon: <FileText />,
    title: "Code of Ethics",
    desc: "Standards of conduct for every Trustee, employee, volunteer, and representative — integrity, honesty, respect, accountability, and transparency.",
    tag: "BF-CODE-001",
  },
  {
    icon: <Scale />,
    title: "Conflict of Interest Policy",
    desc: "Procedures to identify, disclose, manage, and eliminate conflicts of interest. Protecting the Foundation's integrity and public trust.",
    tag: "BF-POL-001",
  },
  {
    icon: <DollarSign />,
    title: "Financial Management & Procurement",
    desc: "Robust financial management practices ensuring accountability, transparency, lawful compliance, prudent stewardship, and long-term sustainability.",
    tag: "BF-FIN-001",
  },
  {
    icon: <DollarSign />,
    title: "Donation Acceptance Policy",
    desc: "Principles governing the acceptance, management, and refusal of donations — ensuring every contribution strengthens the Foundation's integrity.",
    tag: "BF-FIN-002",
  },
  {
    icon: <Users />,
    title: "Volunteer Policy",
    desc: "Framework for recruiting, supporting, supervising, and recognizing volunteers through the Bhavya Volunteer Corps.",
    tag: "BF-HR-001",
  },
  {
    icon: <Shield />,
    title: "Child Protection & Safeguarding",
    desc: "Zero-tolerance approach to abuse, neglect, or exploitation. Every child's safety and dignity takes precedence over institutional reputation.",
    tag: "BF-SAFE-001",
  },
  {
    icon: <BookOpen />,
    title: "Environmental Conservation",
    desc: "Environmental principles, standards, and operational framework governing all conservation activities — ecology before optics.",
    tag: "BF-ENV-001",
  },
  {
    icon: <BookOpen />,
    title: "AI Ethics & Responsible AI",
    desc: "Ethical principles governing all AI-related activities — human dignity, transparency, fairness, safety, privacy, and accountability.",
    tag: "BF-AI-001",
  },
  {
    icon: <BookOpen />,
    title: "Digital Library Policy",
    desc: "Equitable access to books, research, digital resources, AI tools, and lifelong learning opportunities for all.",
    tag: "BF-KNOW-001",
  },
];

const governancePrinciples = [
  {
    title: "Public Benefit",
    desc: "Resources used only to advance the Foundation's charitable purposes.",
  },
  {
    title: "Stewardship",
    desc: "Every expenditure represents prudent use of charitable funds.",
  },
  {
    title: "Transparency",
    desc: "Financial information recorded accurately and reported honestly.",
  },
  {
    title: "Accountability",
    desc: "Authority over finances always accompanied by responsibility.",
  },
  {
    title: "Sustainability",
    desc: "Financial planning supports the Foundation's long-term resilience.",
  },
  {
    title: "Independence",
    desc: "Donors do not receive governance rights. The Foundation preserves institutional independence.",
  },
];

export default function TransparencyPage() {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();

  const filteredPolicies = policies.filter(
    (p) =>
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q),
  );

  const principlesRef = useGsapStagger(governancePrinciples.length);
  const policiesRef = useGsapStagger(filteredPolicies.length);
  const quoteRef = useGsapFadeIn();

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero
          badge="TRANSPARENCY PORTAL"
          title="Governance, Ethics & Accountability"
          lead="Bhavya Foundation operates with radical transparency. Every governance document, financial policy, and ethical standard is publicly available. Trust is our most valuable asset."
        />
        <div className="container">
          <div className="search-bar" style={{ marginBottom: "32px" }}>
            <input
              type="search"
              className="search-input"
              placeholder="Search policies and governance..."
              aria-label="Search transparency portal"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <SectionHeader
            eyebrow="Governance Principles"
            title="How We Govern"
            description="Every financial and governance decision is guided by these principles — established in our Constitution and Trust Deed."
          />
          <div
            className="grid-3"
            style={{ marginBottom: "64px" }}
            ref={principlesRef}
          >
            {governancePrinciples.map((p, i) => (
              <div key={i} className="info-card">
                <div className="info-card-title">{p.title}</div>
                <div className="info-card-desc">{p.desc}</div>
              </div>
            ))}
          </div>

          <SectionHeader
            eyebrow="Institutional Policies"
            title="Governance Documents"
            description="Every policy is approved by the Board of Trustees and reviewed regularly to ensure compliance and effectiveness."
          />
          <div
            className="grid-3"
            style={{ marginBottom: "64px" }}
            ref={policiesRef}
          >
            {filteredPolicies.map((p, i) => (
              <div key={i} className="card">
                <div className="card-header">
                  <span className="card-icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  <span
                    className="tag tag-green"
                    style={{ marginLeft: "auto" }}
                  >
                    {p.tag}
                  </span>
                </div>
                <h3 className="card-title">{p.title}</h3>
                <p className="card-desc">{p.desc}</p>
              </div>
            ))}
          </div>

          <SectionHeader
            eyebrow="Financial Stewardship"
            title="Our Commitment to Resources"
          />
          <div
            className="info-card"
            style={{ maxWidth: 800, marginBottom: 64 }}
            ref={quoteRef}
          >
            <div
              className="info-card-desc"
              style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
            >
              "Financial stewardship is not measured by how much money an
              institution raises, but by how responsibly it manages every
              resource entrusted to it. Every expenditure of Bhavya Foundation
              shall reflect integrity, prudence, and accountability."
            </div>
            <div className="content-meta" style={{ marginTop: 12 }}>
              — From the Financial Management & Procurement Policy
            </div>
          </div>

          <SectionHeader
            eyebrow="Donor Principles"
            title="Our Commitment to Giving"
          />
          <div className="info-card" style={{ maxWidth: 800 }}>
            <div
              className="info-card-desc"
              style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
            >
              "We shall never pursue funding at the cost of our principles.
              Resources can be rebuilt; trust, once lost, is difficult to
              restore. Every contribution accepted by Bhavya Foundation must
              strengthen both our mission and our integrity."
            </div>
            <div className="content-meta" style={{ marginTop: 12 }}>
              — Shri Manohar Lal, Founder
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
