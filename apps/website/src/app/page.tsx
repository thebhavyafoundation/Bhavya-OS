import type { Metadata } from "next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { MissionCards } from "../components/MissionCards";
import { KnowledgePackages } from "../components/KnowledgePackages";
import { StatsSection } from "../components/StatsSection";
import { PrinciplesSection } from "../components/PrinciplesSection";
import { TrustLayer } from "../components/TrustLayer";
import { CTASection } from "../components/CTASection";
import { SkipNavigation } from "../components/SkipNavigation";
import { buildMetadata } from "../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title:
    "Bhavya Foundation — Restoring Nature. Empowering Humanity. Preserving Heritage.",
  description:
    "Free AI education for rural India. 13 levels, 78 modules, 331 knowledge packages. Restoring forests, preserving heritage, building communities.",
  path: "/",
});

export default function WebsiteHomepage() {
  return (
    <>
      <SkipNavigation />
      <Header currentPath="/" />
      <main id="main-content" role="main">
        <HeroSection />
        <MissionCards />
        <KnowledgePackages />
        <StatsSection />
        <PrinciplesSection />
        <TrustLayer />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
