import type { AppState } from "@/types/app-state";
import { createSeedState } from "@/data/seed";
import { STORAGE_KEY } from "./constants";
import { appStateSchema } from "./schema";

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return createSeedState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedState();
      saveStateImmediate(seed);
      return seed;
    }

    const parsed = appStateSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      const seed = createSeedState();
      saveStateImmediate(seed);
      return seed;
    }

    return parsed.data;
  } catch {
    const seed = createSeedState();
    saveStateImmediate(seed);
    return seed;
  }
}

export function saveStateImmediate(state: AppState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveStateDebounced(state: AppState, delayMs = 300): void {
  if (typeof window === "undefined") return;

  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    saveStateImmediate(state);
    saveTimeout = null;
  }, delayMs);
}
