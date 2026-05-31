"use client";

import { Bell, Ellipsis, Phone } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Reminder } from "@/types/reminder";

type ReminderCardProps = {
  reminder: Reminder;
  contact?: Contact;
  className?: string;
};

export function ReminderCard({ reminder, contact, className }: ReminderCardProps) {
  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-lg bg-background px-3 py-3 text-sm shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground-muted">
        {looksLikeCall(reminder.text) ? (
          <Phone className="size-4" />
        ) : (
          <Bell className="size-4" />
        )}
      </div>

      <Avatar>
        {contact?.avatarUrl ? (
          <AvatarImage src={contact.avatarUrl} alt={contact.name} />
        ) : null}
        <AvatarFallback>{getInitials(contact?.name ?? ui.reminders)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground">
          {contact ? (
            <span className="font-medium text-primary">{contact.name}</span>
          ) : null}{" "}
          {reminder.text}
        </p>
        <p className="mt-1 text-xs text-foreground-muted">
          {formatReminderDate(reminder.scheduledAt)}
        </p>
      </div>

      <div className="hidden shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-foreground-muted sm:block">
        {formatReminderTime(reminder.scheduledAt)}
      </div>

      <Button aria-label="Opções" title="Opções" size="icon-sm" variant="ghost">
        <Ellipsis />
      </Button>
    </article>
  );
}

function looksLikeCall(text: string) {
  return text.toLowerCase().includes("lig");
}

function formatReminderDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(new Date(value));
}

function formatReminderTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "L";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
