"use client";

import dynamic from "next/dynamic";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Spinner } from "@/components/ui/spinner";

const OnboardingClient = dynamic(() => import("./onboarding-client"), {
  ssr: false,
  loading: () => (
    <AuthBackdrop>
      <Spinner className="relative z-10 size-8" />
    </AuthBackdrop>
  ),
});

export default function OnboardingPage() {
  return <OnboardingClient />;
}
