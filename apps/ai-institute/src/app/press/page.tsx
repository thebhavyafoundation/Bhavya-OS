"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const nav = (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a2a1f] bg-[#0a0f0d]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#1a3a2a] flex items-center justify-center">
          <span className="text-[#c9a227] font-bold text-sm">B</span>
        </div>
        <span className="text-sm font-semibold text-[#f5f1e6]">
          Bhavya AI Institute
        </span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/schools"
          className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors hidden md:block"
        >
          Schools
        </Link>
        <Link
          href="/learning-paths"
          className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors hidden md:block"
        >
          Learning Paths
        </Link>
        <Link
          href="/research"
          className="text-sm text-[#8a7359] hover:text-[#f5f1e6] transition-colors hidden md:block"
        >
          Research
        </Link>
        <Link
          href="/assessment"
          className="px-4 py-2 text-sm font-medium bg-[#1a3a2a] text-[#f5f1e6] rounded-lg hover:bg-[#1a3a2a]/80 transition-colors"
        >
          Begin Journey
        </Link>
      </div>
    </div>
  </nav>
);

const footer = (
  <footer className="py-12 px-6 border-t border-[#1a2a1f]">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        <div className="w-8 h-8 rounded-lg bg-[#1a3a2a] flex items-center justify-center">
          <span className="text-[#c9a227] font-bold text-sm">B</span>
        </div>
        <span className="text-sm text-[#8a7359]">
          Bhavya AI Institute — Building the future of AI education
        </span>
      </div>
      <p className="text-xs text-[#8a7359]">
        © 2026 Bhavya Foundation. Built for the next decade.
      </p>
    </div>
  </footer>
);

const brandColors = [
  { name: "Deep Forest", hex: "#0a0f0d", usage: "Primary background" },
  { name: "Emerald", hex: "#1a3a2a", usage: "Primary accent, buttons" },
  { name: "Gold", hex: "#c9a227", usage: "Highlights, CTAs" },
  { name: "Bronze", hex: "#8a7359", usage: "Secondary text" },
  { name: "Ivory", hex: "#f5f1e6", usage: "Primary text" },
  { name: "Forest Border", hex: "#1a2a1f", usage: "Borders, dividers" },
];

const keyFacts = [
  { label: "Founded", value: "2026" },
  { label: "Schools", value: "12" },
  { label: "Courses", value: "100+" },
  { label: "Students", value: "50,000+" },
  { label: "Completion Rate", value: "95%" },
  { label: "Career Placement", value: "87%" },
  { label: "Countries", value: "20+" },
  { label: "Languages", value: "15" },
];

const brandAssets = [
  {
    name: "Primary Logo",
    description:
      "Bhavya AI Institute wordmark with emblem. Use on light and dark backgrounds.",
    format: "SVG, PNG",
  },
  {
    name: "Emblem Only",
    description:
      "Standalone B emblem. Use for favicons, app icons, and small spaces.",
    format: "SVG, PNG",
  },
  {
    name: "Wordmark Only",
    description:
      "Text-only logo. Use when emblem is already present or in text-heavy layouts.",
    format: "SVG, PNG",
  },
  {
    name: "Brand Pattern",
    description:
      "Knowledge graph inspired pattern for backgrounds and marketing materials.",
    format: "SVG, PNG",
  },
];

const contacts = [
  {
    role: "Press Inquiries",
    email: "press@bhavya.ai",
    description: "Interviews, quotes, and media requests",
  },
  {
    role: "Partnerships",
    email: "partnerships@bhavya.ai",
    description: "Institutional and corporate partnerships",
  },
  {
    role: "General Inquiries",
    email: "hello@bhavya.ai",
    description: "General questions and information",
  },
];

const guidelines = [
  "Always use the official Bhavya AI Institute name — never abbreviate to BAI or similar",
  "Use approved brand colors and typography in any visual representations",
  "Include a link to bhavya.ai when mentioning us in online publications",
  "Do not alter, crop, or recolor logos without written permission",
  "Use provided statistics and facts — do not estimate or fabricate numbers",
  "Quote only authorized spokespersons for institutional statements",
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      {nav}

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-[#c9a227] font-medium mb-4 tracking-widest uppercase"
          >
            Media
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#f5f1e6] mb-6"
          >
            Press & Media
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[#8a7359] max-w-2xl mx-auto"
          >
            Brand assets, key facts, and media resources for journalists,
            bloggers, and content creators.
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Brand Assets
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-6">
              Official Brand Materials
            </h2>
            <p className="text-[#8a7359] max-w-2xl">
              Download approved brand assets for use in articles, presentations,
              and media coverage. All assets are provided under our brand usage
              guidelines.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {brandAssets.map((asset, i) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[#1a2a1f] bg-[#111916] flex items-start justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-[#f5f1e6] mb-2">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-[#8a7359] mb-3">
                    {asset.description}
                  </p>
                  <span className="text-xs text-[#c9a227]">{asset.format}</span>
                </div>
                <button className="px-4 py-2 text-xs font-medium border border-[#1a2a1f] rounded-lg text-[#8a7359] hover:border-[#1a3a2a] hover:text-[#f5f1e6] transition-colors shrink-0 ml-4">
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Colors
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">Brand Palette</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandColors.map((color, i) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl overflow-hidden border border-[#1a2a1f]"
              >
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-3 bg-[#0a0f0d]">
                  <p className="text-xs font-medium text-[#f5f1e6] mb-1">
                    {color.name}
                  </p>
                  <p className="text-[10px] text-[#8a7359] font-mono">
                    {color.hex}
                  </p>
                  <p className="text-[10px] text-[#8a7359] mt-1">
                    {color.usage}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Typography
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">Brand Fonts</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl border border-[#1a2a1f] bg-[#111916]"
            >
              <h3
                className="text-3xl font-bold text-[#f5f1e6] mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Inter
              </h3>
              <p className="text-sm text-[#8a7359] mb-2">
                Primary typeface for headings and UI elements
              </p>
              <p className="text-xs text-[#c9a227]">
                Weights: 400, 500, 600, 700
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-xl border border-[#1a2a1f] bg-[#111916]"
            >
              <h3
                className="text-3xl text-[#f5f1e6] mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Georgia
              </h3>
              <p className="text-sm text-[#8a7359] mb-2">
                Secondary typeface for body text and editorial content
              </p>
              <p className="text-xs text-[#c9a227]">Weights: 400, 700</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50 border-y border-[#1a2a1f]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Key Facts
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">
              Institute at a Glance
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {keyFacts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-center p-4 rounded-xl border border-[#1a2a1f] bg-[#0a0f0d]"
              >
                <div className="text-2xl font-bold text-[#c9a227] mb-1">
                  {fact.value}
                </div>
                <div className="text-xs text-[#8a7359]">{fact.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Contact
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6]">
              Press Contacts
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {contacts.map((contact, i) => (
              <motion.div
                key={contact.role}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-[#1a2a1f] bg-[#111916]"
              >
                <h3 className="text-base font-semibold text-[#f5f1e6] mb-2">
                  {contact.role}
                </h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-[#c9a227] hover:underline block mb-3"
                >
                  {contact.email}
                </a>
                <p className="text-sm text-[#8a7359]">{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#111916]/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm text-[#c9a227] font-medium mb-4 tracking-wide uppercase">
              Usage Guidelines
            </p>
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-6">
              Brand Guidelines Summary
            </h2>
            <p className="text-[#8a7359] leading-relaxed">
              When referencing Bhavya AI Institute in media, please follow these
              guidelines to ensure consistent and accurate representation of our
              brand:
            </p>
          </motion.div>
          <div className="space-y-3">
            {guidelines.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="text-[#c9a227] mt-0.5">✓</span>
                <span className="text-sm text-[#8a7359]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#f5f1e6] mb-4">
              Need More Information?
            </h2>
            <p className="text-[#8a7359] mb-8">
              Our press team is available for interviews, statements, and
              detailed information requests.
            </p>
            <a
              href="mailto:press@bhavya.ai"
              className="inline-block px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
            >
              Contact Press Team
            </a>
          </motion.div>
        </div>
      </section>

      {footer}
    </div>
  );
}
