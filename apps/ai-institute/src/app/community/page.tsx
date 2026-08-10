"use client";

import {
  HeartHandshake,
  Users,
  Calendar,
  HandHeart,
  BookOpen,
  ArrowRight,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { HeroBackground } from "@/components/HeroBackground";

const communityAreas = [
  {
    icon: Users,
    title: "Volunteer Corps",
    desc: "Join the Bhavya Volunteer Corps. Make hands-on impact in forest, heritage, and knowledge missions.",
    href: "/community/volunteer",
  },
  {
    icon: Calendar,
    title: "Events",
    desc: "Community events, workshops, and gatherings that bring people together for shared purpose.",
    href: "/community",
  },
  {
    icon: HandHeart,
    title: "Donations",
    desc: "Support Bhavya Foundation's missions. Every donation is publicly documented and tracked.",
    href: "/donate",
  },
  {
    icon: BookOpen,
    title: "Stories",
    desc: "Real stories from community members, volunteers, and the people we serve.",
    href: "/community",
  },
];

const involvementCards = [
  {
    icon: Sparkles,
    title: "Local Chapters",
    desc: "Start or join a Bhavya chapter in your city. Lead local missions for forest, heritage, and knowledge.",
  },
  {
    icon: Megaphone,
    title: "Ambassador Program",
    desc: "Spread awareness about Bhavya Foundation's missions in your network and community.",
  },
  {
    icon: HandHeart,
    title: "Monthly Giving",
    desc: "Sustained support for long-term missions. Every contribution is publicly documented.",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          paddingTop: "var(--header-h)",
        }}
      >
        <HeroBackground pillar="community" />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            color: "var(--color-text-inverse)",
          }}
        >
          <Reveal variant="slide-up" delay={0.2}>
            <span
              className="editorial-label"
              style={{ color: "var(--color-brand-gold)" }}
            >
              Community Mission
            </span>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                marginTop: "var(--space-4)",
              }}
            >
              People Building
              <br />a Stronger India
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                maxWidth: "600px",
                marginTop: "var(--space-6)",
                opacity: 0.9,
                lineHeight: 1.7,
              }}
            >
              Bhavya Foundation empowers youth, women, and communities to build
              a stronger Bhavya Bharat through volunteering, events, and shared
              purpose.
            </p>
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                marginTop: "var(--space-8)",
              }}
            >
              <a href="/community/volunteer" className="btn btn-gold">
                Volunteer Now
                <ArrowRight size={16} />
              </a>
              <a href="/app/community" className="btn btn-secondary-inverse">
                Join Community
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission Statement */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-forest-800) 100%)",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "800px" }}>
          <Reveal variant="fade">
            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 400,
                fontStyle: "italic",
                lineHeight: 1.5,
                color: "var(--color-text-inverse)",
                margin: 0,
              }}
            >
              &ldquo;Community is not a beneficiary. It is the architect of its
              own future.&rdquo;
            </blockquote>
            <p
              style={{
                marginTop: "var(--space-6)",
                color: "var(--color-brand-gold)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
              }}
            >
              — Bhavya Foundation
            </p>
          </Reveal>
        </div>
      </section>

      {/* Community Areas */}
      <section style={{ padding: "var(--space-24) 0" }}>
        <div className="container">
          <span className="editorial-label">Get Involved</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            Ways to Participate
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {communityAreas.map((area, i) => (
              <Reveal
                key={area.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <a
                  href={area.href}
                  className="glass"
                  style={{
                    padding: "var(--space-8)",
                    borderRadius: "var(--radius-lg)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    transition: "all var(--duration-normal) var(--ease-out)",
                  }}
                >
                  <area.icon
                    size={32}
                    style={{
                      color: "var(--color-brand-forest)",
                      marginBottom: "var(--space-4)",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-xl)",
                      fontWeight: 400,
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {area.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {area.desc}
                  </p>
                  <div
                    style={{
                      marginTop: "var(--space-4)",
                      color: "var(--color-brand-forest)",
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                    }}
                  >
                    Learn More <ArrowRight size={14} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Involvement Cards */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background: "var(--color-ivory-200)",
        }}
      >
        <div className="container">
          <span className="editorial-label">Deeper Involvement</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginTop: "var(--space-4)",
            }}
          >
            Go Further
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "var(--space-6)",
              marginTop: "var(--space-12)",
            }}
          >
            {involvementCards.map((card, i) => (
              <Reveal
                key={card.title}
                variant="slide-up"
                delay={i * 0.1}
                distance={30}
              >
                <div
                  style={{
                    background: "var(--color-bg-primary)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--space-8)",
                    border: "1px solid var(--color-border-primary)",
                  }}
                >
                  <card.icon
                    size={28}
                    style={{
                      color: "var(--color-brand-forest)",
                      marginBottom: "var(--space-4)",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 400,
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.7,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "var(--space-24) 0",
          background:
            "linear-gradient(160deg, var(--color-forest-950) 0%, var(--color-forest-800) 100%)",
          textAlign: "center",
          color: "var(--color-text-inverse)",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              marginBottom: "var(--space-6)",
            }}
          >
            Join the Bhavya Community
          </h2>
          <p
            style={{
              fontSize: "var(--text-lg)",
              maxWidth: "600px",
              margin: "0 auto var(--space-8)",
              opacity: 0.9,
              lineHeight: 1.7,
            }}
          >
            Volunteer, donate, or simply participate. Every contribution
            matters.
          </p>
          <a href="/app" className="btn btn-gold">
            Get Involved
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

    </div>
  );
}
