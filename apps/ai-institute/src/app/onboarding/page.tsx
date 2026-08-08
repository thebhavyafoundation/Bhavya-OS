"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import OnboardingWizard from "@/components/OnboardingWizard";

export default function OnboardingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return <OnboardingWizard onComplete={() => router.push("/dashboard")} />;
}
