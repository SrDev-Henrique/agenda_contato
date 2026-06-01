"use client";

import { Bell, CalendarDays, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { EventComposer } from "@/components/events/event-composer";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type EventsComposerPanelProps = {
  contacts: Contact[];
  onCreateEvent: (data: Omit<Event, "id">) => void;
  onCreateReminder: (data: {
    text: string;
    contactId: string;
    scheduledAt: string;
  }) => void;
  className?: string;
};

export function EventsComposerPanel({
  contacts,
  onCreateEvent,
  onCreateReminder,
  className,
}: EventsComposerPanelProps) {
  const {
    addingEvent,
    addingReminder,
    setAddingEvent,
    setAddingReminder,
    closeEventComposers,
  } = useContactsStore();

  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: "easeOut" as const };

  const panelKey = addingEvent
    ? "event-composer"
    : addingReminder
      ? "reminder-composer"
      : "idle-actions";

  const handleCreateEvent = (data: Omit<Event, "id">) => {
    onCreateEvent(data);
    closeEventComposers();
  };

  const handleCreateReminder = (data: {
    text: string;
    contactId: string;
    scheduledAt: string;
  }) => {
    onCreateReminder(data);
    closeEventComposers();
  };

  return (
    <div className={cn("border-border border-b py-4", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={panelKey}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          transition={transition}
        >
          {addingEvent ? (
            <EventComposer
              key="event-composer"
              contacts={contacts}
              onCreateEvent={handleCreateEvent}
              onCancel={closeEventComposers}
            />
          ) : addingReminder ? (
            <ReminderComposer
              key="reminder-composer"
              contacts={contacts}
              onCreateReminder={handleCreateReminder}
              onCancel={closeEventComposers}
            />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="muted"
                size="sm"
                onClick={() => setAddingReminder(true)}
              >
                <Bell data-icon="inline-start" />
                {ui.addReminderShort}
                <Plus data-icon="inline-end" />
              </Button>
              <Button
                type="button"
                variant="muted"
                size="sm"
                onClick={() => setAddingEvent(true)}
              >
                <CalendarDays data-icon="inline-start" />
                {ui.addEventShort}
                <Plus data-icon="inline-end" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
