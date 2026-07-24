import { FeatureGrid, LandingLayout, Section, SectionHeader, Container } from "@bhavya/ui";

export default function HeritageAppPage() {
  return (
    <LandingLayout>
      <Section>
        <Container className="space-y-8">
          <SectionHeader eyebrow="Heritage App" title="Temple restoration, archives, yoga, and traditional knowledge." />
          <FeatureGrid items={["Temple Restoration", "Architecture", "History", "Archives", "Yoga", "Documentation"].map((title) => ({ title, description: "Heritage Mission module." }))} />
        </Container>
      </Section>
    </LandingLayout>
  );
}
