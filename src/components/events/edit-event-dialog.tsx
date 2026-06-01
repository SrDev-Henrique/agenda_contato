"use client";

import { CalendarDays, Clock } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventTypeLabels, ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";
import type { Event, EventType } from "@/types/event";

type EditEventDialogProps = {
  event: Event | null;
  contacts: Contact[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, patch: Partial<Event>) => void;
};

const eventTypes = Object.keys(eventTypeLabels) as EventType[];

export function EditEventDialog({
  event,
  contacts,
  open,
  onOpenChange,
  onSave,
}: EditEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {event ? (
        <EditEventDialogForm
          key={event.id}
          event={event}
          contacts={contacts}
          onOpenChange={onOpenChange}
          onSave={onSave}
        />
      ) : null}
    </Dialog>
  );
}

type EditEventDialogFormProps = {
  event: Event;
  contacts: Contact[];
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, patch: Partial<Event>) => void;
};

function EditEventDialogForm({
  event,
  contacts,
  onOpenChange,
  onSave,
}: EditEventDialogFormProps) {
  const startsAt = new Date(event.startsAt);
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState(event.type);
  const [contactId, setContactId] = useState(event.contactId ?? "");
  const [date, setDate] = useState(() => getDateInputValue(startsAt));
  const [time, setTime] = useState(() => getTimeInputValue(startsAt));

  const canSubmit = Boolean(title.trim() && date && time);

  const handleSave = () => {
    if (!canSubmit) {
      return;
    }

    onSave(event.id, {
      title: title.trim(),
      type,
      contactId: contactId || undefined,
      startsAt: new Date(`${date}T${time}`).toISOString(),
    });

    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{ui.editEvent}</DialogTitle>
        <DialogDescription>{ui.description}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit-event-title">{ui.title}</Label>
          <input
            id="edit-event-title"
            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-foreground text-sm outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            value={title}
            onChange={(eventInput) => setTitle(eventInput.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-event-type">{ui.eventType}</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as EventType)}
          >
            <SelectTrigger id="edit-event-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((eventType) => (
                <SelectItem key={eventType} value={eventType}>
                  {eventTypeLabels[eventType]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-event-contact">{ui.contacts}</Label>
          <Select
            value={contactId || "none"}
            onValueChange={(value) =>
              setContactId(value === "none" ? "" : value)
            }
          >
            <SelectTrigger id="edit-event-contact">
              <SelectValue placeholder={ui.contactTagNone} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{ui.contactTagNone}</SelectItem>
              {contacts.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit-event-date">{ui.eventDate}</Label>
            <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-foreground-muted text-sm">
              <CalendarDays className="size-4" />
              <input
                id="edit-event-date"
                type="date"
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
                value={date}
                onChange={(eventInput) => setDate(eventInput.target.value)}
              />
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-event-time">{ui.eventTime}</Label>
            <label className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-foreground-muted text-sm">
              <Clock className="size-4" />
              <input
                id="edit-event-time"
                type="time"
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
                value={time}
                onChange={(eventInput) => setTime(eventInput.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
          {ui.cancel}
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={!canSubmit}
          onClick={handleSave}
        >
          {ui.save}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
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
