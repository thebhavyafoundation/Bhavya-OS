"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import OnboardingWizard from "@/components/OnboardingWizard";
import { getIntent } from "@/lib/participation-intents";

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingFlow />
    </Suspense>
  );
}

function OnboardingFlow() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = getIntent(searchParams.get("intent"));

  // Redirect in an effect, never during render: calling router.push()
  // during render crashes static prerendering (no router context).
  // Middleware already redirects anonymous visitors server-side.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <OnboardingWizard onComplete={() => router.push(intent.destination)} />
  );
}
