"use client";

import { useMemo, useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { EditEventDialog } from "@/components/events/edit-event-dialog";
import { EventCard } from "@/components/events/event-card";
import { EventComposer } from "@/components/events/event-composer";
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

  const handleCreate = (data: Omit<Event, "id">) => {
    onCreateEvent({ ...data, contactId: contact.id });
    setAdding(false);
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
      {adding ? (
        <EventComposer
          contacts={contacts}
          defaultContactId={contact.id}
          onCreateEvent={handleCreate}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <div className="space-y-2">
          {sortedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              contact={contact}
              variant="profile"
              attendees={contacts.filter((item) =>
                event.attendeeContactIds?.includes(item.id),
              )}
              onEdit={setEditingEvent}
              onDelete={setDeletingEvent}
            />
          ))}
          <ContactAddActivityButton
            label={ui.addEvent}
            onClick={() => setAdding(true)}
          />
        </div>
      )}

      <EditEventDialog
        event={editingEvent}
        contacts={contacts}
        open={editingEvent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEvent(null);
          }
        }}
        onSave={onUpdateEvent}
      />

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
