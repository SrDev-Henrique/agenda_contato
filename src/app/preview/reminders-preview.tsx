"use client";

import { useState } from "react";

import { ReminderCard } from "@/components/reminders/reminder-card";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { createId } from "@/lib/id";
import type { Contact } from "@/types/contact";
import type { Reminder } from "@/types/reminder";

type RemindersPreviewProps = {
  contacts: Contact[];
  reminders: Reminder[];
};

export function RemindersPreview({ contacts, reminders }: RemindersPreviewProps) {
  const [items, setItems] = useState(reminders);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <ReminderComposer
        contacts={contacts}
        onCreateReminder={(data) => {
          setItems((currentItems) => [
            {
              id: createId(),
              createdAt: new Date().toISOString(),
              ...data,
            },
            ...currentItems,
          ]);
        }}
      />

      <div className="flex flex-col gap-2">
        {items.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            contact={contacts.find((contact) => contact.id === reminder.contactId)}
          />
        ))}
      </div>
    </div>
  );
}
