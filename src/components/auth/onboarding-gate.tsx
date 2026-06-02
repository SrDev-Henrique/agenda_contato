"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { isOnboarded } from "@/lib/onboarding/storage";

type OnboardingGateProps = {
  children: React.ReactNode;
};

export function OnboardingGate({ children }: OnboardingGateProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const userId = session?.user?.id;
  const onboarded = userId ? isOnboarded(userId) : false;

  useEffect(() => {
    if (isPending || !userId) return;

    if (!isOnboarded(userId)) {
      router.replace("/onboarding");
    }
  }, [isPending, router, userId]);

  if (isPending || !userId || !onboarded) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-background">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
