"use client";

import { Ellipsis } from "lucide-react";

import {
  formatActivityTimestamp,
  formatDateBadge,
  formatEventTimeRange,
  getEventActionLabel,
  isCalendarStyleEvent,
} from "@/lib/activity-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  contact?: Contact;
  attendees?: Contact[];
  className?: string;
  variant?: "default" | "profile";
};

export function EventCard({
  event,
  contact,
  attendees = [],
  className,
  variant = "default",
}: EventCardProps) {
  if (variant === "profile") {
    return (
      <EventCardProfile
        event={event}
        contact={contact}
        attendees={attendees}
        className={className}
      />
    );
  }

  const useBadge = isCalendarStyleEvent(event);
  const { month, day } = formatDateBadge(event.startsAt);

  return (
    <article
      className={cn(
        "rounded-lg bg-background/80 p-3 text-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {useBadge ? (
          <DateBadge month={month} day={day} />
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              {!useBadge ? (
                <p className="text-foreground-muted text-xs">
                  {getEventActionLabel(event)}
                  {contact ? (
                    <>
                      {" "}
                      <span className="font-medium text-primary">
                        {contact.name}
                      </span>
                    </>
                  ) : null}
                </p>
              ) : null}
              <p className="font-medium text-foreground">{event.title}</p>
              {event.description ? (
                <p className="line-clamp-3 text-foreground-muted text-xs leading-5">
                  {event.description}
                </p>
              ) : null}
            </div>

            <Button
              aria-label={ui.options}
              title={ui.options}
              size="icon-sm"
              variant="ghost"
            >
              <Ellipsis />
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <time className="rounded-md bg-muted px-2 py-1 text-foreground-muted text-xs">
              {formatActivityTimestamp(event.startsAt)}
            </time>
            <span className="text-foreground-muted text-xs">
              {formatEventTimeRange(event.startsAt)}
            </span>
          </div>

          {attendees.length > 0 ? (
            <AttendeeStack attendees={attendees} className="mt-3" />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function EventCardProfile({
  event,
  contact,
  attendees,
  className,
}: {
  event: Event;
  contact?: Contact;
  attendees: Contact[];
  className?: string;
}) {
  const { month, day } = formatDateBadge(event.startsAt);

  return (
    <article
      className={cn(
        "rounded-lg bg-muted/50 px-3 py-2.5 text-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <DateBadge month={month} day={day} />

        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="font-medium text-accent leading-snug">{event.title}</p>
          <p className="text-foreground-muted text-xs">
            {formatEventTimeRange(event.startsAt)}
          </p>
          {event.description && !contact ? (
            <p className="line-clamp-2 text-foreground-muted text-xs leading-5">
              {event.description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {attendees.length > 0 ? (
            <AttendeeStack attendees={attendees} maxVisible={3} />
          ) : null}
          <Button
            aria-label={ui.options}
            title={ui.options}
            size="icon-sm"
            variant="ghost"
            className="opacity-70"
          >
            <Ellipsis />
          </Button>
        </div>
      </div>
    </article>
  );
}

function DateBadge({ month, day }: { month: string; day: string }) {
  return (
    <div className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg bg-muted text-center ring-1 ring-border">
      <span className="font-semibold text-[10px] text-foreground-muted leading-none tracking-wide">
        {month}
      </span>
      <span className="font-semibold text-foreground text-sm leading-tight">
        {day}
      </span>
    </div>
  );
}

function AttendeeStack({
  attendees,
  className,
  maxVisible = 4,
}: {
  attendees: Contact[];
  className?: string;
  maxVisible?: number;
}) {
  const visible = attendees.slice(0, maxVisible);
  const extra = attendees.length - visible.length;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex -space-x-2">
        {visible.map((attendee) => (
          <Avatar
            key={attendee.id}
            className="size-6 border-2 border-surface"
          >
            {attendee.avatarUrl ? (
              <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
            ) : null}
            <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      {extra > 0 ? (
        <span className="text-foreground-muted text-xs">+{extra}</span>
      ) : null}
    </div>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "E";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
