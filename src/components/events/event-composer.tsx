"use client";

import { CalendarDays, Clock, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { ActivityContactSelect } from "@/components/activity/activity-contact-select";
import { EventAttendeesField } from "@/components/events/event-attendees-field";
import { EventTypeSelect } from "@/components/events/event-type-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event, EventType } from "@/types/event";

type EventComposerProps = {
  contacts: Contact[];
  onCreateEvent: (data: Omit<Event, "id">) => void;
  event?: Event;
  onUpdateEvent?: (id: string, patch: Partial<Event>) => void;
  onCancel?: () => void;
  className?: string;
  defaultContactId?: string;
  allowContactChange?: boolean;
};

export function EventComposer({
  contacts,
  onCreateEvent,
  event,
  onUpdateEvent,
  onCancel,
  className,
  defaultContactId = "",
  allowContactChange = false,
}: EventComposerProps) {
  if (event && onUpdateEvent) {
    return (
      <EventComposerForm
        key={`${event.id}:${event.startsAt}:${event.type}:${event.description ?? ""}`}
        contacts={contacts}
        defaultContactId={defaultContactId}
        allowContactChange={allowContactChange}
        className={className}
        onCancel={onCancel}
        initialEvent={event}
        onSubmit={(payload) => onUpdateEvent(event.id, payload)}
      />
    );
  }

  return (
    <EventComposerForm
      key="create"
      contacts={contacts}
      defaultContactId={defaultContactId}
      allowContactChange={allowContactChange}
      className={className}
      onCancel={onCancel}
      onSubmit={(payload) => onCreateEvent(payload)}
    />
  );
}

type EventComposerFormProps = {
  contacts: Contact[];
  defaultContactId: string;
  allowContactChange: boolean;
  className?: string;
  onCancel?: () => void;
  initialEvent?: Event;
  onSubmit: (data: Omit<Event, "id">) => void;
};

function EventComposerForm({
  contacts,
  defaultContactId,
  allowContactChange,
  className,
  onCancel,
  initialEvent,
  onSubmit,
}: EventComposerFormProps) {
  const isEditing = Boolean(initialEvent);
  const startsAt = initialEvent ? new Date(initialEvent.startsAt) : new Date();

  const [title, setTitle] = useState(initialEvent?.title ?? "");
  const [selectedContactId, setSelectedContactId] = useState(
    initialEvent?.contactId ?? defaultContactId,
  );
  const [attendeeContactIds, setAttendeeContactIds] = useState<string[]>(
    initialEvent?.attendeeContactIds ??
      (defaultContactId ? [defaultContactId] : []),
  );
  const [type, setType] = useState<EventType>(initialEvent?.type ?? "meeting");
  const [description, setDescription] = useState(
    initialEvent?.description ?? "",
  );
  const [date, setDate] = useState(() => getDateInputValue(startsAt));
  const [time, setTime] = useState(() => getTimeInputValue(startsAt));

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

  const canSubmit = title.trim() && date && time;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      contactId: selectedContactId || undefined,
      startsAt: new Date(`${date}T${time}`).toISOString(),
      type,
      attendeeContactIds:
        attendeeContactIds.length > 0 ? attendeeContactIds : undefined,
    });

    if (!isEditing) {
      setTitle("");
      setDescription("");
      setType("meeting");
      setSelectedContactId(defaultContactId);
      setAttendeeContactIds(defaultContactId ? [defaultContactId] : []);
    }
  };

  const handleSelectMentionContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setTitle(replaceMentionQuery(title, contact.name));
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
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-[16px] text-foreground outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            placeholder={ui.eventTitlePlaceholder}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="h-fit w-72 p-1 max-sm:max-h-[40vh] max-sm:overflow-y-auto"
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

      <textarea
        aria-label={ui.description}
        className="mt-3 min-h-24 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-[16px] text-foreground outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        placeholder={ui.eventDescriptionPlaceholder}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      {allowContactChange ? (
        <div className="mt-3">
          <ActivityContactSelect
            id="event-composer-contact"
            contacts={contacts}
            value={selectedContactId}
            onValueChange={setSelectedContactId}
          />
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <EventTypeSelect value={type} onValueChange={setType} />

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
            onClick={handleSubmit}
          >
            {isEditing ? ui.save : ui.createEvent}
            <Send data-icon="inline-end" />
          </Button>

          {onCancel ? (
            <Button type="button" variant="destructive" onClick={onCancel}>
              {ui.cancel}
            </Button>
          ) : null}
        </div>
      </div>

      <EventAttendeesField
        contacts={contacts}
        attendeeContactIds={attendeeContactIds}
        onChange={setAttendeeContactIds}
        className="mt-3"
      />
    </div>
  );
}

type ContactOptionProps = {
  contact: Contact;
  onClick: () => void;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
};

function ContactOption({ contact, onClick, onMouseDown }: ContactOptionProps) {
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTimeInputValue(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
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
  if (words.length === 0) return "C";
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
