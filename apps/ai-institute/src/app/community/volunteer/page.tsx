"use client";

import { useState, useEffect } from "react";

interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  status: string;
}

export default function VolunteerPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    fetch("/api/volunteers")
      .then((r) => r.json())
      .then(setVolunteers)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Volunteer
          </h1>
          <p className="text-text-secondary">
            Join our community of volunteers making a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Skills
            </h2>
            <p className="text-sm text-text-secondary">
              Browse available volunteer skills.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Training
            </h2>
            <p className="text-sm text-text-secondary">
              Access volunteer training materials.
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              Assignments
            </h2>
            <p className="text-sm text-text-secondary">
              View and manage volunteer assignments.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Active Volunteers
          </h2>
          {volunteers.length === 0 ? (
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 text-center">
              <p className="text-text-secondary text-sm">
                Volunteer data will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {volunteers.map((v) => (
                <div
                  key={v.id}
                  className="flex justify-between items-center bg-bg-secondary border border-border-primary rounded-xl p-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-text-primary">
                      {v.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {v.skills.join(", ")}
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
