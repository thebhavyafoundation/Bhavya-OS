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

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using Bhavya AI Institute's platform, courses, labs, and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services. We reserve the right to modify these terms at any time, with material changes communicated at least 30 days before taking effect. Continued use after changes take effect constitutes acceptance.",
  },
  {
    title: "User Accounts",
    content:
      "You must create an account to access most features of our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate, current, and complete information during registration and to update it as necessary. You must be at least 13 years old to create an account. One person may not maintain more than one account.",
  },
  {
    title: "Content and Intellectual Property",
    content:
      "All course content, materials, and resources provided through Bhavya AI Institute are owned by us or our licensors and are protected by intellectual property laws. You may access and use content for personal, non-commercial educational purposes. You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any content without express written permission. Course completion certificates are granted for personal use and professional advancement.",
  },
  {
    title: "User Conduct",
    content:
      "You agree to use our platform lawfully and respectfully. You may not: attempt to access unauthorized areas of the platform, interfere with or disrupt the platform or servers, use automated systems to access the platform without permission, share account credentials with others, submit false or misleading information, harass, threaten, or intimidate other users, or use the platform for any purpose that violates applicable laws or regulations.",
  },
  {
    title: "Disclaimers and Limitation of Liability",
    content:
      "Our platform and content are provided 'as is' without warranties of any kind. While we strive for accuracy, we do not warrant that content is error-free or complete. Bhavya AI Institute shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim. Educational outcomes depend on individual effort and circumstances.",
  },
  {
    title: "Termination",
    content:
      "You may terminate your account at any time through your account settings or by contacting support. We may suspend or terminate your account if you violate these terms, with notice provided when reasonably possible. Upon termination, your right to access the platform ceases. We will retain your data as described in our Privacy Policy. Certain provisions of these terms will survive termination, including intellectual property rights and limitation of liability.",
  },
  {
    title: "Payment and Refunds",
    content:
      "Paid services are billed in advance on a recurring or one-time basis as selected at purchase. All payments are non-refundable except as required by applicable law or as specified in our refund policy. We reserve the right to change pricing with 30 days notice. Free tier access is provided without charge and may be modified or discontinued at our discretion. Failed payments may result in service suspension until resolved.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration before contacting courts, except where arbitration is prohibited by law. Both parties agree to resolve disputes individually and not as part of any class action.",
  },
];

export default function TermsPage() {
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
            Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-[#f5f1e6] mb-6"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#8a7359]"
          >
            Last updated: August 7, 2026
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[#8a7359] leading-relaxed mb-12"
          >
            Welcome to Bhavya AI Institute. These Terms of Service govern your
            use of our platform, courses, and services. Please read them
            carefully before using our services.
          </motion.p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <h2 className="text-xl font-bold text-[#f5f1e6] mb-4">
                  {section.title}
                </h2>
                <p className="text-sm text-[#8a7359] leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-[#f5f1e6] mb-4">
              Questions About These Terms?
            </h2>
            <p className="text-[#8a7359] mb-8">
              Contact our legal team if you have questions about these Terms of
              Service.
            </p>
            <a
              href="mailto:legal@bhavya.ai"
              className="inline-block px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
            >
              Contact Legal Team
            </a>
          </motion.div>
        </div>
      </section>

      {footer}
    </div>
  );
}
