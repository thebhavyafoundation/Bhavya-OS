"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using Bhavya Foundation's platform, courses, labs, and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services. We reserve the right to modify these terms at any time, with material changes communicated at least 30 days before taking effect. Continued use after changes take effect constitutes acceptance.",
  },
  {
    title: "User Accounts",
    content:
      "You must create an account to access most features of our platform. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate, current, and complete information during registration and to update it as necessary. You must be at least 13 years old to create an account. One person may not maintain more than one account.",
  },
  {
    title: "Content and Intellectual Property",
    content:
      "All course content, materials, and resources provided through Bhavya Foundation are owned by us or our licensors and are protected by intellectual property laws. You may access and use content for personal, non-commercial educational purposes. You may not reproduce, distribute, modify, create derivative works of, publicly display, or commercially exploit any content without express written permission. Course completion certificates are granted for personal use and professional advancement.",
  },
  {
    title: "User Conduct",
    content:
      "You agree to use our platform lawfully and respectfully. You may not: attempt to access unauthorized areas of the platform, interfere with or disrupt the platform or servers, use automated systems to access the platform without permission, share account credentials with others, submit false or misleading information, harass, threaten, or intimidate other users, or use the platform for any purpose that violates applicable laws or regulations.",
  },
  {
    title: "Disclaimers and Limitation of Liability",
    content:
      "Our platform and content are provided 'as is' without warranties of any kind. While we strive for accuracy, we do not warrant that content is error-free or complete. Bhavya Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim. Educational outcomes depend on individual effort and circumstances.",
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
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="editorial-label"
          >
            Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="editorial-heading"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
              marginTop: "var(--space-4)",
              marginBottom: "var(--space-6)",
            }}
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: "var(--color-text-tertiary)" }}
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
            style={{
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
              marginBottom: "var(--space-12)",
            }}
          >
            Welcome to Bhavya Foundation. These Terms of Service govern your use
            of our platform, courses, and services. Please read them carefully
            before using our services.
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
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
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
            <h2
              className="editorial-heading"
              style={{
                fontSize: "var(--text-2xl)",
                marginBottom: "var(--space-4)",
              }}
            >
              Questions About These Terms?
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-8)",
              }}
            >
              Contact our legal team if you have questions about these Terms of
              Service.
            </p>
            <a
              href="mailto:legal@bhavyafoundation.org"
              className="btn btn-gold"
            >
              Contact Legal Team
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
