"use client";

import { CalendarDays, Clock, Ellipsis, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { eventTypeLabels } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  contact?: Contact;
  attendees?: Contact[];
  className?: string;
};

export function EventCard({
  event,
  contact,
  attendees = [],
  className,
}: EventCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg bg-background p-3 text-sm shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground-muted">
          <CalendarDays className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {event.title}
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                {eventTypeLabels[event.type]}
                {contact ? (
                  <>
                    {" "}
                    com <span className="text-primary">{contact.name}</span>
                  </>
                ) : null}
              </p>
            </div>

            <Button aria-label="Opções" title="Opções" size="icon-sm" variant="ghost">
              <Ellipsis />
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2">
              <CalendarDays className="size-3.5" />
              {formatEventDate(event.startsAt)}
            </span>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2">
              <Clock className="size-3.5" />
              {formatEventTime(event.startsAt)}
            </span>
            {attendees.length > 0 ? (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-muted px-2">
                <Users className="size-3.5" />
                {attendees.length}
              </span>
            ) : null}
          </div>

          {attendees.length > 0 ? (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {attendees.slice(0, 4).map((attendee) => (
                  <Avatar
                    key={attendee.id}
                    className="size-7 border-2 border-background"
                  >
                    {attendee.avatarUrl ? (
                      <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
                    ) : null}
                    <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="min-w-0 truncate text-xs text-foreground-muted">
                {attendees.map((attendee) => attendee.name).join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
