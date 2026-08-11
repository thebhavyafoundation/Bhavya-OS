"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  ExternalLink,
  Star,
  Shield,
  Zap,
  Eye,
  Palette,
  Layout,
  MousePointer,
  Move,
  Accessibility,
  ArrowLeft,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { scoreToColor, scoreToBg, scoreToBorder } from "@/lib/score-color";
import { parseJson, parseJsonArray } from "@/lib/json-utils";

interface WebsiteDetail {
  id: string;
  source_url: string;
  repository_id: string | null;
  name: string;
  description: string | null;
  framework: string | null;
  runtime: string | null;
  design_system: string | null;
  component_system: string | null;
  layout_system: string | null;
  navigation_architecture: string | null;
  typography: string | null;
  color_system: string | null;
  spacing_system: string | null;
  motion_system: string | null;
  interaction_patterns: string;
  responsive_patterns: string;
  accessibility_characteristics: string;
  performance_observations: string;
  seo_observations: string;
  screenshots: string;
  extracted_pattern_ids: string;
  bhavya_relevance_score: number;
  quality_score: number;
  provenance: string;
  analyzed_at: string;
}

interface DesignIntelligence {
  id: string;
  typography: string;
  color: string;
  spacing: string;
  imagery: string;
  surfaces: string;
  grid: string;
  container: string;
  section_structure: string;
  responsive_behavior: string;
  primary_nav: string;
  secondary_nav: string;
  contextual_nav: string;
  command_nav: string;
  hover: string;
  focus: string;
  scroll: string;
  transitions: string;
  motion_library: string | null;
  motion_techniques: string;
  motion_intensity: string | null;
  semantics: string;
  keyboard: string;
  contrast: string;
  reduced_motion: string;
  image_strategy: string | null;
  loading: string | null;
  javascript: string | null;
  rendering: string | null;
  extracted_pattern_ids: string;
  bhavya_relevance: string | null;
  recommended_use: string | null;
  risks: string;
  adaptation_notes: string | null;
}

interface DesignScore {
  id: string;
  institutional_relevance: number;
  ux_quality: number;
  accessibility: number;
  performance: number;
  visual_quality: number;
  reusability: number;
  technical_quality: number;
  innovation: number;
  maintainability: number;
  bhavya_brand_compatibility: number;
  overall_score: number;
  explanation: string;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const barColor =
    score >= 80
      ? "var(--color-accent-green-light)"
      : score >= 60
        ? "var(--color-accent-gold)"
        : score >= 40
          ? "var(--color-accent-earth)"
          : "var(--color-status-error)";

  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs w-28 text-right"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, background: barColor }}
        />
      </div>
      <span
        className="text-xs w-8"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        {score}
      </span>
    </div>
  );
}

function JsonSection({
  title,
  data,
  icon: Icon,
}: {
  title: string;
  data: string;
  icon: React.ComponentType<{ size?: number }>;
}) {
  const parsed = parseJson(data) as Record<string, unknown> | null;
  if (!parsed || Object.keys(parsed).length === 0) return null;

  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-primary)",
      }}
    >
      <h3
        className="text-xs uppercase tracking-wider mb-3 flex items-center gap-2"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        <Icon size={14} />
        {title}
      </h3>
      <div className="space-y-2">
        {Object.entries(parsed).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs">
            <span style={{ color: "var(--color-text-muted)" }}>{key}</span>
            <span
              className="text-right max-w-[60%]"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WebsiteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [website, setWebsite] = useState<WebsiteDetail | null>(null);
  const [designIntel, setDesignIntel] = useState<DesignIntelligence | null>(
    null,
  );
  const [designScore, setDesignScore] = useState<DesignScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/websites`);
      const data = await res.json();
      const found = data.websites?.find((w: WebsiteDetail) => w.id === id);
      setWebsite(found || null);

      if (found) {
        const diRes = await fetch(
          `/api/design-intelligence?sourceId=${id}&sourceType=website`,
        );
        const diData = await diRes.json();
        setDesignIntel(diData.records?.[0] || null);

        const dsRes = await fetch(
          `/api/design-scores?sourceId=${id}&sourceType=website`,
        );
        const dsData = await dsRes.json();
        setDesignScore(dsData.scores?.[0] || null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse space-y-4">
            <div
              className="h-8 rounded w-1/3"
              style={{ background: "var(--color-bg-tertiary)" }}
            />
            <div
              className="h-4 rounded w-2/3"
              style={{ background: "var(--color-bg-tertiary)" }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div
                className="h-40 rounded"
                style={{ background: "var(--color-bg-tertiary)" }}
              />
              <div
                className="h-40 rounded"
                style={{ background: "var(--color-bg-tertiary)" }}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!website) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Globe
              size={24}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Website not found
            </p>
            <Link
              href="/websites"
              className="text-xs hover:underline mt-2 inline-block"
              style={{ color: "var(--color-accent-gold)" }}
            >
              Back to websites
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const patterns = parseJsonArray(website.extracted_pattern_ids);
  const provenance = parseJson(website.provenance) as Record<
    string,
    unknown
  > | null;

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <Link
            href="/websites"
            className="inline-flex items-center gap-1 text-xs mb-6 transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <ArrowLeft size={12} />
            Back to websites
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Globe size={24} style={{ color: "var(--color-accent-gold)" }} />
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {website.name}
              </h1>
            </div>
            <a
              href={website.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline flex items-center gap-1"
              style={{ color: "var(--color-accent-gold)" }}
            >
              {website.source_url}
              <ExternalLink size={10} />
            </a>
            {website.description && (
              <p
                className="text-sm mt-2"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {website.description}
              </p>
            )}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Bhavya Relevance",
                value: website.bhavya_relevance_score,
              },
              { label: "Quality Score", value: website.quality_score },
              {
                label: "Design Score",
                value: designScore?.overall_score || "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg p-4 text-center"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {item.value}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Design Score Breakdown */}
          {designScore && (
            <div
              className="rounded-lg p-5 mb-6"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-primary)",
              }}
            >
              <h2
                className="text-xs uppercase tracking-wider mb-4"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Design Score Breakdown
              </h2>
              <div className="space-y-2">
                <ScoreBar
                  label="Institutional"
                  score={designScore.institutional_relevance}
                />
                <ScoreBar label="UX Quality" score={designScore.ux_quality} />
                <ScoreBar
                  label="Accessibility"
                  score={designScore.accessibility}
                />
                <ScoreBar label="Performance" score={designScore.performance} />
                <ScoreBar
                  label="Visual Quality"
                  score={designScore.visual_quality}
                />
                <ScoreBar label="Reusability" score={designScore.reusability} />
                <ScoreBar
                  label="Technical"
                  score={designScore.technical_quality}
                />
                <ScoreBar label="Innovation" score={designScore.innovation} />
                <ScoreBar
                  label="Maintainability"
                  score={designScore.maintainability}
                />
                <ScoreBar
                  label="Brand Compat."
                  score={designScore.bhavya_brand_compatibility}
                />
              </div>
            </div>
          )}

          {/* Technology */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <JsonSection
              title="Typography"
              data={website.typography || "{}"}
              icon={Palette}
            />
            <JsonSection
              title="Color System"
              data={website.color_system || "{}"}
              icon={Palette}
            />
            <JsonSection
              title="Layout"
              data={website.layout_system || "{}"}
              icon={Layout}
            />
            <JsonSection
              title="Navigation"
              data={website.navigation_architecture || "{}"}
              icon={MousePointer}
            />
          </div>

          {/* Design Intelligence Details */}
          {designIntel && (
            <div className="space-y-4 mb-6">
              <h2
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Detailed Design Intelligence
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <JsonSection
                  title="Surfaces"
                  data={designIntel.surfaces}
                  icon={Eye}
                />
                <JsonSection
                  title="Grid"
                  data={designIntel.grid}
                  icon={Layout}
                />
                <JsonSection
                  title="Hover"
                  data={designIntel.hover}
                  icon={MousePointer}
                />
                <JsonSection
                  title="Focus"
                  data={designIntel.focus}
                  icon={MousePointer}
                />
                <JsonSection
                  title="Scroll"
                  data={designIntel.scroll}
                  icon={Move}
                />
                <JsonSection
                  title="Transitions"
                  data={designIntel.transitions}
                  icon={Zap}
                />
                <JsonSection
                  title="Keyboard"
                  data={designIntel.keyboard}
                  icon={Accessibility}
                />
                <JsonSection
                  title="Contrast"
                  data={designIntel.contrast}
                  icon={Eye}
                />
              </div>

              {designIntel.bhavya_relevance && (
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--color-surface-forest-subtle)",
                    border: "1px solid var(--color-surface-forest-medium)",
                  }}
                >
                  <h3
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-accent-green-light)" }}
                  >
                    Bhavya Relevance
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {designIntel.bhavya_relevance}
                  </p>
                </div>
              )}

              {designIntel.recommended_use && (
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Recommended Use
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {designIntel.recommended_use}
                  </p>
                </div>
              )}

              {designIntel.adaptation_notes && (
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-xs uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Adaptation Notes
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {designIntel.adaptation_notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Patterns */}
          {patterns.length > 0 && (
            <div className="mb-6">
              <h2
                className="text-xs uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Extracted Patterns
              </h2>
              <div className="flex flex-wrap gap-2">
                {patterns.map((p, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded text-xs"
                    style={{
                      background: "var(--color-surface-forest-medium)",
                      border: "1px solid var(--color-surface-forest-strong)",
                      color: "var(--color-accent-green-light)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Provenance */}
          {provenance && (
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-primary)",
              }}
            >
              <h3
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Provenance
              </h3>
              <div className="space-y-1">
                {Object.entries(provenance).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {key}
                    </span>
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
