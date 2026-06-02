"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { ui } from "@/lib/i18n/pt-br";
import { isOnboarded } from "@/lib/onboarding/storage";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    if (userId && isOnboarded(userId)) {
      router.replace("/");
    }
  }, [isPending, router, session?.user?.id]);

  if (isPending) {
    return (
      <AuthBackdrop>
        <Spinner className="relative z-10 size-8" />
      </AuthBackdrop>
    );
  }

  return (
    <AuthBackdrop>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-border/80 bg-surface/90 p-8 shadow-xl backdrop-blur-sm"
      >
        <div className="mb-8 space-y-2 text-center">
          <p className="font-semibold text-accent text-lg tracking-tight">
            {ui.appName}
          </p>
          <h1 className="font-semibold text-2xl text-foreground tracking-tight">
            {ui.onboardingTitle}
          </h1>
          <p className="text-foreground-subtle text-sm leading-relaxed">
            {ui.onboardingDescription}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-between gap-2 text-sm"
            disabled
          >
            <span>{ui.onboardingImportContacts}</span>
            <Badge variant="secondary">{ui.onboardingComingSoon}</Badge>
          </Button>

          <Button
            type="button"
            variant="primary"
            className="h-11 w-full text-sm"
            onClick={() => router.push("/onboarding/loading")}
          >
            {ui.onboardingUseSampleData}
          </Button>
        </div>
      </motion.div>
    </AuthBackdrop>
  );
}
