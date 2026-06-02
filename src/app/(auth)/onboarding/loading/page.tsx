"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Spinner } from "@/components/ui/spinner";
import { createSeedState } from "@/data/seed";
import { useSession } from "@/lib/auth-client";
import { setOnboardingSource } from "@/lib/onboarding/storage";
import { saveStateImmediate } from "@/lib/storage/persistence";
import { hydrate, setSessionMeta } from "@/store/agenda-slice";
import { useAppDispatch } from "@/store/hooks";

const LOADING_DURATION_MS = 1000;

export default function OnboardingLoadingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();
  const seedAppliedRef = useRef(false);

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    if (!userId) return;

    if (!seedAppliedRef.current) {
      seedAppliedRef.current = true;

      setOnboardingSource(userId, "dummy");
      const seed = createSeedState();
      saveStateImmediate(seed, userId);
      dispatch(setSessionMeta({ userId, isOnboarded: true }));
      dispatch(hydrate(seed));
    }

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (!cancelled) {
        router.replace("/");
      }
    }, LOADING_DURATION_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, isPending, router, session?.user?.id]);

  return (
    <AuthBackdrop className="flex flex-col items-center justify-center gap-2">
      <Spinner className="relative z-10 size-8" />
      <p className="text-primary-foreground text-sm">Carregando dados...</p>
    </AuthBackdrop>
  );
}
