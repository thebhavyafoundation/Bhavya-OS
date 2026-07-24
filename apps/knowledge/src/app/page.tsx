import { FeatureGrid, LandingLayout, Section, SectionHeader, Container } from "@bhavya/ui";

export default function KnowledgeAppPage() {
  return (
    <LandingLayout>
      <Section>
        <Container className="space-y-8">
          <SectionHeader eyebrow="Knowledge App" title="AI Lab, Digital Library, Courses, Research, and Innovation." />
          <FeatureGrid items={["AI Lab", "Digital Library", "Courses", "Research"].map((title) => ({ title, description: "Knowledge Mission module." }))} />
        </Container>
      </Section>
    </LandingLayout>
  );
}
