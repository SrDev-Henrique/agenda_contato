"use client";

import {
  Bell,
  CalendarDays,
  Edit,
  Ellipsis,
  Gift,
  Phone,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { EditEventDialog } from "@/components/events/edit-event-dialog";
import { EventsComposerPanel } from "@/components/events/events-composer-panel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { eventTypeLabels, ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { useAppMotion } from "@/lib/motion";
import { isDateInCurrentWeek } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";
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
  }) => void;
  onUpdateEvent: (id: string, patch: Partial<Event>) => void;
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
  onDeleteEvent,
  onDeleteReminder,
}: UpcomingActivityTimelineProps) {
  const [pagesByFilter, setPagesByFilter] = useState<Record<string, number>>(
    {},
  );
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
          "flex h-full min-h-0 flex-col overflow-y-auto border border-border bg-surface p-4 text-foreground",
          className,
        )}
      >
        <header className="flex flex-col gap-4 border-border border-b pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-inter font-semibold text-foreground text-xl leading-none">
                {ui.upcomingActivity}
              </h1>
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
            <div className="relative pl-10">
              <div className="absolute top-2 bottom-2 left-4 w-px bg-border" />
              <motion.div
                key={filterKey}
                className="space-y-4"
                variants={staggerContainer}
                initial={shouldStaggerTimeline ? "initial" : false}
                animate="animate"
              >
                {visibleActivities.map((activity) => (
                  <motion.div
                    key={`${activity.kind}-${activity.id}`}
                    variants={staggerItem}
                  >
                    <TimelineItem
                      activity={activity}
                      onEditEvent={(event) => setEditingEvent(event)}
                      onDelete={(item) => setDeleteTarget(item)}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {remainingCount > 0 ? (
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
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
            </div>
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

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {deleteTarget?.kind === "reminder"
                ? ui.deleteReminderTitle
                : ui.deleteEventTitle}
            </DialogTitle>
            <DialogDescription>
              {deleteTarget?.kind === "reminder"
                ? ui.deleteReminderDescription
                : ui.deleteEventDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
            >
              {ui.cancel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {ui.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TimelineItem({
  activity,
  onEditEvent,
  onDelete,
}: {
  activity: TimelineActivity;
  onEditEvent: (event: Event) => void;
  onDelete: (activity: TimelineActivity) => void;
}) {
  const contactHref = activity.contact
    ? `/contato/${slugify(activity.contact.name)}`
    : undefined;

  const activityLabel =
    activity.kind === "event" ? activity.event.title : activity.reminder.text;

  return (
    <article className="relative">
      <div className="absolute top-0 -left-10 flex size-8 items-center justify-center rounded-full bg-surface text-foreground-muted ring-1 ring-border">
        {renderActivityIcon(activity)}
      </div>

      <div className="space-y-2">
        <div className="flex min-h-8 flex-wrap items-center gap-2 text-foreground text-sm">
          <span className="text-foreground-muted">
            {getActivityAction(activity)}
          </span>

          {activity.contact ? (
            <Link
              href={contactHref ?? "#"}
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Avatar className="size-6">
                {activity.contact.avatarUrl ? (
                  <AvatarImage
                    src={activity.contact.avatarUrl}
                    alt={activity.contact.name}
                  />
                ) : null}
                <AvatarFallback>
                  {getInitials(activity.contact.name)}
                </AvatarFallback>
              </Avatar>
              {activity.contact.name}
            </Link>
          ) : null}

          <span className="min-w-0 flex-1">{activityLabel}</span>

          <span className="rounded-md bg-muted px-2 py-1 text-foreground-muted text-xs">
            {formatActivityDate(activity.date)}
          </span>

          <ActivityActionsMenu
            activity={activity}
            activityLabel={activityLabel}
            onEditEvent={onEditEvent}
            onDelete={onDelete}
          />
        </div>

        {activity.kind === "event" ? (
          <div className="rounded-lg bg-background p-3 shadow-sm ring-1 ring-border">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground text-sm">
                  {activity.event.title}
                </p>
                {activity.event.description ? (
                  <p className="mt-1 line-clamp-2 text-foreground-muted text-xs leading-5">
                    {activity.event.description}
                  </p>
                ) : (
                  <p className="mt-1 text-foreground-muted text-xs">
                    {eventTypeLabels[activity.event.type]}
                  </p>
                )}
              </div>

              {activity.attendees.length > 0 ? (
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-foreground-muted text-xs">
                  <div className="flex -space-x-2">
                    {activity.attendees.slice(0, 3).map((attendee) => (
                      <Avatar
                        key={attendee.id}
                        className="size-5 border-2 border-muted"
                      >
                        {attendee.avatarUrl ? (
                          <AvatarImage
                            src={attendee.avatarUrl}
                            alt={attendee.name}
                          />
                        ) : null}
                        <AvatarFallback>
                          {getInitials(attendee.name)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {activity.attendees.length > 3
                    ? `+${activity.attendees.length - 3}`
                    : activity.attendees.length}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function ActivityActionsMenu({
  activity,
  activityLabel,
  onEditEvent,
  onDelete,
}: {
  activity: TimelineActivity;
  activityLabel: string;
  onEditEvent: (event: Event) => void;
  onDelete: (activity: TimelineActivity) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`${ui.options}: ${activityLabel}`}
          title={ui.options}
          size="icon-sm"
          variant="ghost"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {activity.kind === "event" ? (
          <DropdownMenuItem onSelect={() => onEditEvent(activity.event)}>
            <Edit />
            {ui.editEvent}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(activity)}
        >
          <Trash2 />
          {ui.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function renderActivityIcon(activity: TimelineActivity) {
  if (activity.kind === "reminder") {
    return activity.reminder.text.toLowerCase().includes("lig") ? (
      <Phone className="size-4" />
    ) : (
      <Bell className="size-4" />
    );
  }

  if (activity.event.type === "call") {
    return <Phone className="size-4" />;
  }

  if (activity.event.type === "birthday" || activity.event.type === "party") {
    return <Gift className="size-4" />;
  }

  if (activity.event.type === "meeting") {
    return <Video className="size-4" />;
  }

  return <Users className="size-4" />;
}

function getActivityAction(activity: TimelineActivity) {
  if (activity.kind === "reminder") {
    return activity.reminder.text.toLowerCase().includes("lig")
      ? "Ligar"
      : ui.reminder;
  }

  if (activity.event.type === "meeting") {
    return "Reunião com";
  }

  return eventTypeLabels[activity.event.type];
}

function formatActivityDate(value: string) {
  const date = new Date(value);
  const isFullDay = date.getHours() === 0 && date.getMinutes() === 0;

  if (isFullDay) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "A";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
