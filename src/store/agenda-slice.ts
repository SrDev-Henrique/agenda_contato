import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { createEmptyState } from "@/data/seed";
import { inferReminderType } from "@/lib/activity-display";
import { createId, slugify } from "@/lib/id";
import { getTagUsageCount } from "@/lib/selectors";
import { normalizeAppState } from "@/lib/storage/normalize-state";
import type { AppState } from "@/types/app-state";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";
import type { Note } from "@/types/note";
import type { Reminder } from "@/types/reminder";
import type { Tag } from "@/types/tag";

export type AgendaRootState = {
  agenda: AppState;
  meta: {
    isHydrated: boolean;
    userId: string | null;
    isOnboarded: boolean;
    addingEvent: boolean;
    addingReminder: boolean;
  };
};

const initialState: AgendaRootState = {
  agenda: createEmptyState(),
  meta: {
    isHydrated: false,
    userId: null,
    isOnboarded: false,
    addingEvent: false,
    addingReminder: false,
  },
};

function nowIso() {
  return new Date().toISOString();
}

const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<AppState>) {
      state.agenda = normalizeAppState(action.payload);
    },
    setHydrated(state, action: PayloadAction<boolean>) {
      state.meta.isHydrated = action.payload;
    },
    setSessionMeta(
      state,
      action: PayloadAction<{ userId: string | null; isOnboarded: boolean }>,
    ) {
      state.meta.userId = action.payload.userId;
      state.meta.isOnboarded = action.payload.isOnboarded;
    },
    setAddingEvent(state, action: PayloadAction<boolean>) {
      state.meta.addingEvent = action.payload;
      if (action.payload) {
        state.meta.addingReminder = false;
      }
    },
    setAddingReminder(state, action: PayloadAction<boolean>) {
      state.meta.addingReminder = action.payload;
      if (action.payload) {
        state.meta.addingEvent = false;
      }
    },
    closeEventComposers(state) {
      state.meta.addingEvent = false;
      state.meta.addingReminder = false;
    },
    addContact(
      state,
      action: PayloadAction<
        {
          id: string;
          name: string;
        } & Partial<Omit<Contact, "id" | "name" | "createdAt" | "updatedAt">>
      >,
    ) {
      const now = nowIso();
      const contact: Contact = {
        favorite: false,
        pinned: false,
        tagIds: [],
        createdAt: now,
        updatedAt: now,
        ...action.payload,
        id: action.payload.id,
        name: action.payload.name.trim(),
      };
      state.agenda.contacts.push(contact);
    },
    updateContact(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Contact> }>,
    ) {
      const now = nowIso();
      const contact = state.agenda.contacts.find(
        (c) => c.id === action.payload.id,
      );
      if (contact) {
        Object.assign(contact, action.payload.patch, { updatedAt: now });
      }
    },
    deleteContact(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      state.agenda.contacts = state.agenda.contacts.filter((c) => c.id !== id);
      state.agenda.events = state.agenda.events.filter(
        (e) => e.contactId !== id,
      );
      state.agenda.reminders = state.agenda.reminders.filter(
        (r) => r.contactId !== id,
      );
      state.agenda.notes = state.agenda.notes.filter((n) => n.contactId !== id);
    },
    addTag(state, action: PayloadAction<{ id?: string; name: string }>) {
      const name = action.payload.name.trim();
      if (!name) return;
      const slug = slugify(name);
      if (state.agenda.tags.some((t) => t.slug === slug)) return;
      const tag: Tag = {
        id: action.payload.id ?? createId(),
        name,
        slug,
      };
      state.agenda.tags.push(tag);
      state.agenda.tags.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    },
    removeTagFromContact(
      state,
      action: PayloadAction<{ contactId: string; tagId: string }>,
    ) {
      const { contactId, tagId } = action.payload;
      const contact = state.agenda.contacts.find((c) => c.id === contactId);
      if (!contact?.tagIds.includes(tagId)) return;

      const usageBefore = getTagUsageCount(state.agenda, tagId);

      contact.tagIds = contact.tagIds.filter((id) => id !== tagId);
      contact.updatedAt = nowIso();

      if (usageBefore === 1) {
        state.agenda.tags = state.agenda.tags.filter((t) => t.id !== tagId);
      }
    },
    deleteTag(state, action: PayloadAction<{ tagId: string }>) {
      const { tagId } = action.payload;
      const now = nowIso();

      state.agenda.tags = state.agenda.tags.filter((t) => t.id !== tagId);

      for (const contact of state.agenda.contacts) {
        if (!contact.tagIds.includes(tagId)) continue;
        contact.tagIds = contact.tagIds.filter((id) => id !== tagId);
        contact.updatedAt = now;
      }
    },
    addEvent(state, action: PayloadAction<Omit<Event, "id">>) {
      const event: Event = { ...action.payload, id: createId() };
      state.agenda.events.push(event);
    },
    updateEvent(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Event> }>,
    ) {
      const event = state.agenda.events.find((e) => e.id === action.payload.id);
      if (event) {
        Object.assign(event, action.payload.patch);
      }
    },
    deleteEvent(state, action: PayloadAction<{ id: string }>) {
      state.agenda.events = state.agenda.events.filter(
        (e) => e.id !== action.payload.id,
      );
    },
    addReminder(
      state,
      action: PayloadAction<Omit<Reminder, "id" | "createdAt">>,
    ) {
      const reminder: Reminder = {
        ...action.payload,
        type: action.payload.type ?? inferReminderType(action.payload.text),
        id: createId(),
        createdAt: nowIso(),
      };
      state.agenda.reminders.push(reminder);
    },
    updateReminder(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Reminder> }>,
    ) {
      const reminder = state.agenda.reminders.find(
        (r) => r.id === action.payload.id,
      );
      if (reminder) {
        Object.assign(reminder, action.payload.patch);
      }
    },
    deleteReminder(state, action: PayloadAction<{ id: string }>) {
      state.agenda.reminders = state.agenda.reminders.filter(
        (r) => r.id !== action.payload.id,
      );
    },
    addNote(
      state,
      action: PayloadAction<Omit<Note, "id" | "createdAt" | "updatedAt">>,
    ) {
      const now = nowIso();
      const note: Note = {
        ...action.payload,
        id: createId(),
        createdAt: now,
        updatedAt: now,
      };
      state.agenda.notes.push(note);
    },
    updateNote(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Note> }>,
    ) {
      const now = nowIso();
      const note = state.agenda.notes.find((n) => n.id === action.payload.id);
      if (note) {
        Object.assign(note, action.payload.patch, { updatedAt: now });
      }
    },
    deleteNote(state, action: PayloadAction<{ id: string }>) {
      state.agenda.notes = state.agenda.notes.filter(
        (n) => n.id !== action.payload.id,
      );
    },
  },
});

export const {
  hydrate,
  setHydrated,
  setSessionMeta,
  setAddingEvent,
  setAddingReminder,
  closeEventComposers,
  addContact,
  updateContact,
  deleteContact,
  addTag,
  removeTagFromContact,
  deleteTag,
  addEvent,
  updateEvent,
  deleteEvent,
  addReminder,
  updateReminder,
  deleteReminder,
  addNote,
  updateNote,
  deleteNote,
} = agendaSlice.actions;

export const agendaReducer = agendaSlice.reducer;
