export const LEGACY_STORAGE_KEY = "agendly-agenda:v1";

export function getAgendaStorageKey(userId: string): string {
  return `${LEGACY_STORAGE_KEY}:${userId}`;
}
