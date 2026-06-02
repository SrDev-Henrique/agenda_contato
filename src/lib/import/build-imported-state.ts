import { createEmptyState } from "@/data/seed";
import type { AppState } from "@/types/app-state";
import type { Contact } from "@/types/contact";

export function buildImportedAppState(contacts: Contact[]): AppState {
  return {
    ...createEmptyState(),
    contacts,
  };
}
