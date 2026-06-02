"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Spinner } from "@/components/ui/spinner";
import { createSeedState } from "@/data/seed";
import { useSession } from "@/lib/auth-client";
import { ui } from "@/lib/i18n/pt-br";
import { applyOnboardingState } from "@/lib/import/apply-onboarding-state";
import { buildImportedAppState } from "@/lib/import/build-imported-state";
import { consumeImportPending } from "@/lib/import/import-pending-storage";
import { useAppDispatch } from "@/store/hooks";

const LOADING_DURATION_MS = 1000;

type OnboardingLoadingSource = "dummy" | "import";

function parseSource(value: string | null): OnboardingLoadingSource {
  return value === "import" ? "import" : "dummy";
}

export default function OnboardingLoadingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();
  const appliedRef = useRef(false);

  const source = parseSource(searchParams.get("source"));
  const loadingMessage =
    source === "import"
      ? ui.onboardingLoadingImport
      : ui.onboardingLoadingDummy;

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    if (!userId) return;

    if (!appliedRef.current) {
      appliedRef.current = true;

      if (source === "import") {
        const contacts = consumeImportPending();

        if (!contacts?.length) {
          router.replace("/onboarding");
          return;
        }

        applyOnboardingState(
          dispatch,
          userId,
          buildImportedAppState(contacts),
          "import",
        );
      } else {
        applyOnboardingState(dispatch, userId, createSeedState(), "dummy");
      }
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
  }, [dispatch, isPending, router, session?.user?.id, source]);

  return (
    <AuthBackdrop className="flex flex-col items-center justify-center gap-2">
      <Spinner className="relative z-10 size-8" />
      <p className="text-primary-foreground text-sm">{loadingMessage}</p>
    </AuthBackdrop>
  );
}
