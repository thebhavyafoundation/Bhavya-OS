import { docs } from "@bhavya/docs";
import { DocsSearch, LandingLayout, Section, SectionHeader, Container } from "@bhavya/ui";

export default function LibraryAppPage() {
  return (
    <LandingLayout>
      <Section>
        <Container className="space-y-8">
          <SectionHeader eyebrow="Digital Library" title="Knowledge access, AI literacy, and lifelong learning." />
          <DocsSearch docs={docs.filter((doc) => doc.section === "Digital Library" || doc.section === "Policies")} />
        </Container>
      </Section>
    </LandingLayout>
  );
}
