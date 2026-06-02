import { getAgendaStorageKey } from "@/lib/storage/constants";

export type OnboardingSource = "dummy" | "import";

const ONBOARDING_STORAGE_KEY = "agendly-onboarding:v1";

type OnboardingRecord = Record<string, OnboardingSource>;

function readRecord(): OnboardingRecord {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};

    return parsed as OnboardingRecord;
  } catch {
    return {};
  }
}

function writeRecord(record: OnboardingRecord): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(record));
}

export function isOnboarded(userId: string): boolean {
  return userId in readRecord();
}

export function getOnboardingSource(userId: string): OnboardingSource | null {
  return readRecord()[userId] ?? null;
}

export function setOnboardingSource(
  userId: string,
  source: OnboardingSource,
): void {
  const record = readRecord();
  record[userId] = source;
  writeRecord(record);
}

export function clearUserLocalData(userId: string): void {
  if (typeof window === "undefined") return;

  const record = readRecord();
  delete record[userId];
  writeRecord(record);

  window.localStorage.removeItem(getAgendaStorageKey(userId));
}
