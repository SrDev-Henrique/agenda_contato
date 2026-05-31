"use client";

import { useState } from "react";

import { EventCard } from "@/components/events/event-card";
import { EventComposer } from "@/components/events/event-composer";
import { createId } from "@/lib/id";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type EventsPreviewProps = {
  contacts: Contact[];
  events: Event[];
};

export function EventsPreview({ contacts, events }: EventsPreviewProps) {
  const [items, setItems] = useState(events);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <EventComposer
        contacts={contacts}
        onCreateEvent={(data) => {
          setItems((currentItems) => [
            {
              id: createId(),
              ...data,
            },
            ...currentItems,
          ]);
        }}
      />

      <div className="grid gap-2 lg:grid-cols-2">
        {items.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            contact={contacts.find((contact) => contact.id === event.contactId)}
            attendees={contacts.filter((contact) =>
              event.attendeeContactIds?.includes(contact.id),
            )}
          />
        ))}
      </div>
    </div>
  );
}
