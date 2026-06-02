import { z } from "zod";
import { contactSchema } from "@/lib/storage/schema";
import type { Contact } from "@/types/contact";

const IMPORT_PENDING_KEY = "agendly-import-pending:v1";

const importPendingSchema = z.array(contactSchema);

export function setImportPending(contacts: Contact[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(IMPORT_PENDING_KEY, JSON.stringify(contacts));
}

export function consumeImportPending(): Contact[] | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(IMPORT_PENDING_KEY);
    sessionStorage.removeItem(IMPORT_PENDING_KEY);

    if (!raw) return null;

    const parsed = importPendingSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;

    return parsed.data;
  } catch {
    sessionStorage.removeItem(IMPORT_PENDING_KEY);
    return null;
  }
}
