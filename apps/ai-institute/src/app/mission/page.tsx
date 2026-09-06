"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const pillars = [
  {
    title: "Education",
    description:
      "Deep curriculum that builds deep understanding, not surface familiarity. From foundations to frontier research.",
    icon: "◆",
  },
  {
    title: "Research",
    description:
      "Advancing the state of AI through rigorous investigation. Our research informs our curriculum, and our curriculum trains the next generation of researchers.",
    icon: "◇",
  },
  {
    title: "Impact",
    description:
      "Transforming lives through accessible AI education. From career changers to entrepreneurs, we are building the future of AI education.",
    icon: "◈",
  },
];

const milestones = [
  {
    year: "2026",
    title: "Foundation",
    description:
      "Bhavya AI Institute founded with a 10-year mission to become the global benchmark for AI education.",
  },
  {
    year: "2026",
    title: "Academic Structure Designed",
    description:
      "Multi-pillar academic structure designed to cover the full spectrum of AI education.",
  },
  {
    year: "2026",
    title: "First Cohort",
    description:
      "Target: Inaugural class of students begins their journey through our flagship learning paths.",
  },
  {
    year: "2027",
    title: "Research Division",
    description:
      "Dedicated research division launches with focus on AI safety, alignment, and responsible development.",
  },
  {
    year: "2028",
    title: "Global Expansion",
    description:
      "Target: Partnerships with institutions in multiple countries. Localization in multiple languages.",
  },
  {
    year: "2030",
    title: "50K Graduates",
    description:
      "Target: Significant number of graduates working in AI across industry, academia, and government.",
  },
  {
    year: "2036",
    title: "Decade of Impact",
    description:
      "10-year vision realized: the global standard for AI education.",
  },
];

export default function MissionPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-sm text-accent-gold font-medium mb-4 tracking-widest uppercase"
            >
              Our Purpose
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
            >
              Our Mission
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-tertiary max-w-2xl mx-auto"
            >
              To build the world&apos;s most comprehensive and enduring
              institution for AI education, research, and impact.
            </motion.p>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
                Vision
              </p>
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                A World Where AI Is Understood, Not Just Used
              </h2>
              <p className="text-text-tertiary leading-relaxed text-lg max-w-3xl mx-auto">
                We envision a future where every person who interacts with AI
                understands how it works, why it matters, and how to use it
                responsibly. Not just engineers — everyone. Our vision is not
                just to teach AI, but to cultivate a generation of thinkers who
                will guide its development for the benefit of all humanity.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-6 bg-bg-secondary/50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
                Three Pillars
              </p>
              <h2 className="text-3xl font-bold text-text-primary">
                The Foundation of Everything We Do
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="p-8 rounded-xl border border-border-primary bg-bg-primary text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-bg-tertiary/30 mx-auto mb-6 flex items-center justify-center text-accent-gold text-2xl">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-text-tertiary leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-sm text-accent-gold font-medium mb-4 tracking-wide uppercase">
                Timeline
              </p>
              <h2 className="text-3xl font-bold text-text-primary">
                Our Journey
              </h2>
            </motion.div>
            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-bg-tertiary -translate-x-1/2" />
              <div className="space-y-12">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={milestone.title}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className="hidden md:block md:w-1/2" />
                    <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-accent-gold -translate-x-1/2 mt-1.5" />
                    <div className="ml-12 md:ml-0 md:w-1/2 pl-8">
                      <span className="text-sm text-accent-gold font-medium">
                        {milestone.year}
                      </span>
                      <h3 className="text-lg font-semibold text-text-primary mt-1 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-text-tertiary leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
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
              <h2 className="text-4xl font-bold text-text-primary mb-6">
                Be Part of the Mission
              </h2>
              <p className="text-text-tertiary mb-10 text-lg">
                Whether you&apos;re learning, teaching, or researching — you are
                the mission.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/assessment"
                  className="px-8 py-4 text-base font-semibold bg-accent-gold text-text-primary rounded-lg hover:bg-accent-gold-hover transition-colors"
                >
                  Start Learning
                </Link>
                <Link
                  href="/research"
                  className="px-8 py-4 text-base font-medium text-text-primary border border-border-primary rounded-lg hover:border-border-primary transition-colors"
                >
                  Explore Research
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
