"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Spinner } from "@/components/ui/spinner";
import { isOnboarded } from "@/lib/onboarding/storage";

type OnboardingGateProps = {
  userId: string;
  children: React.ReactNode;
};

export function OnboardingGate({ userId, children }: OnboardingGateProps) {
  const router = useRouter();
  const onboarded = isOnboarded(userId);

  useEffect(() => {
    if (!isOnboarded(userId)) {
      router.replace("/onboarding");
    }
  }, [router, userId]);

  if (!onboarded) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
