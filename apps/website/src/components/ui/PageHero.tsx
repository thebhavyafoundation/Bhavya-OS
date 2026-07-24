import type { ReactNode } from "react";

interface PageHeroProps {
  badge: string;
  title: string;
  lead: string;
  children?: ReactNode;
}

export function PageHero({ badge, title, lead, children }: PageHeroProps) {
  return (
    <section className="hero-section" aria-labelledby="page-hero-title">
      <div className="hero-page">
        <div className="hero-page-badge">{badge}</div>
        <h1 className="hero-page-title" id="page-hero-title">{title}</h1>
        <p className="hero-page-lead">{lead}</p>
        {children && <div style={{ marginTop: 32 }}>{children}</div>}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="section-group">
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {description && <p className="section-desc">{description}</p>}
    </div>
  );
}

interface StatBoxProps {
  value: string;
  label: string;
  color?: "primary" | "blue" | "amber" | "purple";
}

export function StatBox({ value, label, color = "primary" }: StatBoxProps) {
  return (
    <div className="stat-box">
      <div className={`stat-number ${color}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  const Tag = href ? "a" : "div";
  const linkProps = href ? { href, style: { textDecoration: "none", color: "inherit", display: "block" } as const } : {};
  return (
    <Tag className="card" role={!href ? undefined : "listitem"} {...linkProps}>
      <div className="card-icon" aria-hidden="true">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>
    </Tag>
  );
}

interface DataTableProps {
  columns: { key: string; label: string }[];
  rows: Record<string, ReactNode>[];
  caption?: string;
}

export function DataTable({ columns, rows, caption }: DataTableProps) {
  return (
    <div className="table-wrap" role="region" aria-label={caption}>
      <table>
        {caption && <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map(col => <th key={col.key} scope="col">{col.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map(col => <td key={col.key}>{row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
}

export function ContentSection({ children, className = "" }: ContentSectionProps) {
  return <div className={`container ${className}`}>{children}</div>;
}
