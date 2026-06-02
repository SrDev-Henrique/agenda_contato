"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Spinner } from "@/components/ui/spinner";

const OnboardingLoadingClient = dynamic(() => import("./loading-client"), {
  ssr: false,
});

function LoadingFallback() {
  return (
    <AuthBackdrop className="flex flex-col items-center justify-center gap-2">
      <Spinner className="relative z-10 size-8" />
    </AuthBackdrop>
  );
}

export default function OnboardingLoadingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OnboardingLoadingClient />
    </Suspense>
  );
}
