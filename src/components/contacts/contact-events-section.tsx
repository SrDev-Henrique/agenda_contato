"use client";

import { useMemo, useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { EventCard } from "@/components/events/event-card";
import { EventComposer } from "@/components/events/event-composer";
import {
  EditableListItem,
  EditableListPanel,
} from "@/components/shared/editable-list-item";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type ContactEventsSectionProps = {
  contact: Contact;
  contacts: Contact[];
  events: Event[];
  onCreateEvent: (data: Omit<Event, "id">) => void;
  onUpdateEvent: (id: string, patch: Partial<Event>) => void;
  onDeleteEvent: (id: string) => void;
};

export function ContactEventsSection({
  contact,
  contacts,
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
}: ContactEventsSectionProps) {
  const [adding, setAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      ),
    [events],
  );

  const resolvedEditingEvent = useMemo(() => {
    if (!editingEvent) {
      return null;
    }

    return events.find((item) => item.id === editingEvent.id) ?? editingEvent;
  }, [editingEvent, events]);

  const panelKey = adding
    ? "composer"
    : sortedEvents.length === 0
      ? "empty"
      : "list";

  const handleCreate = (data: Omit<Event, "id">) => {
    onCreateEvent({ ...data, contactId: contact.id });
    setAdding(false);
  };

  const handleUpdate = (id: string, patch: Partial<Event>) => {
    onUpdateEvent(id, patch);
    setEditingEvent(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingEvent) {
      return;
    }

    onDeleteEvent(deletingEvent.id);
    setDeletingEvent(null);
  };

  return (
    <ContactDetailSection title={ui.upcomingEvents}>
      <EditableListPanel panelKey={panelKey}>
        {adding ? (
          <EventComposer
            contacts={contacts}
            defaultContactId={contact.id}
            onCreateEvent={handleCreate}
            onCancel={() => setAdding(false)}
          />
        ) : sortedEvents.length === 0 ? (
          <ContactAddActivityButton
            label={ui.addEvent}
            onClick={() => setAdding(true)}
          />
        ) : (
          <div className="space-y-2">
            {sortedEvents.map((event) => {
              const editing = resolvedEditingEvent?.id === event.id;
              const editingEventData = editing ? resolvedEditingEvent : event;

              return (
                <EditableListItem
                  key={event.id}
                  itemId={event.id}
                  isEditing={editing}
                  card={
                    <EventCard
                      event={event}
                      contact={contact}
                      attendees={contacts.filter((item) =>
                        event.attendeeContactIds?.includes(item.id),
                      )}
                      onEdit={setEditingEvent}
                      onDelete={setDeletingEvent}
                    />
                  }
                  composer={
                    editingEventData ? (
                      <EventComposer
                        contacts={contacts}
                        defaultContactId={contact.id}
                        event={editingEventData}
                        onCreateEvent={handleCreate}
                        onUpdateEvent={handleUpdate}
                        onCancel={() => setEditingEvent(null)}
                      />
                    ) : null
                  }
                />
              );
            })}
            <ContactAddActivityButton
              label={ui.addEvent}
              onClick={() => setAdding(true)}
            />
          </div>
        )}
      </EditableListPanel>

      <ConfirmDeleteDialog
        open={deletingEvent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingEvent(null);
          }
        }}
        title={ui.deleteEventTitle}
        description={ui.deleteEventDescription}
        onConfirm={handleConfirmDelete}
      />
    </ContactDetailSection>
  );
}
