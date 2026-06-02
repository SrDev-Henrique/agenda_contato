"use client";

import { CalendarDays, Clock, Send } from "lucide-react";
import { useMemo, useState } from "react";

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
import type { Reminder } from "@/types/reminder";

type ReminderComposerProps = {
  contacts: Contact[];
  onCreateReminder: (data: {
    text: string;
    contactId: string;
    scheduledAt: string;
  }) => void;
  reminder?: Reminder;
  onUpdateReminder?: (id: string, patch: Partial<Reminder>) => void;
  onCancel?: () => void;
  className?: string;
  defaultContactId?: string;
};

export function ReminderComposer({
  contacts,
  onCreateReminder,
  reminder,
  onUpdateReminder,
  onCancel,
  className,
  defaultContactId = "",
}: ReminderComposerProps) {
  const isEditing = Boolean(reminder && onUpdateReminder);
  const scheduledAt = reminder ? new Date(reminder.scheduledAt) : new Date();
  const [text, setText] = useState(reminder?.text ?? "");
  const [selectedContactId, setSelectedContactId] = useState(
    reminder?.contactId ?? defaultContactId,
  );
  const [date, setDate] = useState(() => getDateInputValue(scheduledAt));
  const [time, setTime] = useState(() => getTimeInputValue(scheduledAt));

  const mentionQuery = getMentionQuery(text);
  const mentionOpen = mentionQuery !== null;

  const filteredContacts = useMemo(() => {
    if (mentionQuery === null) {
      return [];
    }

    const normalizedQuery = normalize(mentionQuery);

    return contacts
      .filter((contact) => normalize(contact.name).includes(normalizedQuery))
      .slice(0, 5);
  }, [contacts, mentionQuery]);

  const canSubmit = text.trim() && selectedContactId && date && time;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const payload = {
      text: text.trim(),
      contactId: selectedContactId,
      scheduledAt: new Date(`${date}T${time}`).toISOString(),
    };

    if (isEditing && reminder && onUpdateReminder) {
      onUpdateReminder(reminder.id, payload);
      return;
    }

    onCreateReminder(payload);

    setText("");
    setSelectedContactId(defaultContactId);
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setText(replaceMentionQuery(text, contact.name));
  };

  return (
    <div
      className={cn(
        "rounded-lg bg-surface p-3 shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <Popover open={mentionOpen && filteredContacts.length > 0}>
        <PopoverAnchor asChild>
          <textarea
            aria-label={ui.addReminder}
            className="min-h-24 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder={ui.reminderPlaceholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
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
          className="w-72 p-1 max-sm:h-140 max-sm:overflow-y-auto"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelectContact(contact)}
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
            ))
          ) : (
            <div className="px-3 py-6 text-center text-foreground-muted text-sm">
              {ui.noMentionResults}
            </div>
          )}
        </PopoverContent>
      </Popover>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex h-9 w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 text-foreground-muted text-sm">
          <CalendarDays className="size-4" />
          <span className="sr-only">{ui.reminderDate}</span>
          <input
            type="date"
            className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label className="flex h-9 w-fit items-center gap-2 rounded-lg border border-border bg-background px-3 text-foreground-muted text-sm">
          <Clock className="size-4" />
          <span className="sr-only">{ui.reminderTime}</span>
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
            {isEditing ? ui.save : ui.createReminder}
            <Send data-icon="inline-end" />
          </Button>

          {onCancel ? (
            <Button type="button" variant="destructive" onClick={onCancel}>
              {ui.cancel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
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

  if (words.length === 0) {
    return "C";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
