import type { AppState } from "@/types/app-state";
import type { ContactFilters } from "@/types/app-state";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";
import type { Tag } from "@/types/tag";

export function getContactById(
  state: AppState,
  id: string,
): Contact | undefined {
  return state.contacts.find((c) => c.id === id);
}

export function getTagBySlug(state: AppState, slug: string): Tag | undefined {
  return state.tags.find((t) => t.slug === slug);
}

export function getContactsFiltered(
  state: AppState,
  filters: ContactFilters,
): Contact[] {
  let result = [...state.contacts];

  if (filters.favorites) {
    result = result.filter((c) => c.favorite);
  }

  if (filters.tagSlug) {
    const tag = getTagBySlug(state, filters.tagSlug);
    if (tag) {
      result = result.filter((c) => c.tagIds.includes(tag.id));
    } else {
      result = [];
    }
  }

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(q));
  }

  const sort = filters.sort ?? "az";
  result.sort((a, b) => {
    const cmp = a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
    return sort === "az" ? cmp : -cmp;
  });

  return result;
}

export function getPinnedContacts(
  state: AppState,
  filters: ContactFilters,
): Contact[] {
  return getContactsFiltered(state, filters).filter((c) => c.pinned);
}

export function getUnpinnedContacts(
  state: AppState,
  filters: ContactFilters,
): Contact[] {
  return getContactsFiltered(state, filters).filter((c) => !c.pinned);
}

export function groupContactsByLetter(contacts: Contact[]): Map<string, Contact[]> {
  const groups = new Map<string, Contact[]>();

  for (const contact of contacts) {
    const letter =
      contact.name.trim().charAt(0).toUpperCase() || "#";
    const key = /[A-ZÀ-ÖØ-Þ]/.test(letter) ? letter : "#";
    const list = groups.get(key) ?? [];
    list.push(contact);
    groups.set(key, list);
  }

  return new Map(
    [...groups.entries()].sort(([a], [b]) => a.localeCompare(b, "pt-BR")),
  );
}

export function getUntaggedCount(state: AppState): number {
  return state.contacts.filter((c) => c.tagIds.length === 0).length;
}

export function getTagsWithCounts(
  state: AppState,
): Array<Tag & { count: number }> {
  return state.tags.map((tag) => ({
    ...tag,
    count: state.contacts.filter((c) => c.tagIds.includes(tag.id)).length,
  }));
}

export function getAllEventsSorted(state: AppState): Event[] {
  return [...state.events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export function getEventsForContact(state: AppState, contactId: string): Event[] {
  return getAllEventsSorted(state).filter((e) => e.contactId === contactId);
}

export function getRemindersForContact(
  state: AppState,
  contactId: string,
) {
  return state.reminders
    .filter((r) => r.contactId === contactId)
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
}

export function getNotesForContact(state: AppState, contactId: string) {
  return state.notes
    .filter((n) => n.contactId === contactId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export function getContactTags(state: AppState, contact: Contact): Tag[] {
  return contact.tagIds
    .map((id) => state.tags.find((t) => t.id === id))
    .filter((t): t is Tag => Boolean(t));
}

export function getCurrentWeekRange(now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

export function isDateInCurrentWeek(value: string | Date, now = new Date()) {
  const date = new Date(value);
  const { start, end } = getCurrentWeekRange(now);
  return date >= start && date < end;
}

export function filterEventsByWeek(
  events: Event[],
  week: "current" | "all",
): Event[] {
  if (week === "all") return events;

  return events.filter((e) => isDateInCurrentWeek(e.startsAt));
}
