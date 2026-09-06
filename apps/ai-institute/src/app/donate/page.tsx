import type { Metadata } from "next";
import { TreePine, GraduationCap, Landmark, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Donate — Bhavya Foundation",
  description:
    "Support Bhavya Foundation's missions. Your donation helps restore nature, empower communities, and preserve heritage.",
};

const impacts = [
  {
    icon: TreePine,
    amount: "₹100",
    description: "Helps plant native trees in degraded forests",
  },
  {
    icon: GraduationCap,
    amount: "₹500",
    description: "Supports a child's AI education for a month",
  },
  {
    icon: Landmark,
    amount: "₹1,000",
    description: "Helps document heritage sites for preservation",
  },
  {
    icon: Heart,
    amount: "₹5,000",
    description: "Helps establish AI labs in rural schools",
  },
];

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider mb-3">
            Support Our Mission
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Donate to Bhavya Foundation
          </h1>
          <p className="text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your contribution helps us restore forests, provide AI education,
            preserve heritage, and build communities across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {impacts.map((item) => (
            <div
              key={item.amount}
              className="glass rounded-xl p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <div className="text-lg font-bold text-accent-gold">
                  {item.amount}
                </div>
                <div className="text-sm text-text-secondary mt-0.5">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-gold rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-text-primary mb-3">
            Every contribution makes a difference
          </h2>
          <p className="text-sm text-text-secondary mb-6 max-w-lg mx-auto">
            Bhavya Foundation is a registered charitable trust. All donations
            are tax-deductible under Section 80G of the Income Tax Act.
          </p>
          <a
            href="mailto:donate@bhavyafoundation.org"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-gold text-text-inverse font-semibold text-sm hover:bg-accent-gold-hover transition-colors"
          >
            <Heart className="w-4 h-4" />
            Contact Us to Donate
          </a>
        </div>
      </section>
    </div>
  );
}
