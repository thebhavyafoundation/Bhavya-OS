"use client";

import { motion } from "framer-motion";

const brandColors = [
  {
    name: "Deep Forest",
    hex: "var(--color-forest-950)",
    displayHex: "#0a0f0d",
    usage: "Primary background",
  },
  {
    name: "Emerald",
    hex: "var(--color-forest-900)",
    displayHex: "#1a3a2a",
    usage: "Primary accent, buttons",
  },
  {
    name: "Gold",
    hex: "var(--color-brand-gold)",
    displayHex: "#c9a227",
    usage: "Highlights, CTAs",
  },
  {
    name: "Bronze",
    hex: "var(--color-ivory-700)",
    displayHex: "#8a7359",
    usage: "Secondary text",
  },
  {
    name: "Ivory",
    hex: "var(--color-ivory-100)",
    displayHex: "#f5f1e6",
    usage: "Primary text",
  },
  {
    name: "Forest Border",
    hex: "var(--color-forest-900)",
    displayHex: "#1a2a1f",
    usage: "Borders, dividers",
  },
];

const brandAssets = [
  {
    name: "Primary Logo",
    description:
      "Bhavya Foundation wordmark with emblem. Use on light and dark backgrounds.",
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
    email: "press@bhavyafoundation.org",
    description: "Interviews, quotes, and media requests",
  },
  {
    role: "Partnerships",
    email: "partnerships@bhavyafoundation.org",
    description: "Institutional and corporate partnerships",
  },
  {
    role: "General Inquiries",
    email: "hello@bhavyafoundation.org",
    description: "General questions and information",
  },
];

const guidelines = [
  "Always use the official Bhavya Foundation name — never abbreviate to BAI or similar",
  "Use approved brand colors and typography in any visual representations",
  "Include a link to bhavya.ai when mentioning us in online publications",
  "Do not alter, crop, or recolor logos without written permission",
  "Use provided statistics and facts — do not estimate or fabricate numbers",
  "Quote only authorized spokespersons for institutional statements",
];

export default function PressPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-accent-gold font-medium mb-4 tracking-widest uppercase"
          >
            Media
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
          >
            Press & Media
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-text-tertiary max-w-2xl mx-auto"
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
            <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
              Brand Assets
            </p>
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Official Brand Materials
            </h2>
            <p className="text-text-tertiary max-w-2xl">
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
                className="p-6 rounded-xl border border-border-primary bg-bg-secondary flex items-start justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-text-tertiary mb-3">
                    {asset.description}
                  </p>
                  <span className="text-xs text-accent-gold">
                    {asset.format}
                  </span>
                </div>
                <button className="px-4 py-2 text-xs font-medium border border-border-primary rounded-lg text-text-tertiary hover:border-border-primary hover:text-text-primary transition-colors shrink-0 ml-4">
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
              Colors
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
              Brand Palette
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandColors.map((color, i) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-xl overflow-hidden border border-border-primary"
              >
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="p-3 bg-bg-primary">
                  <p className="text-xs font-medium text-text-primary mb-1">
                    {color.name}
                  </p>
                  <p className="text-[10px] text-text-tertiary font-mono">
                    {color.displayHex}
                  </p>
                  <p className="text-[10px] text-text-tertiary mt-1">
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
            <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
              Typography
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
              Brand Fonts
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-xl border border-border-primary bg-bg-secondary"
            >
              <h3
                className="text-3xl font-bold text-text-primary mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Inter
              </h3>
              <p className="text-sm text-text-tertiary mb-2">
                Primary typeface for headings and UI elements
              </p>
              <p className="text-xs text-accent-gold">
                Weights: 400, 500, 600, 700
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-xl border border-border-primary bg-bg-secondary"
            >
              <h3
                className="text-3xl text-text-primary mb-4"
                style={{ fontFamily: "Playfair Display, Georgia, serif" }}
              >
                Playfair Display
              </h3>
              <p className="text-sm text-text-tertiary mb-2">
                Editorial typeface for headings and display text
              </p>
              <p className="text-xs text-accent-gold">Weights: 400, 700, 900</p>
            </motion.div>
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
            <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
              Contact
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
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
                className="p-6 rounded-xl border border-border-primary bg-bg-secondary"
              >
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  {contact.role}
                </h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-accent-gold hover:underline block mb-3"
                >
                  {contact.email}
                </a>
                <p className="text-sm text-text-tertiary">
                  {contact.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-bg-secondary/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
              Usage Guidelines
            </p>
            <h2 className="text-3xl font-bold text-text-primary mb-6">
              Brand Guidelines Summary
            </h2>
            <p className="text-text-tertiary leading-relaxed">
              When referencing Bhavya Foundation in media, please follow these
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
                <span className="text-accent-gold mt-0.5">✓</span>
                <span className="text-sm text-text-tertiary">{item}</span>
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
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Need More Information?
            </h2>
            <p className="text-text-tertiary mb-8">
              Our press team is available for interviews, statements, and
              detailed information requests.
            </p>
            <a
              href="mailto:press@bhavyafoundation.org"
              className="inline-block px-8 py-4 text-base font-semibold bg-accent-gold text-text-primary rounded-lg hover:bg-accent-gold-hover transition-colors"
            >
              Contact Press Team
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
