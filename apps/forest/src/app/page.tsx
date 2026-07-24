import { InteractiveMapPlaceholder } from "@bhavya/maps";
import { LandingLayout, Section, SectionHeader, Container } from "@bhavya/ui";

export default function ForestAppPage() {
  return (
    <LandingLayout>
      <Section>
        <Container className="space-y-8">
          <SectionHeader eyebrow="Forest App" title="Forest Mission operations." description="Projects, restoration sites, watersheds, native species, volunteers, research, gallery, and impact dashboard." />
          <InteractiveMapPlaceholder />
        </Container>
      </Section>
    </LandingLayout>
  );
}
