"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { createSeedState } from "@/data/seed";
import { createId, slugify } from "@/lib/id";
import {
  getAllEventsSorted,
  getContactById,
  getContactsFiltered,
  getEventsForContact,
  getNotesForContact,
  getRemindersForContact,
  getTagsWithCounts,
  getUntaggedCount,
  filterEventsByWeek,
} from "@/lib/selectors";
import { loadState, saveStateDebounced } from "@/lib/storage/persistence";
import type { AppState, ContactFilters } from "@/types/app-state";
import type { Contact } from "@/types/contact";
import type { Event, EventType } from "@/types/event";
import type { Note } from "@/types/note";
import type { Reminder } from "@/types/reminder";
import type { Tag } from "@/types/tag";

type Action =
  | { type: "HYDRATE"; payload: AppState }
  | { type: "SET_STATE"; payload: AppState }
  | {
      type: "ADD_CONTACT";
      payload: {
        id: string;
        name: string;
      } & Partial<Omit<Contact, "id" | "name" | "createdAt" | "updatedAt">>;
    }
  | { type: "UPDATE_CONTACT"; payload: { id: string; patch: Partial<Contact> } }
  | { type: "DELETE_CONTACT"; payload: { id: string } }
  | { type: "ADD_TAG"; payload: { id?: string; name: string } }
  | { type: "ADD_EVENT"; payload: Omit<Event, "id"> }
  | { type: "UPDATE_EVENT"; payload: { id: string; patch: Partial<Event> } }
  | { type: "DELETE_EVENT"; payload: { id: string } }
  | { type: "ADD_REMINDER"; payload: Omit<Reminder, "id" | "createdAt"> }
  | { type: "DELETE_REMINDER"; payload: { id: string } }
  | { type: "ADD_NOTE"; payload: Omit<Note, "id" | "createdAt" | "updatedAt"> }
  | { type: "UPDATE_NOTE"; payload: { id: string; patch: Partial<Note> } }
  | { type: "DELETE_NOTE"; payload: { id: string } };

function reducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case "HYDRATE":
    case "SET_STATE":
      return action.payload;

    case "ADD_CONTACT": {
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
      return { ...state, contacts: [...state.contacts, contact] };
    }

    case "UPDATE_CONTACT":
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id
            ? { ...c, ...action.payload.patch, updatedAt: now }
            : c,
        ),
      };

    case "DELETE_CONTACT": {
      const { id } = action.payload;
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== id),
        events: state.events.filter((e) => e.contactId !== id),
        reminders: state.reminders.filter((r) => r.contactId !== id),
        notes: state.notes.filter((n) => n.contactId !== id),
      };
    }

    case "ADD_TAG": {
      const name = action.payload.name.trim();
      if (!name) return state;
      const slug = slugify(name);
      if (state.tags.some((t) => t.slug === slug)) return state;
      const tag: Tag = { id: action.payload.id ?? createId(), name, slug };
      return { ...state, tags: [...state.tags, tag].sort((a, b) => a.name.localeCompare(b.name)) };
    }

    case "ADD_EVENT": {
      const event: Event = { ...action.payload, id: createId() };
      return { ...state, events: [...state.events, event] };
    }

    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload.patch } : e,
        ),
      };

    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload.id),
      };

    case "ADD_REMINDER": {
      const reminder: Reminder = {
        ...action.payload,
        id: createId(),
        createdAt: now,
      };
      return { ...state, reminders: [...state.reminders, reminder] };
    }

    case "DELETE_REMINDER":
      return {
        ...state,
        reminders: state.reminders.filter((r) => r.id !== action.payload.id),
      };

    case "ADD_NOTE": {
      const note: Note = {
        ...action.payload,
        id: createId(),
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, notes: [...state.notes, note] };
    }

    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id
            ? { ...n, ...action.payload.patch, updatedAt: now }
            : n,
        ),
      };

    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload.id),
      };

    default:
      return state;
  }
}

type ContactsStoreValue = {
  state: AppState;
  isHydrated: boolean;
  addContact: (
    data: {
      name: string;
      email?: string;
      phone?: string;
      tagIds?: string[];
      favorite?: boolean;
    },
  ) => string;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePinned: (id: string) => void;
  addTagToContact: (contactId: string, tagId: string) => void;
  removeTagFromContact: (contactId: string, tagId: string) => void;
  createTag: (name: string) => Tag | null;
  addEvent: (data: Omit<Event, "id">) => void;
  updateEvent: (id: string, patch: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addReminder: (data: Omit<Reminder, "id" | "createdAt">) => void;
  deleteReminder: (id: string) => void;
  addNote: (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  getFilteredContacts: (filters: ContactFilters) => Contact[];
  getSortedEvents: (week?: "current" | "all") => Event[];
  getContactEvents: (contactId: string) => Event[];
  getContactReminders: (contactId: string) => Reminder[];
  getContactNotes: (contactId: string) => Note[];
  tagsWithCounts: Array<Tag & { count: number }>;
  untaggedCount: number;
};

const ContactsStoreContext = createContext<ContactsStoreValue | null>(null);

export function ContactsStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, createSeedState());
  const [isHydrated, markHydrated] = useReducer(() => true, false);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadState() });
    markHydrated();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveStateDebounced(state);
  }, [state, isHydrated]);

  const updateContact = useCallback((id: string, patch: Partial<Contact>) => {
    dispatch({ type: "UPDATE_CONTACT", payload: { id, patch } });
  }, []);

  const deleteContact = useCallback((id: string) => {
    dispatch({ type: "DELETE_CONTACT", payload: { id } });
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const contact = state.contacts.find((c) => c.id === id);
      if (contact) {
        updateContact(id, { favorite: !contact.favorite });
      }
    },
    [state.contacts, updateContact],
  );

  const togglePinned = useCallback(
    (id: string) => {
      const contact = state.contacts.find((c) => c.id === id);
      if (contact) {
        updateContact(id, { pinned: !contact.pinned });
      }
    },
    [state.contacts, updateContact],
  );

  const addTagToContact = useCallback(
    (contactId: string, tagId: string) => {
      const contact = state.contacts.find((c) => c.id === contactId);
      if (contact && !contact.tagIds.includes(tagId)) {
        updateContact(contactId, { tagIds: [...contact.tagIds, tagId] });
      }
    },
    [state.contacts, updateContact],
  );

  const removeTagFromContact = useCallback(
    (contactId: string, tagId: string) => {
      const contact = state.contacts.find((c) => c.id === contactId);
      if (contact) {
        updateContact(contactId, {
          tagIds: contact.tagIds.filter((t) => t !== tagId),
        });
      }
    },
    [state.contacts, updateContact],
  );

  const addEvent = useCallback((data: Omit<Event, "id">) => {
    dispatch({ type: "ADD_EVENT", payload: data });
  }, []);

  const updateEvent = useCallback((id: string, patch: Partial<Event>) => {
    dispatch({ type: "UPDATE_EVENT", payload: { id, patch } });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    dispatch({ type: "DELETE_EVENT", payload: { id } });
  }, []);

  const addReminder = useCallback(
    (data: Omit<Reminder, "id" | "createdAt">) => {
      dispatch({ type: "ADD_REMINDER", payload: data });
    },
    [],
  );

  const deleteReminder = useCallback((id: string) => {
    dispatch({ type: "DELETE_REMINDER", payload: { id } });
  }, []);

  const addNote = useCallback(
    (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      dispatch({ type: "ADD_NOTE", payload: data });
    },
    [],
  );

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    dispatch({ type: "UPDATE_NOTE", payload: { id, patch } });
  }, []);

  const deleteNote = useCallback((id: string) => {
    dispatch({ type: "DELETE_NOTE", payload: { id } });
  }, []);

  const value = useMemo<ContactsStoreValue>(
    () => ({
      state,
      isHydrated,
      addContact: (data) => {
        const id = createId();
        dispatch({
          type: "ADD_CONTACT",
          payload: { id, ...data, name: data.name.trim() },
        });
        return id;
      },
      updateContact,
      deleteContact,
      toggleFavorite,
      togglePinned,
      addTagToContact,
      removeTagFromContact,
      createTag: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return null;
        const slug = slugify(trimmed);
        const existing = state.tags.find((t) => t.slug === slug);
        if (existing) return existing;
        const tag: Tag = { id: createId(), name: trimmed, slug };
        dispatch({ type: "ADD_TAG", payload: { id: tag.id, name: trimmed } });
        return tag;
      },
      addEvent,
      updateEvent,
      deleteEvent,
      addReminder,
      deleteReminder,
      addNote,
      updateNote,
      deleteNote,
      getContact: (id) => getContactById(state, id),
      getFilteredContacts: (filters) => getContactsFiltered(state, filters),
      getSortedEvents: (week = "all") => {
        const sorted = getAllEventsSorted(state);
        return filterEventsByWeek(sorted, week);
      },
      getContactEvents: (contactId) => getEventsForContact(state, contactId),
      getContactReminders: (contactId) =>
        getRemindersForContact(state, contactId),
      getContactNotes: (contactId) => getNotesForContact(state, contactId),
      tagsWithCounts: getTagsWithCounts(state),
      untaggedCount: getUntaggedCount(state),
    }),
    [
      state,
      isHydrated,
      updateContact,
      deleteContact,
      toggleFavorite,
      togglePinned,
      addTagToContact,
      removeTagFromContact,
      addEvent,
      updateEvent,
      deleteEvent,
      addReminder,
      deleteReminder,
      addNote,
      updateNote,
      deleteNote,
    ],
  );

  return (
    <ContactsStoreContext.Provider value={value}>
      {children}
    </ContactsStoreContext.Provider>
  );
}

export function useContactsStore(): ContactsStoreValue {
  const ctx = useContext(ContactsStoreContext);
  if (!ctx) {
    throw new Error(
      "useContactsStore deve ser usado dentro de ContactsStoreProvider",
    );
  }
  return ctx;
}

export type { ContactFilters, EventType };
