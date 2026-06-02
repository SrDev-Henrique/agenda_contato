"use client";

import { CalendarDays, Check, Clock, Plus, Send, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type EventComposerProps = {
  contacts: Contact[];
  onCreateEvent: (data: Omit<Event, "id">) => void;
  onCancel?: () => void;
  className?: string;
  defaultContactId?: string;
};

export function EventComposer({
  contacts,
  onCreateEvent,
  onCancel,
  className,
  defaultContactId = "",
}: EventComposerProps) {
  const [title, setTitle] = useState("");
  const [selectedContactId, setSelectedContactId] = useState(defaultContactId);
  const [attendeeContactIds, setAttendeeContactIds] = useState<string[]>(() =>
    defaultContactId ? [defaultContactId] : [],
  );
  const [date, setDate] = useState(() => getDateInputValue(new Date()));
  const [time, setTime] = useState("10:00");

  const mentionQuery = getMentionQuery(title);
  const mentionOpen = mentionQuery !== null;

  const filteredMentionContacts = useMemo(() => {
    if (mentionQuery === null) {
      return [];
    }

    const normalizedQuery = normalize(mentionQuery);

    return contacts
      .filter((contact) => normalize(contact.name).includes(normalizedQuery))
      .slice(0, 5);
  }, [contacts, mentionQuery]);

  const attendees = useMemo(
    () =>
      attendeeContactIds
        .map((id) => contacts.find((contact) => contact.id === id))
        .filter((contact): contact is Contact => Boolean(contact)),
    [attendeeContactIds, contacts],
  );

  const canSubmit = title.trim() && date && time;

  const handleCreateEvent = () => {
    if (!canSubmit) {
      return;
    }

    onCreateEvent({
      title: title.trim(),
      contactId: selectedContactId || undefined,
      startsAt: new Date(`${date}T${time}`).toISOString(),
      type: "meeting",
      attendeeContactIds:
        attendeeContactIds.length > 0 ? attendeeContactIds : undefined,
    });

    setTitle("");
    setSelectedContactId(defaultContactId);
    setAttendeeContactIds(defaultContactId ? [defaultContactId] : []);
  };

  const handleSelectMentionContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setTitle(replaceMentionQuery(title, contact.name));
  };

  const handleToggleAttendee = (contactId: string) => {
    setAttendeeContactIds((currentIds) =>
      currentIds.includes(contactId)
        ? currentIds.filter((id) => id !== contactId)
        : [...currentIds, contactId],
    );
  };

  return (
    <div
      className={cn(
        "rounded-lg bg-surface p-3 shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <Popover open={mentionOpen && filteredMentionContacts.length > 0}>
        <PopoverAnchor asChild>
          <input
            aria-label={ui.title}
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground text-sm outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder={ui.eventTitlePlaceholder}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                handleCreateEvent();
              }
            }}
          />
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-72 p-1"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          {filteredMentionContacts.map((contact) => (
            <ContactOption
              key={contact.id}
              contact={contact}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelectMentionContact(contact)}
            />
          ))}
        </PopoverContent>
      </Popover>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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
          <PopoverContent align="start" className="w-80 p-1">
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

        <label className="flex h-9 w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 text-foreground-muted text-sm">
          <CalendarDays className="size-4" />
          <span className="sr-only">{ui.eventDate}</span>
          <input
            type="date"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label className="flex h-9 w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 text-foreground-muted text-sm">
          <Clock className="size-4" />
          <span className="sr-only">{ui.eventTime}</span>
          <input
            type="time"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </label>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            disabled={!canSubmit}
            onClick={handleCreateEvent}
          >
            {ui.createEvent}
            <Send data-icon="inline-end" />
          </Button>

          {onCancel ? (
            <Button type="button" variant="destructive" onClick={onCancel}>
              {ui.cancel}
            </Button>
          ) : null}
        </div>
      </div>

      {attendees.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {attendees.map((attendee) => (
            <button
              key={attendee.id}
              type="button"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-muted px-2 text-foreground text-xs transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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

function getMentionQuery(value: string) {
  const match = value.match(/@([\p{L}\p{N}\s._-]*)$/u);
  return match ? match[1] : null;
}

function replaceMentionQuery(value: string, name: string) {
  return value.replace(/@([\p{L}\p{N}\s._-]*)$/u, `@${name} `);
}

function getDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
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
