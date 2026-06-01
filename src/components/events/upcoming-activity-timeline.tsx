"use client";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  Ellipsis,
  Gift,
  Phone,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventTypeLabels, ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";
import type { Reminder } from "@/types/reminder";

type ActivityPeriod = "week" | "all";
type ActivityKindFilter = "all" | "events" | "reminders";

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
};

export function UpcomingActivityTimeline({
  contacts,
  events,
  reminders,
  className,
}: UpcomingActivityTimelineProps) {
  const [period, setPeriod] = useState<ActivityPeriod>("all");
  const [kindFilter, setKindFilter] = useState<ActivityKindFilter>("all");

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
        if (period === "week" && !isCurrentWeek(item.date)) {
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

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-y-auto rounded-[28px] border border-border bg-surface p-4 text-foreground",
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
              setKindFilter(value as ActivityKindFilter)
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
            onClick={() => setPeriod("week")}
          >
            <CalendarDays data-icon="inline-start" />
            {ui.thisWeek}
          </Button>
          <Button
            type="button"
            variant={period === "all" ? "muted" : "ghost"}
            size="sm"
            onClick={() => setPeriod("all")}
          >
            {ui.allWeeks}
            <ChevronDown data-icon="inline-end" />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto py-4">
        {activities.length > 0 ? (
          <div className="relative pl-10">
            <div className="absolute top-2 bottom-2 left-4 w-px bg-border" />
            <div className="space-y-4">
              {activities.map((activity) => (
                <TimelineItem
                  key={`${activity.kind}-${activity.id}`}
                  activity={activity}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
            <p className="font-medium text-foreground text-sm">{ui.noEvents}</p>
            <p className="mt-1 max-w-xs text-foreground-muted text-xs leading-5">
              {ui.noEventsHint}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineItem({ activity }: { activity: TimelineActivity }) {
  const contactHref = activity.contact
    ? `/contato/${slugify(activity.contact.name)}`
    : undefined;

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

          <span className="min-w-0 flex-1">
            {activity.kind === "event"
              ? activity.event.title
              : activity.reminder.text}
          </span>

          <span className="rounded-md bg-muted px-2 py-1 text-foreground-muted text-xs">
            {formatActivityDate(activity.date)}
          </span>

          <Button
            aria-label="Opções"
            title="Opções"
            size="icon-sm"
            variant="ghost"
          >
            <Ellipsis />
          </Button>
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

function isCurrentWeek(value: string) {
  const date = new Date(value);
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return date >= start && date < end;
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
