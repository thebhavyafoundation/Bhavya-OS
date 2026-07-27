"use client";

import { useState } from "react";
import {
  Users,
  Heart,
  School,
  HandHeart,
  TreePine,
  BookOpen,
  Check,
} from "lucide-react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  PageHero,
  SectionHeader,
  FeatureCard,
} from "../../components/ui/PageHero";
import { useGsapStagger, useGsapFadeIn } from "../../lib/animations";

export default function CommunityPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "Environmental Conservation",
    message: "",
  });

  const programmesRef = useGsapStagger(6);
  const volunteerRef = useGsapStagger(2);
  const formRef = useGsapFadeIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const communityAreas = [
    {
      icon: <Users />,
      title: "Youth Empowerment",
      desc: "Developing future leaders through education, skill development, and community service opportunities for young people.",
    },
    {
      icon: <Heart />,
      title: "Women's Empowerment",
      desc: "Supporting women's participation in conservation, education, and community development programmes.",
    },
    {
      icon: <School />,
      title: "School Programmes",
      desc: "Environmental education, AI literacy, digital libraries, and cultural awareness in schools across India.",
    },
    {
      icon: <HandHeart />,
      title: "Volunteer Development",
      desc: "The Bhavya Volunteer Corps — a structured programme for recruiting, training, supporting, and recognizing volunteers.",
    },
    {
      icon: <TreePine />,
      title: "Village Development",
      desc: "Rural innovation, sustainable development, and community-led initiatives for village empowerment.",
    },
    {
      icon: <BookOpen />,
      title: "Health & Awareness",
      desc: "Health awareness programmes, disaster relief support, and community well-being initiatives.",
    },
  ];

  const volunteerRights = [
    "Be treated with dignity and respect",
    "Receive appropriate orientation and guidance",
    "Work in a safe environment",
    "Know the expectations of their role",
    "Raise concerns without retaliation",
    "Receive recognition for meaningful service",
    "Have personal information protected",
  ];

  return (
    <>
      <Header currentPath="/community" />
      <main id="main-content">
        <PageHero
          badge="BHAVYA COMMUNITY MISSION"
          title="Empowering Communities, Building Leaders"
          lead="The Bhavya Community Mission focuses on youth empowerment, women's leadership, school programmes, village development, and the Bhavya Volunteer Corps. Community participation is the Foundation's strength."
        />
        <div className="container">
          <SectionHeader
            eyebrow="Community Programmes"
            title="How We Serve"
            description="From youth empowerment to village development, our programmes build resilient, self-sustaining communities."
          />
          <div
            className="grid-2"
            style={{ marginBottom: "64px" }}
            ref={programmesRef}
          >
            {communityAreas.map((c, i) => (
              <FeatureCard
                key={i}
                icon={c.icon}
                title={c.title}
                description={c.desc}
              />
            ))}
          </div>

          <SectionHeader
            eyebrow="Bhavya Volunteer Corps"
            title="Serve With Purpose"
            description="The Bhavya Volunteer Corps (BVC) is the Foundation's official volunteer network — supporting programmes, promoting community participation, and developing future leaders."
          />
          <div
            className="grid-2"
            style={{ marginBottom: "64px", alignItems: "start" }}
            ref={volunteerRef}
          >
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 16,
                }}
              >
                Volunteer Rights
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {volunteerRights.map((r, i) => (
                  <div
                    key={i}
                    className="info-card"
                    style={{ padding: "12px 16px" }}
                  >
                    <div className="info-card-desc" style={{ fontSize: 13 }}>
                      {r}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 16,
                }}
              >
                Volunteer Responsibilities
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Uphold the Constitution and policies",
                  "Act honestly and respectfully",
                  "Protect Foundation property",
                  "Maintain confidentiality",
                  "Follow lawful instructions",
                  "Report safety concerns promptly",
                  "Represent the Foundation professionally",
                ].map((r, i) => (
                  <div
                    key={i}
                    className="info-card"
                    style={{ padding: "12px 16px" }}
                  >
                    <div className="info-card-desc" style={{ fontSize: 13 }}>
                      {r}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-2" style={{ alignItems: "start" }} ref={formRef}>
            <div>
              <SectionHeader
                eyebrow="Join Us"
                title="Become a Bhavya Volunteer"
              />
              <p className="section-desc">
                Fill out this registration form to join the Bhavya Volunteer
                Corps. Applications are reviewed by our community team.
                Membership does not create an employment relationship.
              </p>
              <div className="info-card" style={{ marginTop: 16 }}>
                <h4 className="info-card-title">Volunteer Oath</h4>
                <p className="info-card-desc" style={{ fontStyle: "italic" }}>
                  "I voluntarily join the Bhavya Volunteer Corps with a
                  commitment to serve honestly, respectfully, and responsibly. I
                  shall uphold the Constitution and values of Bhavya Foundation,
                  protect nature, respect every individual, safeguard Foundation
                  resources, and strive to leave every community stronger than I
                  found it."
                </p>
              </div>
            </div>

            <div className="form-card">
              {submitted ? (
                <div className="form-success">
                  <span className="form-success-icon" aria-hidden="true">
                    <Check />
                  </span>
                  <h3 className="form-success-title">Application Submitted!</h3>
                  <p className="form-success-desc">
                    Thank you, <strong>{formData.name}</strong>! Your
                    application for <strong>{formData.interest}</strong> has
                    been received. Our team will contact you at{" "}
                    <code>{formData.email}</code>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="form-reset-btn"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-name">
                      Full Name
                    </label>
                    <input
                      id="v-name"
                      type="text"
                      className="form-input"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-email">
                      Email Address
                    </label>
                    <input
                      id="v-email"
                      type="email"
                      className="form-input"
                      required
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-interest">
                      Area of Interest
                    </label>
                    <select
                      id="v-interest"
                      className="form-select"
                      value={formData.interest}
                      onChange={(e) =>
                        setFormData({ ...formData, interest: e.target.value })
                      }
                    >
                      <option>Environmental Conservation</option>
                      <option>AI Education & Digital Literacy</option>
                      <option>Heritage Documentation</option>
                      <option>Community Outreach</option>
                      <option>School Programmes</option>
                      <option>Village Development</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-message">
                      Skills & Experience (Optional)
                    </label>
                    <textarea
                      id="v-message"
                      className="form-textarea"
                      rows={4}
                      placeholder="Tell us about your background or motivation..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="form-submit">
                    Submit Volunteer Application →
                  </button>
                </form>
              )}
            </div>
          </div>

          <div style={{ marginTop: 64 }}>
            <SectionHeader
              eyebrow="Founder's Principle"
              title="Our Commitment to Community"
            />
            <div className="info-card" style={{ maxWidth: 800 }}>
              <div
                className="info-card-desc"
                style={{ fontSize: 15, lineHeight: 1.7, fontStyle: "italic" }}
              >
                "A volunteer is not someone who gives spare time. A volunteer is
                someone who chooses to share responsibility for the future.
                Every member of the Bhavya Volunteer Corps is a steward of our
                mission and an ambassador of our values."
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
