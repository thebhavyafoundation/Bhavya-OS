import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CTABand } from "@/components/site/CTABand";
import { referencePapers } from "@/data/reference-papers";

export const metadata: Metadata = {
  title: "Publications — Bhavya Foundation",
  description:
    "Foundational research papers and publications that inform Bhavya Foundation's AI education — a curated, openly linked reference library.",
};

export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <PageHero
        label="Resources"
        title="Publications"
        lead="Foundational research papers that inform the Foundation's AI education — curated, linked to their sources, and free to read."
      />

      <Section>
        <SectionHeader
          label="Reference Library"
          title={`${referencePapers.length} foundational papers`}
          description="Every entry links to its original publication on arXiv. The interactive research library adds search and tag filtering."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {referencePapers.map((paper) => (
            <a
              key={paper.id}
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-border bg-bg-raised p-6 transition-colors hover:border-accent-gold/30"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <h3
                  className="editorial-tile-title"
                  style={{ fontSize: "var(--text-xl)" }}
                >
                  {paper.title}
                </h3>
                <span
                  aria-hidden="true"
                  className="editorial-tile-arrow transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </div>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-secondary)",
                  marginBottom: "var(--space-3)",
                }}
              >
                {paper.authors.join(", ")} · {paper.year}
              </p>
              <p className="editorial-tile-desc">{paper.abstract}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section variant="ivory">
        <div className="max-w-3xl">
          <SectionHeader
            label="Institutional Research"
            title="Research by the Foundation"
            description="Research across ecology, AI, education, heritage, and rural development is part of the Foundation's constitutional mandate — conducted ethically and openly. Find the research surface, the curated library, and how to work with the team there."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/research" className="btn btn-primary">
              Open the Research Library
            </Link>
            <Link href="/knowledge/research" className="btn btn-secondary">
              Knowledge Mission Research
            </Link>
          </div>
        </div>
      </Section>

      <CTABand
        title="Read first, then build"
        text="The curriculum turns these foundations into something you can learn and teach."
        actions={[
          {
            href: "/curriculum",
            label: "View the Curriculum",
            variant: "gold",
          },
          {
            href: "/resources/documents",
            label: "Institutional Documents",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
