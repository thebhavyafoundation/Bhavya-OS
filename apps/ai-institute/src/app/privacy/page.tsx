"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly, including your name, email address, and learning preferences when you create an account. We also collect usage data such as course progress, lab activity, and interaction patterns to personalize your learning experience. Payment information is processed securely through our third-party payment providers and is never stored on our servers.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use your information to provide and improve our educational services, personalize your learning path, track course progress, communicate with you about your account and courses, send relevant updates about new courses and features, and ensure the security and integrity of our platform. We may also use aggregated, anonymized data for research purposes to improve AI education globally.",
  },
  {
    title: "Information Sharing",
    content:
      "We do not sell your personal information to third parties. We share your information only with service providers who assist in operating our platform (hosting, payment processing, analytics), when required by law, or with your explicit consent. Aggregated, anonymized data may be shared with research partners to advance AI education. Your individual learning data is never shared without your permission.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal information for as long as your account is active or as needed to provide services. Course completion data and certificates are retained indefinitely for your benefit. If you delete your account, we will remove your personal information within 30 days, except where we are required to retain certain records for legal or legitimate business purposes.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal information at any time through your account settings. You can export your learning data, course completions, and certificates. You can opt out of non-essential communications. If you are in the EU, you have additional rights under GDPR including data portability and the right to be forgotten. Contact our privacy team for any requests.",
  },
  {
    title: "Security",
    content:
      "We implement industry-standard security measures to protect your personal information, including encryption in transit and at rest, regular security audits, access controls, and monitoring. While we cannot guarantee absolute security, we continuously invest in protecting our platform and your data against unauthorized access, loss, or misuse.",
  },
  {
    title: "Cookies and Tracking",
    content:
      "We use essential cookies to maintain your session and preferences. We use analytics cookies to understand how our platform is used and to improve the learning experience. You can manage cookie preferences through your browser settings. We do not use third-party advertising cookies or share tracking data with advertisers.",
  },
  {
    title: "Children&apos;s Privacy",
    content:
      "Our platform is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us and we will promptly delete such information. For students between 13-18, we require parental consent for account creation.",
  },
  {
    title: "International Data Transfers",
    content:
      "Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses and data processing agreements. We comply with applicable data protection laws including GDPR, CCPA, and other regional regulations.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of material changes via email or through our platform at least 30 days before they take effect. Your continued use of our platform after changes take effect constitutes acceptance of the updated policy. Previous versions are available upon request.",
  },
];

export default function PrivacyPage() {
  return (
    <>
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
            Privacy Policy
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
            At Bhavya AI Institute, we are committed to protecting your privacy
            and ensuring transparency in how we collect, use, and safeguard your
            information. This Privacy Policy explains our practices when you use
            our platform, courses, and services.
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
              Questions About Privacy?
            </h2>
            <p className="text-[#8a7359] mb-8">
              If you have questions about this policy or our data practices,
              please contact our privacy team.
            </p>
            <a
              href="mailto:privacy@bhavya.ai"
              className="inline-block px-8 py-4 text-base font-semibold bg-[#c9a227] text-[#0a0f0d] rounded-lg hover:bg-[#c9a227]/90 transition-colors"
            >
              Contact Privacy Team
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
