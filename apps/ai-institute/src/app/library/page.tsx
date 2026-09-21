"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, ExternalLink, Filter } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  description?: string;
  source?: "bhavya" | "external";
  provider?: string;
  license?: string;
  strand?: string;
}

type SourceFilter = "all" | "bhavya" | "external";

const typeColors: Record<string, string> = {
  module: "var(--color-brand-forest)",
  guide: "var(--color-earth-600, #6a7c52)",
  reference: "var(--color-brand-gold)",
  curriculum: "var(--color-forest-600, #0e5936)",
  default: "var(--color-text-muted)",
};

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    fetch("/api/library/items")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const filtered = items.filter(
    (item) =>
      (filter === "all" || (item.source ?? "bhavya") === filter) &&
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())),
  );

  const externalCount = items.filter((i) => i.source === "external").length;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <SiteHeader />

      {/* Hero */}
      <section
        style={{
          paddingTop: "var(--space-32)",
          paddingBottom: "var(--space-16)",
          background: "var(--color-ivory-200)",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "720px", textAlign: "center" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-block",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-4)",
            }}
          >
            KNOWLEDGE LIBRARY
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              color: "var(--color-text-primary)",
              marginBottom: "var(--space-6)",
            }}
          >
            Library
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-secondary)",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Browse our collection of knowledge objects, documents, and
            resources.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "var(--space-16) 0 var(--space-24)" }}>
        <div className="container">
          {/* Search & Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "var(--space-3)",
              marginBottom: "var(--space-8)",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "1 1 320px",
                maxWidth: "420px",
              }}
            >
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "var(--space-3)",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Search library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search library"
                style={{
                  width: "100%",
                  padding:
                    "var(--space-3) var(--space-4) var(--space-3) var(--space-10)",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-primary)",
                  outline: "none",
                  transition: "border-color var(--duration-fast) ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-gold)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--color-border-primary)";
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {(["all", "bhavya", "external"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  style={{
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-full)",
                    border: `1px solid ${filter === f ? "var(--color-brand-gold)" : "var(--color-border-primary)"}`,
                    background: "transparent",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    color:
                      filter === f
                        ? "var(--color-brand-gold)"
                        : "var(--color-text-secondary)",
                    cursor: "pointer",
                    transition: "all var(--duration-fast) ease",
                  }}
                >
                  {f === "all" ? "All" : f === "bhavya" ? "Bhavya" : "External"}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "var(--space-16) var(--space-8)",
                background: "var(--color-ivory-200)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-primary)",
                textAlign: "center",
              }}
            >
              <BookOpen
                size={32}
                style={{
                  color: "var(--color-text-muted)",
                  margin: "0 auto var(--space-4)",
                }}
              />
              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {search
                  ? "No results found."
                  : "Library items will appear here."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{
                    padding: "var(--space-5)",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border-primary)",
                    borderRadius: "var(--radius-lg)",
                    transition:
                      "border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(212, 175, 55, 0.3)";
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--color-border-primary)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: typeColors[item.type] || typeColors.default,
                      }}
                    >
                      {item.type}
                    </span>
                    {item.source === "external" && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px var(--space-2)",
                          borderRadius: "var(--radius-full)",
                          border: "1px solid var(--color-border-primary)",
                          fontSize: "11px",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        <ExternalLink size={10} />
                        {item.provider}
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      marginBottom: "var(--space-2)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {externalCount > 0 && (
            <p
              style={{
                marginTop: "var(--space-8)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              External resources are provided by the Raspberry Pi Foundation
              (&ldquo;Experience AI&rdquo;, CC BY-NC-ND 4.0) and listed here as
              references. Lesson content remains with the provider and is not
              republished by Bhavya Foundation.
            </p>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
