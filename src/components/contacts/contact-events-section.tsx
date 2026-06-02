"use client";

import { useMemo, useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { EventCard } from "@/components/events/event-card";
import { EventComposer } from "@/components/events/event-composer";
import { ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type ContactEventsSectionProps = {
  contact: Contact;
  contacts: Contact[];
  events: Event[];
  onCreateEvent: (data: Omit<Event, "id">) => void;
};

export function ContactEventsSection({
  contact,
  contacts,
  events,
  onCreateEvent,
}: ContactEventsSectionProps) {
  const [adding, setAdding] = useState(false);

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
            />
          ))}
          <ContactAddActivityButton
            label={ui.addEvent}
            onClick={() => setAdding(true)}
          />
        </div>
      )}
    </ContactDetailSection>
  );
}
