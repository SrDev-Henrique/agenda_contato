"use client";

import { CalendarDays } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/events/event-card";
import { EventComposer } from "@/components/events/event-composer";
import { EventsComposerPanel } from "@/components/events/events-composer-panel";
import { ReminderCard } from "@/components/reminders/reminder-card";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { EditableListItem } from "@/components/shared/editable-list-item";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EventListKindFilter,
  EventListPeriod,
} from "@/hooks/use-event-list-filters";
import { useShouldAnimateOnKeyChange } from "@/hooks/use-previous";
import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import { isDateInCurrentWeek } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event, EventType } from "@/types/event";
import type { Reminder } from "@/types/reminder";

const TIMELINE_PAGE_SIZE = 10;

type TimelineActivity =
  | {
      kind: "event";
      id: string;
      date: string;
      contact?: Contact;
      attendees: Contact[];
      event: Event;
    }
  | {
      kind: "reminder";
      id: string;
      date: string;
      contact?: Contact;
      reminder: Reminder;
    };

type UpcomingActivityTimelineProps = {
  contacts: Contact[];
  events: Event[];
  reminders: Reminder[];
  className?: string;
  period: EventListPeriod;
  kindFilter: EventListKindFilter;
  onPeriodChange: (period: EventListPeriod) => void;
  onKindFilterChange: (kind: EventListKindFilter) => void;
  onCreateEvent: (data: Omit<Event, "id">) => void;
  onCreateReminder: (data: {
    text: string;
    contactId: string;
    scheduledAt: string;
    type: EventType;
  }) => void;
  onUpdateEvent: (id: string, patch: Partial<Event>) => void;
  onUpdateReminder: (id: string, patch: Partial<Reminder>) => void;
  onDeleteEvent: (id: string) => void;
  onDeleteReminder: (id: string) => void;
};

export function UpcomingActivityTimeline({
  contacts,
  events,
  reminders,
  className,
  period,
  kindFilter,
  onPeriodChange,
  onKindFilterChange,
  onCreateEvent,
  onCreateReminder,
  onUpdateEvent,
  onUpdateReminder,
  onDeleteEvent,
  onDeleteReminder,
}: UpcomingActivityTimelineProps) {
  const [pagesByFilter, setPagesByFilter] = useState<Record<string, number>>(
    {},
  );
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const resolvedEditingEvent = useMemo(() => {
    if (!editingEvent) {
      return null;
    }

    return events.find((item) => item.id === editingEvent.id) ?? editingEvent;
  }, [editingEvent, events]);

  const resolvedEditingReminder = useMemo(() => {
    if (!editingReminder) {
      return null;
    }

    return (
      reminders.find((item) => item.id === editingReminder.id) ?? editingReminder
    );
  }, [editingReminder, reminders]);

  const [deleteTarget, setDeleteTarget] = useState<TimelineActivity | null>(
    null,
  );

  const filterKey = `${period}:${kindFilter}`;
  const loadedPages = pagesByFilter[filterKey] ?? 1;
  const visibleCount = loadedPages * TIMELINE_PAGE_SIZE;
  const { staggerContainer, staggerItem } = useAppMotion();
  const shouldStaggerTimeline = useShouldAnimateOnKeyChange(filterKey);

  const activities = useMemo(() => {
    const now = new Date();
    const items: TimelineActivity[] = [
      ...events
        .filter((event) => new Date(event.startsAt) >= now)
        .map((event) => ({
          kind: "event" as const,
          id: event.id,
          date: event.startsAt,
          contact: contacts.find((contact) => contact.id === event.contactId),
          attendees: contacts.filter((contact) =>
            event.attendeeContactIds?.includes(contact.id),
          ),
          event,
        })),
      ...reminders
        .filter((reminder) => new Date(reminder.scheduledAt) >= now)
        .map((reminder) => ({
          kind: "reminder" as const,
          id: reminder.id,
          date: reminder.scheduledAt,
          contact: contacts.find(
            (contact) => contact.id === reminder.contactId,
          ),
          reminder,
        })),
    ];

    return items
      .filter((item) => {
        if (period === "week" && !isDateInCurrentWeek(item.date)) {
          return false;
        }

        if (kindFilter === "events") {
          return item.kind === "event";
        }

        if (kindFilter === "reminders") {
          return item.kind === "reminder";
        }

        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [contacts, events, reminders, period, kindFilter]);

  const visibleActivities = activities.slice(0, visibleCount);
  const remainingCount = activities.length - visibleCount;
  const nextBatchSize = Math.min(remainingCount, TIMELINE_PAGE_SIZE);

  const handleUpdateEvent = (id: string, patch: Partial<Event>) => {
    onUpdateEvent(id, patch);
    setEditingEvent(null);
  };

  const handleUpdateReminder = (id: string, patch: Partial<Reminder>) => {
    onUpdateReminder(id, patch);
    setEditingReminder(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    if (deleteTarget.kind === "event") {
      onDeleteEvent(deleteTarget.id);
    } else {
      onDeleteReminder(deleteTarget.id);
    }

    setDeleteTarget(null);
  };

  return (
    <>
      <section
        className={cn(
          "flex h-full min-h-0 flex-col overflow-y-auto border border-border bg-card p-4 text-foreground shadow-sm",
          className,
        )}
      >
        <header className="flex flex-col gap-4 border-border/80 border-b pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-foreground">{ui.upcomingActivity}</h1>
            </div>

            <Select
              value={kindFilter}
              onValueChange={(value) =>
                onKindFilterChange(value as EventListKindFilter)
              }
            >
              <SelectTrigger size="sm">
                <SelectValue aria-label={ui.filterBy} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{ui.allActivities}</SelectItem>
                <SelectItem value="events">{ui.navEvents}</SelectItem>
                <SelectItem value="reminders">{ui.reminders}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={period === "week" ? "muted" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange("week")}
            >
              <CalendarDays data-icon="inline-start" />
              {ui.thisWeek}
            </Button>
            <Button
              type="button"
              variant={period === "all" ? "muted" : "ghost"}
              size="sm"
              onClick={() => onPeriodChange("all")}
            >
              {ui.allWeeks}
            </Button>
          </div>
        </header>

        <EventsComposerPanel
          contacts={contacts}
          onCreateEvent={onCreateEvent}
          onCreateReminder={onCreateReminder}
        />

        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          {visibleActivities.length > 0 ? (
            <>
              <motion.div
                key={filterKey}
                className="space-y-3"
                variants={staggerContainer}
                initial={shouldStaggerTimeline ? "initial" : false}
                animate="animate"
              >
                {visibleActivities.map((activity) => (
                  <motion.div
                    key={`${activity.kind}-${activity.id}`}
                    variants={staggerItem}
                  >
                    {activity.kind === "event" ? (
                      <EditableListItem
                        itemId={activity.id}
                        isEditing={resolvedEditingEvent?.id === activity.id}
                        card={
                          <EventCard
                            event={activity.event}
                            contact={activity.contact}
                            attendees={activity.attendees}
                            onEdit={setEditingEvent}
                            onDelete={() => setDeleteTarget(activity)}
                          />
                        }
                        composer={
                          resolvedEditingEvent ? (
                            <EventComposer
                              contacts={contacts}
                              event={resolvedEditingEvent}
                              onCreateEvent={onCreateEvent}
                              onUpdateEvent={handleUpdateEvent}
                              allowContactChange
                              onCancel={() => setEditingEvent(null)}
                            />
                          ) : null
                        }
                      />
                    ) : (
                      <EditableListItem
                        itemId={activity.id}
                        isEditing={
                          resolvedEditingReminder?.id === activity.id
                        }
                        card={
                          <ReminderCard
                            reminder={activity.reminder}
                            contact={activity.contact}
                            onEdit={setEditingReminder}
                            onDelete={() => setDeleteTarget(activity)}
                          />
                        }
                        composer={
                          resolvedEditingReminder ? (
                            <ReminderComposer
                              contacts={contacts}
                              reminder={resolvedEditingReminder}
                              onCreateReminder={onCreateReminder}
                              onUpdateReminder={handleUpdateReminder}
                              allowContactChange
                              onCancel={() => setEditingReminder(null)}
                            />
                          ) : null
                        }
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {remainingCount > 0 ? (
                <div className="mt-6 flex justify-center border-border/60 border-t pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() =>
                      setPagesByFilter((current) => ({
                        ...current,
                        [filterKey]: loadedPages + 1,
                      }))
                    }
                  >
                    {ui.showMoreEvents(nextBatchSize)}
                  </Button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <p className="font-medium text-foreground text-sm">
                {ui.noEvents}
              </p>
              <p className="mt-1 max-w-xs text-foreground-muted text-xs leading-5">
                {ui.noEventsHint}
              </p>
            </div>
          )}
        </div>
      </section>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        title={
          deleteTarget?.kind === "reminder"
            ? ui.deleteReminderTitle
            : ui.deleteEventTitle
        }
        description={
          deleteTarget?.kind === "reminder"
            ? ui.deleteReminderDescription
            : ui.deleteEventDescription
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
