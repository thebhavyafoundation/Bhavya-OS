import type { Metadata } from "next";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  PageHero,
  SectionHeader,
  FeatureCard,
} from "../../components/ui/PageHero";
import { buildMetadata } from "../../lib/metadata";
import { PageContent, AnimatedGrid } from "../../components/PageContent";
import {
  Brain,
  BookOpen,
  Wifi,
  Users,
  Laptop,
  GraduationCap,
  Code,
  Lightbulb,
  ArrowRight,
  BookMarked,
} from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title:
    "Bhavya Knowledge Mission — AI Labs, Digital Libraries, Research — Bhavya Foundation",
  description:
    "Expanding access to knowledge through AI Labs, Digital Libraries, research, innovation, and digital literacy programmes for rural and underserved communities.",
  path: "/knowledge",
});

const aiLabFeatures = [
  {
    icon: <Laptop />,
    title: "Computers & Workstations",
    desc: "Modern computing equipment and internet-enabled learning spaces for communities.",
  },
  {
    icon: <Code />,
    title: "Coding Workshops",
    desc: "Hands-on programming sessions, innovation challenges, and community hackathons.",
  },
  {
    icon: <Brain />,
    title: "AI Literacy",
    desc: "Making AI education accessible — from prompt engineering to machine learning fundamentals.",
  },
  {
    icon: <Lightbulb />,
    title: "Innovation Challenges",
    desc: "Mentorship, research support, career guidance, and community-driven innovation.",
  },
];

const libraryServices = [
  {
    icon: <BookOpen />,
    title: "Digital Library",
    desc: "E-books, audiobooks, digital archives, research databases, educational software, and open educational resources.",
  },
  {
    icon: <Wifi />,
    title: "AI-Enabled Learning",
    desc: "Supervised access to AI tools for learning, research, writing assistance, programming, translation, and career development.",
  },
  {
    icon: <Users />,
    title: "Community Learning",
    desc: "Reading clubs, coding clubs, AI clubs, nature clubs, innovation labs, debates, research groups, and knowledge festivals.",
  },
  {
    icon: <GraduationCap />,
    title: "Research Support",
    desc: "Student research, environmental research, AI research, village documentation, and open research initiatives.",
  },
];

const educationAreas = [
  "AI Literacy & Prompt Engineering",
  "Machine Learning Fundamentals",
  "Responsible AI & Ethics",
  "Robotics & Programming",
  "Data Science & Open-Source AI",
  "Digital Entrepreneurship",
  "AI for Agriculture & Education",
  "AI for Public Service",
];

export default function KnowledgePage() {
  return (
    <>
      <Header currentPath="/knowledge" />
      <main id="main-content">
        <PageHero
          badge="BHAVYA KNOWLEDGE MISSION"
          title="Expanding Access to Knowledge"
          lead="Knowledge is one of humanity's greatest public resources. Access should not be determined by geography, income, or social background. The Bhavya Knowledge Mission makes education accessible to rural and underserved communities."
        />
        <div className="container">
          <PageContent>
            <SectionHeader
              eyebrow="Knowledge Packages"
              title="Start Learning Today"
              description="Free, structured Knowledge Packages for Grade 9 students. Each package is a complete learning unit — concepts, exercises, assessments, and portfolio projects."
            />
          </PageContent>
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              marginTop: "var(--space-6)",
              marginBottom: "var(--space-12)",
              flexWrap: "wrap",
            }}
          >
            <a href="/knowledge/packages" className="btn btn-primary">
              <BookMarked size={16} aria-hidden="true" />
              Browse Knowledge Packages
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          <PageContent>
            <SectionHeader
              eyebrow="Bhavya AI Labs"
              title="Learning, Experimentation & Innovation"
              description="AI Labs prioritize learning over commercialization — providing computers, internet, open-source software, mentorship, and community hackathons."
            />
          </PageContent>
          <AnimatedGrid columns={2}>
            {aiLabFeatures.map((f, i) => (
              <FeatureCard
                key={i}
                icon={f.icon}
                title={f.title}
                description={f.desc}
              />
            ))}
          </AnimatedGrid>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="AI Education"
                title="What We Teach"
                description="Making AI education accessible to rural and underserved communities through structured programmes."
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {educationAreas.map((area, i) => (
                <div key={i} className="info-card">
                  <div className="info-card-title" style={{ fontSize: "14px" }}>
                    {area}
                  </div>
                </div>
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Bhavya Digital Library"
                title="Knowledge Without Borders"
                description="The Digital Library operates through physical libraries, digital platforms, AI learning centres, mobile libraries, community knowledge centres, and village learning hubs."
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              {libraryServices.map((s, i) => (
                <FeatureCard
                  key={i}
                  icon={s.icon}
                  title={s.title}
                  description={s.desc}
                />
              ))}
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Guiding Principles"
                title="How We Serve Knowledge"
              />
            </PageContent>
            <AnimatedGrid columns={2}>
              <div className="info-card">
                <div className="info-card-title">Knowledge Before Profit</div>
                <div className="info-card-desc">
                  Every service is designed to expand access, not generate
                  revenue.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">
                  Accessibility Before Exclusivity
                </div>
                <div className="info-card-desc">
                  Priority given to school students, college students, rural
                  youth, job seekers, teachers, women, and persons with
                  disabilities.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">
                  Learning Before Certification
                </div>
                <div className="info-card-desc">
                  The objective is informed citizens, not merely certified
                  graduates.
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">
                  Open Knowledge Where Lawful
                </div>
                <div className="info-card-desc">
                  Encouraging open educational resources, Creative Commons
                  materials, and open-source software.
                </div>
              </div>
            </AnimatedGrid>
          </div>

          <div style={{ marginTop: "64px" }}>
            <PageContent>
              <SectionHeader
                eyebrow="Vision 2040"
                title="Bhavya Knowledge Network"
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7 }}
              >
                The Foundation shall strive to build an interconnected network
                of community knowledge centres across rural and urban India.
                Each centre integrating: Digital Library, AI Lab, Computer
                Education, Environmental Learning, Career Development, Research
                Resources, and Community Innovation Space. The long-term
                objective is to create self-sustaining learning ecosystems that
                empower individuals, strengthen communities, and expand access
                to knowledge for generations to come.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <PageContent>
              <SectionHeader
                eyebrow="Founder's Principle"
                title="Our Commitment to Knowledge"
              />
            </PageContent>
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "Knowledge should travel farther than roads, faster than
                technology, and deeper than classrooms. Every Bhavya Digital
                Library shall be a place where curiosity is welcomed, ideas are
                shared, and every individual is given the opportunity to learn,
                create, and lead."
              </div>
              <div className="content-meta" style={{ marginTop: 12 }}>
                — Shri Manohar Lal, Founder
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
