import type { Contact } from "./contact";
import type { Event } from "./event";
import type { Note } from "./note";
import type { Reminder } from "./reminder";
import type { Tag } from "./tag";

export type AppState = {
  contacts: Contact[];
  tags: Tag[];
  events: Event[];
  reminders: Reminder[];
  notes: Note[];
};

export type ContactFilters = {
  favorites?: boolean;
  tagSlug?: string;
  query?: string;
  sort?: "az" | "za";
};
