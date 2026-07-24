import { FeatureGrid, LandingLayout, Section, SectionHeader, Container } from "@bhavya/ui";

export default function VolunteerAppPage() {
  return (
    <LandingLayout>
      <Section>
        <Container className="space-y-8">
          <SectionHeader eyebrow="Volunteer App" title="Registration, dashboard, events, training, and recognition." />
          <FeatureGrid items={["Registration", "Dashboard", "Leaderboard", "Certificates", "Events", "Training", "Recognition"].map((title) => ({ title, description: "Volunteer Mission module." }))} />
        </Container>
      </Section>
    </LandingLayout>
  );
}
