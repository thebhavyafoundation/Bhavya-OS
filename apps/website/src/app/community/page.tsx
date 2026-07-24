"use client";

import { useState } from "react";
import { TreePine, Monitor, Users, Check } from "lucide-react";
import { AuditLogger, NotificationService } from "@bhavya/mission-runtime";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero, SectionHeader, FeatureCard } from "../../components/ui/PageHero";

export default function CommunityPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", interest: "Field Conservation (Trees & GIS)", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const audit = new AuditLogger();
    const notifications = new NotificationService();
    audit.log("website:volunteer", "form.submit", "volunteer-registration", `Volunteer application by ${formData.name}`, formData);
    notifications.send({ type: "success", title: "Application Submitted", message: `Thank you, ${formData.name}! We will review your application promptly.` });
    setSubmitted(true);
  };

  return (
    <>
      <Header currentPath="/community" />
      <main id="main-content">
        <PageHero
          badge="COMMUNITY & VOLUNTEERS"
          title="Join the Grassroots Movement for Nature & Heritage"
          lead="Every tree planted, manuscript transcribed, and research paper translated is made possible by a global network of dedicated volunteers, scientists, and citizens."
        />

        <div className="container">
          <SectionHeader eyebrow="Participation Pathways" title="How You Can Contribute" />

          <div className="grid-3" style={{ marginBottom: "64px" }}>
            <FeatureCard icon={<TreePine />} title="Field Conservation Corps" description="Join frontline reforestation drives, sacred grove fencing teams, wildlife telemetry monitoring, and community biodiversity surveys." />
            <FeatureCard icon={<Monitor />} title="Digital & Open-Source Volunteers" description="Contribute code to Bhavya OS, assist in manuscript transcription, build open-access tools, or translate technical documentation." />
            <FeatureCard icon={<Users />} title="Community Chapter Leadership" description="Organize local educational workshops, regional heritage documentation drives, and public environmental awareness meetings." />
          </div>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <div>
              <SectionHeader eyebrow="Direct Application" title="Become a Bhavya Volunteer" />
              <p className="section-desc">
                Fill out this registration form to join our volunteer database. Applications are reviewed directly by our regional community team.
              </p>
              <div className="info-card">
                <h4 className="info-card-title">100% Transparent Operation</h4>
                <p className="info-card-desc">Volunteer applications are recorded securely without commercial tracking. You will receive direct communications from official Foundation coordinators.</p>
              </div>
            </div>

            <div className="form-card">
              {submitted ? (
                <div className="form-success">
                  <span className="form-success-icon" aria-hidden="true"><Check /></span>
                  <h3 className="form-success-title">Application Submitted!</h3>
                  <p className="form-success-desc">
                    Thank you, <strong>{formData.name}</strong>! Your application for <strong>{formData.interest}</strong> has been logged. Our team will contact you at <code>{formData.email}</code>.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="form-reset-btn">Submit Another Application</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-name">Full Name</label>
                    <input id="v-name" type="text" className="form-input" required placeholder="e.g. Ananya Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-email">Email Address</label>
                    <input id="v-email" type="email" className="form-input" required placeholder="e.g. ananya@example.org" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-interest">Primary Area of Interest</label>
                    <select id="v-interest" className="form-select" value={formData.interest} onChange={e => setFormData({ ...formData, interest: e.target.value })}>
                      <option>Field Conservation (Trees & GIS)</option>
                      <option>Digital Archiving & Manuscripts</option>
                      <option>Open Source Software & Engineering</option>
                      <option>Community Outreach & Education</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="v-message">Skills & Experience (Optional)</label>
                    <textarea id="v-message" className="form-textarea" rows={4} placeholder="Tell us briefly about your background or motivation..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                  </div>
                  <button type="submit" className="form-submit">Submit Volunteer Application →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
