import type { OnboardingSource } from "@/lib/onboarding/storage";
import { setOnboardingSource } from "@/lib/onboarding/storage";
import { saveStateImmediate } from "@/lib/storage/persistence";
import type { AppDispatch } from "@/store";
import { hydrate, setSessionMeta } from "@/store/agenda-slice";
import type { AppState } from "@/types/app-state";

export function applyOnboardingState(
  dispatch: AppDispatch,
  userId: string,
  state: AppState,
  source: OnboardingSource,
): void {
  setOnboardingSource(userId, source);
  saveStateImmediate(state, userId);
  dispatch(setSessionMeta({ userId, isOnboarded: true }));
  dispatch(hydrate(state));
}
