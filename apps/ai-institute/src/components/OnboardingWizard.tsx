"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";

const STEPS = ["welcome", "role", "interests", "complete"] as const;

const ROLES = [
  {
    id: "student" as const,
    label: "Student",
    description: "I want to learn AI from scratch",
    icon: "📚",
  },
  {
    id: "builder" as const,
    label: "Builder",
    description: "I want to build AI-powered projects",
    icon: "🔨",
  },
  {
    id: "researcher" as const,
    label: "Researcher",
    description: "I want to understand AI deeply",
    icon: "🔬",
  },
];

const INTERESTS = [
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Robotics",
  "AI Ethics",
  "Data Science",
  "Prompt Engineering",
  "System Design",
  "Creative AI",
  "AI for Good",
  "Open Source",
];

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps) {
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  function nextStep() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function prevStep() {
    if (step > 0) setStep(step - 1);
  }

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  function handleComplete() {
    updateProfile({
      role: selectedRole || "student",
      interests: selectedInterests,
      onboardingComplete: true,
    });
    onComplete();
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent-gold to-text-tertiary flex items-center justify-center">
                <span className="text-3xl font-bold text-white">AI</span>
              </div>
              <h1 className="text-3xl font-bold text-text-primary">
                Welcome to AI Institute
              </h1>
              <p className="text-text-tertiary text-sm leading-relaxed max-w-sm mx-auto">
                Learn AI by building real things. Let&apos;s set up your
                learning experience in just a few steps.
              </p>
              <button
                onClick={nextStep}
                className="px-8 py-3 rounded-xl bg-accent-gold text-text-primary font-semibold text-sm hover:bg-accent-gold/90 transition-colors"
              >
                Get Started
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  What best describes you?
                </h2>
                <p className="text-sm text-text-tertiary">
                  Choose your learning path
                </p>
              </div>
              <div className="space-y-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      selectedRole === role.id
                        ? "bg-accent-gold/10 border-accent-gold/40 text-text-primary"
                        : "bg-bg-secondary border-border-primary/40 text-text-tertiary hover:border-border-primary/60"
                    }`}
                  >
                    <span className="text-2xl">{role.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{role.label}</div>
                      <div className="text-xs opacity-70">
                        {role.description}
                      </div>
                    </div>
                    {selectedRole === role.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-accent-gold flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-text-primary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border border-border-primary/40 text-text-tertiary text-sm hover:bg-bg-tertiary/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!selectedRole}
                  className="flex-1 px-6 py-3 rounded-xl bg-accent-gold text-text-primary font-semibold text-sm hover:bg-accent-gold/90 transition-colors disabled:opacity-30"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">
                  What interests you?
                </h2>
                <p className="text-sm text-text-tertiary">
                  Select at least 3 topics
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      selectedInterests.includes(interest)
                        ? "bg-accent-gold/15 border-accent-gold/40 text-accent-gold"
                        : "bg-bg-secondary border-border-primary/40 text-text-tertiary hover:border-border-primary/60"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl border border-border-primary/40 text-text-tertiary text-sm hover:bg-bg-tertiary/20 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={selectedInterests.length < 3}
                  className="flex-1 px-6 py-3 rounded-xl bg-accent-gold text-text-primary font-semibold text-sm hover:bg-accent-gold/90 transition-colors disabled:opacity-30"
                >
                  Continue ({selectedInterests.length}/3+)
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-bg-tertiary/30 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-accent-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                You&apos;re all set!
              </h2>
              <p className="text-sm text-text-tertiary max-w-sm mx-auto">
                Welcome to the AI Institute,{" "}
                <span className="text-accent-gold">{user?.name}</span>. Your
                learning journey begins now.
              </p>
              <button
                onClick={handleComplete}
                className="px-8 py-3 rounded-xl bg-accent-gold text-text-primary font-semibold text-sm hover:bg-accent-gold/90 transition-colors"
              >
                Start Learning
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= step ? "bg-accent-gold" : "bg-bg-tertiary/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
