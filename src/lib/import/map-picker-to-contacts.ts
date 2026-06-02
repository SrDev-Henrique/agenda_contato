import { createId } from "@/lib/id";
import type { Contact } from "@/types/contact";

import type { ContactInfo } from "./contact-picker";

function nowIso() {
  return new Date().toISOString();
}

function firstNonEmpty(values?: string[]): string | undefined {
  if (!values?.length) return undefined;

  const value = values.find((item) => item.trim().length > 0)?.trim();
  return value || undefined;
}

export function mapPickerResultsToContacts(results: ContactInfo[]): Contact[] {
  const now = nowIso();
  const contacts: Contact[] = [];

  for (const result of results) {
    const name = firstNonEmpty(result.name);
    if (!name) continue;

    const phone = firstNonEmpty(result.tel);
    const email = firstNonEmpty(result.email);

    contacts.push({
      id: createId(),
      name,
      favorite: false,
      pinned: false,
      tagIds: [],
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
      createdAt: now,
      updatedAt: now,
    });
  }

  return contacts;
}
