"use client";

import { useCallback, useMemo } from "react";

import { createId, slugify } from "@/lib/id";
import {
  filterEventsByWeek,
  getAllEventsSorted,
  getContactById,
  getContactsFiltered,
  getEventsForContact,
  getNotesForContact,
  getRemindersForContact,
} from "@/lib/selectors";
import {
  addContact as addContactAction,
  addEvent,
  addNote,
  addReminder,
  addTag,
  closeEventComposers,
  deleteContact,
  deleteEvent,
  deleteNote,
  deleteReminder,
  setAddingEvent,
  setAddingReminder,
  updateContact as updateContactAction,
  updateEvent,
  updateNote,
} from "@/store/agenda-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectAddingEvent,
  selectAddingReminder,
  selectAgenda,
  selectIsHydrated,
  selectTagsWithCounts,
  selectUntaggedCount,
} from "@/store/store-selectors";
import type { AppState, ContactFilters } from "@/types/app-state";
import type { Contact } from "@/types/contact";
import type { Event, EventType } from "@/types/event";
import type { Note } from "@/types/note";
import type { Reminder } from "@/types/reminder";
import type { Tag } from "@/types/tag";

type ContactsStoreValue = {
  state: AppState;
  isHydrated: boolean;
  addContact: (data: {
    name: string;
    email?: string;
    phone?: string;
    tagIds?: string[];
    favorite?: boolean;
  }) => string;
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
  addingEvent: boolean;
  addingReminder: boolean;
  setAddingEvent: (open: boolean) => void;
  setAddingReminder: (open: boolean) => void;
  closeEventComposers: () => void;
};

export function useContactsStore(): ContactsStoreValue {
  const dispatch = useAppDispatch();
  const agenda = useAppSelector(selectAgenda);
  const isHydrated = useAppSelector(selectIsHydrated);
  const tagsWithCounts = useAppSelector(selectTagsWithCounts);
  const untaggedCount = useAppSelector(selectUntaggedCount);
  const addingEvent = useAppSelector(selectAddingEvent);
  const addingReminder = useAppSelector(selectAddingReminder);

  const updateContact = useCallback(
    (id: string, patch: Partial<Contact>) => {
      dispatch(updateContactAction({ id, patch }));
    },
    [dispatch],
  );

  const deleteContactById = useCallback(
    (id: string) => {
      dispatch(deleteContact({ id }));
    },
    [dispatch],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const contact = agenda.contacts.find((c) => c.id === id);
      if (contact) {
        dispatch(
          updateContactAction({ id, patch: { favorite: !contact.favorite } }),
        );
      }
    },
    [agenda.contacts, dispatch],
  );

  const togglePinned = useCallback(
    (id: string) => {
      const contact = agenda.contacts.find((c) => c.id === id);
      if (contact) {
        dispatch(
          updateContactAction({ id, patch: { pinned: !contact.pinned } }),
        );
      }
    },
    [agenda.contacts, dispatch],
  );

  const addTagToContact = useCallback(
    (contactId: string, tagId: string) => {
      const contact = agenda.contacts.find((c) => c.id === contactId);
      if (contact && !contact.tagIds.includes(tagId)) {
        dispatch(
          updateContactAction({
            id: contactId,
            patch: { tagIds: [...contact.tagIds, tagId] },
          }),
        );
      }
    },
    [agenda.contacts, dispatch],
  );

  const removeTagFromContact = useCallback(
    (contactId: string, tagId: string) => {
      const contact = agenda.contacts.find((c) => c.id === contactId);
      if (contact) {
        dispatch(
          updateContactAction({
            id: contactId,
            patch: { tagIds: contact.tagIds.filter((t) => t !== tagId) },
          }),
        );
      }
    },
    [agenda.contacts, dispatch],
  );

  const addEventHandler = useCallback(
    (data: Omit<Event, "id">) => {
      dispatch(addEvent(data));
    },
    [dispatch],
  );

  const updateEventHandler = useCallback(
    (id: string, patch: Partial<Event>) => {
      dispatch(updateEvent({ id, patch }));
    },
    [dispatch],
  );

  const deleteEventHandler = useCallback(
    (id: string) => {
      dispatch(deleteEvent({ id }));
    },
    [dispatch],
  );

  const addReminderHandler = useCallback(
    (data: Omit<Reminder, "id" | "createdAt">) => {
      dispatch(addReminder(data));
    },
    [dispatch],
  );

  const deleteReminderHandler = useCallback(
    (id: string) => {
      dispatch(deleteReminder({ id }));
    },
    [dispatch],
  );

  const addNoteHandler = useCallback(
    (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      dispatch(addNote(data));
    },
    [dispatch],
  );

  const updateNoteHandler = useCallback(
    (id: string, patch: Partial<Note>) => {
      dispatch(updateNote({ id, patch }));
    },
    [dispatch],
  );

  const deleteNoteHandler = useCallback(
    (id: string) => {
      dispatch(deleteNote({ id }));
    },
    [dispatch],
  );

  const setAddingEventHandler = useCallback(
    (open: boolean) => {
      dispatch(setAddingEvent(open));
    },
    [dispatch],
  );

  const setAddingReminderHandler = useCallback(
    (open: boolean) => {
      dispatch(setAddingReminder(open));
    },
    [dispatch],
  );

  const closeEventComposersHandler = useCallback(() => {
    dispatch(closeEventComposers());
  }, [dispatch]);

  return useMemo<ContactsStoreValue>(
    () => ({
      state: agenda,
      isHydrated,
      addContact: (data) => {
        const id = createId();
        dispatch(
          addContactAction({
            id,
            ...data,
            name: data.name.trim(),
          }),
        );
        return id;
      },
      updateContact,
      deleteContact: deleteContactById,
      toggleFavorite,
      togglePinned,
      addTagToContact,
      removeTagFromContact,
      createTag: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return null;
        const slug = slugify(trimmed);
        const existing = agenda.tags.find((t) => t.slug === slug);
        if (existing) return existing;
        const tag: Tag = { id: createId(), name: trimmed, slug };
        dispatch(addTag({ id: tag.id, name: trimmed }));
        return tag;
      },
      addEvent: addEventHandler,
      updateEvent: updateEventHandler,
      deleteEvent: deleteEventHandler,
      addReminder: addReminderHandler,
      deleteReminder: deleteReminderHandler,
      addNote: addNoteHandler,
      updateNote: updateNoteHandler,
      deleteNote: deleteNoteHandler,
      getContact: (id) => getContactById(agenda, id),
      getFilteredContacts: (filters) => getContactsFiltered(agenda, filters),
      getSortedEvents: (week = "all") => {
        const sorted = getAllEventsSorted(agenda);
        return filterEventsByWeek(sorted, week);
      },
      getContactEvents: (contactId) => getEventsForContact(agenda, contactId),
      getContactReminders: (contactId) =>
        getRemindersForContact(agenda, contactId),
      getContactNotes: (contactId) => getNotesForContact(agenda, contactId),
      tagsWithCounts,
      untaggedCount,
      addingEvent,
      addingReminder,
      setAddingEvent: setAddingEventHandler,
      setAddingReminder: setAddingReminderHandler,
      closeEventComposers: closeEventComposersHandler,
    }),
    [
      agenda,
      isHydrated,
      dispatch,
      updateContact,
      deleteContactById,
      toggleFavorite,
      togglePinned,
      addTagToContact,
      removeTagFromContact,
      addEventHandler,
      updateEventHandler,
      deleteEventHandler,
      addReminderHandler,
      deleteReminderHandler,
      addNoteHandler,
      updateNoteHandler,
      deleteNoteHandler,
      tagsWithCounts,
      untaggedCount,
      addingEvent,
      addingReminder,
      setAddingEventHandler,
      setAddingReminderHandler,
      closeEventComposersHandler,
    ],
  );
}

export type { ContactFilters, EventType };
