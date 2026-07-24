import type { Metadata } from "next";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { PageHero } from "../../../components/ui/PageHero";
import { buildMetadata } from "../../../lib/metadata";
import { readContentDir, type ContentItem, type ContentEnvelope } from "../../../services/content";
import { Leaf, Search, BookOpen, Landmark, Users, Globe, BarChart3, FileText, Map, Target, Lock, Settings, ClipboardList, Edit3, Link, DollarSign, TrendingUp, Check, Rocket, Monitor, Radio, Book, Zap } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Policies — Transparency Portal — Bhavya Foundation",
  description: "Institutional policies, operating procedures, and compliance standards of Bhavya Foundation.",
  path: "/transparency/policies",
});

interface Policy extends ContentItem { status: string; icon: string; description: string; }

const iconMap: Record<string, React.ReactNode> = {
  "🌿": <Leaf size={20} />, "🔍": <Search size={20} />, "📚": <BookOpen size={20} />,
  "🏛️": <Landmark size={20} />, "🤝": <Users size={20} />, "🌐": <Globe size={20} />,
  "📊": <BarChart3 size={20} />, "📄": <FileText size={20} />, "🗺️": <Map size={20} />,
  "🎯": <Target size={20} />, "🔒": <Lock size={20} />, "⚙️": <Settings size={20} />,
  "📋": <ClipboardList size={20} />, "📝": <Edit3 size={20} />, "🔗": <Link size={20} />,
  "💰": <DollarSign size={20} />, "📈": <TrendingUp size={20} />, "✅": <Check size={20} />,
  "🚀": <Rocket size={20} />, "🖥️": <Monitor size={20} />, "📡": <Radio size={20} />,
  "📖": <Book size={20} />, "⚡": <Zap size={20} />,
};

export default function PoliciesPage() {
  const policies = readContentDir<Policy>("policies") as (ContentEnvelope<Policy> & { data: Policy })[];

  return (
    <>
      <Header currentPath="/transparency" />
      <main id="main-content">
        <PageHero badge="TRANSPARENCY / POLICIES" title="Institutional Policies & Operating Standards" lead="Every policy is version-controlled, machine-readable, and publicly accessible." />
        <div className="container">
          <a href="/transparency" className="breadcrumb">← Back to Transparency Portal</a>
          <p className="content-meta" style={{ marginTop: "16px" }}>Registry last updated: {policies.reduce((l, d) => d.lastUpdated > l ? d.lastUpdated : l, "")}</p>
          <div className="grid-2" style={{ marginTop: "16px" }}>
            {policies.map(p => (
              <div className="card" key={p.data.id}>
                <div className="card-header">
                  <span className="card-icon" aria-hidden="true">{iconMap[p.data.icon] ?? p.data.icon}</span>
                  <span className="tag tag-green" style={{ marginLeft: "auto" }}>{p.data.status}</span>
                </div>
                <h3 className="card-title">{p.data.title}</h3>
                <p className="card-desc">{p.data.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
