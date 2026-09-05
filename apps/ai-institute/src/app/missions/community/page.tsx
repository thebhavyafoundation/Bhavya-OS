"use client";

import Link from "next/link";

export default function CommunityMissionPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/20">
              <span className="text-2xl">🤝</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Community Mission
            </h1>
          </div>
          <p className="text-xl text-white/60 max-w-2xl">
            Empowering young people, women, schools, and communities through
            education, leadership, and participation.
          </p>
        </div>
      </section>

      {/* Purpose */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Purpose</h2>
          <p className="text-white/60 leading-relaxed">
            The Community Mission exists to ensure that Bhavya Foundation&apos;s
            work creates genuine, lasting impact in the communities it serves.
            We believe that sustainable change comes from empowering people —
            not just providing services.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Youth Empowerment",
                description:
                  "Providing young people with skills, mentorship, and opportunities to lead change in their communities.",
              },
              {
                title: "Women in Technology",
                description:
                  "Creating pathways for women to participate in AI and technology education and careers.",
              },
              {
                title: "School Partnerships",
                description:
                  "Working with schools to integrate AI literacy and environmental education into curricula.",
              },
              {
                title: "Village Development",
                description:
                  "Supporting rural communities with digital infrastructure, education, and sustainable livelihoods.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Impact</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-white/50 text-sm">
              The Community Mission tracks: communities engaged, volunteers
              active, schools partnered, and programs delivered. Impact is
              measured through direct participation metrics and community
              feedback, not inflated claims.
            </p>
          </div>
        </div>
      </section>

      {/* Participate */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/community"
              className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center hover:bg-purple-500/20 transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Join</div>
              <div className="text-sm text-white/50">
                Connect with the community
              </div>
            </Link>
            <Link
              href="/register"
              className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center hover:bg-purple-500/20 transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Volunteer</div>
              <div className="text-sm text-white/50">
                Contribute your time and skills
              </div>
            </Link>
            <Link
              href="/donate"
              className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 text-center hover:bg-purple-500/20 transition-colors"
            >
              <div className="text-lg font-semibold mb-1">Support</div>
              <div className="text-sm text-white/50">
                Fund community programs
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
