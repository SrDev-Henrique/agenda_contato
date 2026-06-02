"use client";

import { Check, Plus, Users, X } from "lucide-react";
import { useMemo } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";

type EventAttendeesFieldProps = {
  contacts: Contact[];
  attendeeContactIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
};

export function EventAttendeesField({
  contacts,
  attendeeContactIds,
  onChange,
  className,
}: EventAttendeesFieldProps) {
  const attendees = useMemo(
    () =>
      attendeeContactIds
        .map((id) => contacts.find((contact) => contact.id === id))
        .filter((contact): contact is Contact => Boolean(contact)),
    [attendeeContactIds, contacts],
  );

  const handleToggleAttendee = (contactId: string) => {
    onChange(
      attendeeContactIds.includes(contactId)
        ? attendeeContactIds.filter((id) => id !== contactId)
        : [...attendeeContactIds, contactId],
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="background"
            className="h-9 w-fit justify-start sm:min-w-56"
          >
            <Users data-icon="inline-start" />
            {attendees.length > 0
              ? `${attendees.length} participantes`
              : ui.eventParticipantsPlaceholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-80 p-1 max-sm:max-h-[40vh] max-sm:overflow-y-auto"
        >
          <div className="px-2 py-2 font-medium text-foreground-muted text-xs">
            {ui.eventParticipants}
          </div>
          {contacts.map((contact) => {
            const selected = attendeeContactIds.includes(contact.id);

            return (
              <ContactOption
                key={contact.id}
                contact={contact}
                selected={selected}
                onClick={() => handleToggleAttendee(contact.id)}
              />
            );
          })}
        </PopoverContent>
      </Popover>

      {attendees.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {attendees.map((attendee) => (
            <button
              key={attendee.id}
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-muted px-2 text-foreground text-xs transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
              onClick={() => handleToggleAttendee(attendee.id)}
            >
              <Avatar className="size-5">
                {attendee.avatarUrl ? (
                  <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
                ) : null}
                <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
              </Avatar>
              {attendee.name}
              <X className="size-3" aria-label={ui.removeParticipant} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type ContactOptionProps = {
  contact: Contact;
  selected?: boolean;
  onClick: () => void;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
};

function ContactOption({
  contact,
  selected = false,
  onClick,
  onMouseDown,
}: ContactOptionProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <Avatar>
        {contact.avatarUrl ? (
          <AvatarImage src={contact.avatarUrl} alt={contact.name} />
        ) : null}
        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
      </Avatar>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground text-sm">
          {contact.name}
        </span>
        <span className="block truncate text-foreground-muted text-xs">
          {contact.email ?? ui.noEmail}
        </span>
      </span>
      {selected ? (
        <Check className="size-4 text-primary" />
      ) : (
        <Plus className="size-4 text-foreground-muted" />
      )}
    </button>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "C";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
