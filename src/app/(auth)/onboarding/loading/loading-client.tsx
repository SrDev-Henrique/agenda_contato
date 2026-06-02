"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { AuthBackdrop } from "@/components/auth/auth-backdrop";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "@/lib/auth-client";
import { ui } from "@/lib/i18n/pt-br";
import { applyOnboardingState } from "@/lib/import/apply-onboarding-state";
import { buildImportedAppState } from "@/lib/import/build-imported-state";
import { consumeImportPending } from "@/lib/import/import-pending-storage";
import { buildSampleAppState } from "@/lib/onboarding/build-sample-state";
import { useAppDispatch } from "@/store/hooks";
import type { Contact } from "@/types/contact";

const MIN_LOADING_MS = 1500;
const GITHUB_FETCH_TIMEOUT_MS = 12_000;

type OnboardingLoadingSource = "dummy" | "import";

function parseSource(value: string | null): OnboardingLoadingSource {
  return value === "import" ? "import" : "dummy";
}

async function fetchGithubContacts(): Promise<Contact[]> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    GITHUB_FETCH_TIMEOUT_MS,
  );

  try {
    const response = await fetch("/api/onboarding/github-contacts", {
      credentials: "include",
      signal: controller.signal,
    });

    if (!response.ok) return [];

    const data = (await response.json()) as { contacts?: Contact[] };
    return data.contacts ?? [];
  } catch {
    return [];
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function scheduleRedirect(
  router: ReturnType<typeof useRouter>,
  startedAt: number,
  isActive: () => boolean,
): number {
  const remaining = MIN_LOADING_MS - (Date.now() - startedAt);
  return window.setTimeout(() => {
    if (isActive()) {
      router.replace("/");
    }
  }, Math.max(0, remaining));
}

export default function OnboardingLoadingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { data: session, isPending } = useSession();
  const stateAppliedRef = useRef(false);

  const source = parseSource(searchParams.get("source"));
  const loadingMessage =
    source === "import"
      ? ui.onboardingLoadingImport
      : ui.onboardingLoadingDummy;

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    if (!userId) {
      router.replace("/sign-up");
      return;
    }

    let active = true;
    let redirectTimeoutId: number | undefined;
    const onboardUserId = userId;

    void (async () => {
      const startedAt = Date.now();
      let goHome = true;

      try {
        if (source === "import") {
          const contacts = consumeImportPending();

          if (!contacts?.length) {
            goHome = false;
            if (active) router.replace("/onboarding");
            return;
          }

          if (!stateAppliedRef.current) {
            stateAppliedRef.current = true;
            applyOnboardingState(
              dispatch,
              onboardUserId,
              buildImportedAppState(contacts),
              "import",
            );
          }
        } else if (!stateAppliedRef.current) {
          const githubContacts = await fetchGithubContacts();
          stateAppliedRef.current = true;
          applyOnboardingState(
            dispatch,
            onboardUserId,
            buildSampleAppState(githubContacts),
            "dummy",
          );
        }
      } catch {
        if (!stateAppliedRef.current) {
          stateAppliedRef.current = true;
          applyOnboardingState(
            dispatch,
            onboardUserId,
            buildSampleAppState([]),
            "dummy",
          );
        }
      }

      if (!active || !goHome) return;

      redirectTimeoutId = scheduleRedirect(router, startedAt, () => active);
    })();

    return () => {
      active = false;
      if (redirectTimeoutId !== undefined) {
        window.clearTimeout(redirectTimeoutId);
      }
    };
  }, [dispatch, isPending, router, session?.user?.id, source]);

  return (
    <AuthBackdrop className="flex flex-col items-center justify-center gap-2">
      <Spinner className="relative z-10 size-8" />
      <p className="text-primary-foreground text-sm">{loadingMessage}</p>
    </AuthBackdrop>
  );
}
