import type { Metadata } from "next";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import { MissionCards } from "../components/MissionCards";
import { StatsSection } from "../components/StatsSection";
import { PrinciplesSection } from "../components/PrinciplesSection";
import { CTASection } from "../components/CTASection";
import { buildMetadata } from "../lib/metadata";

export const metadata: Metadata = buildMetadata({
  title:
    "Bhavya Foundation — Restoring Nature. Empowering Humanity. Preserving Heritage.",
  description:
    "A public charitable trust dedicated to environmental conservation, education, heritage preservation, and community development. Building institutions for generations.",
  path: "/",
});

export default function WebsiteHomepage() {
  return (
    <>
      <Header currentPath="/" />
      <main id="main-content" role="main">
        <HeroSection />
        <MissionCards />
        <StatsSection />
        <PrinciplesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
