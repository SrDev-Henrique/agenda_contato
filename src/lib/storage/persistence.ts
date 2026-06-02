import { createEmptyState } from "@/data/seed";
import { isOnboarded } from "@/lib/onboarding/storage";
import type { AppState } from "@/types/app-state";
import { getAgendaStorageKey } from "./constants";
import { normalizeAppState } from "./normalize-state";
import { appStateSchema } from "./schema";

export function loadState(userId: string | null): AppState {
  if (typeof window === "undefined" || !userId) {
    return createEmptyState();
  }

  if (!isOnboarded(userId)) {
    return createEmptyState();
  }

  try {
    const raw = window.localStorage.getItem(getAgendaStorageKey(userId));
    if (!raw) {
      return createEmptyState();
    }

    const parsed = appStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return createEmptyState();
    }

    return normalizeAppState(parsed.data);
  } catch {
    return createEmptyState();
  }
}

export function saveStateImmediate(state: AppState, userId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    getAgendaStorageKey(userId),
    JSON.stringify(state),
  );
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveStateDebounced(
  state: AppState,
  userId: string,
  delayMs = 300,
): void {
  if (typeof window === "undefined") return;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    saveStateImmediate(state, userId);
    saveTimeout = null;
  }, delayMs);
}
