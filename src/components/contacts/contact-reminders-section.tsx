"use client";

import { useMemo, useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { ReminderCard } from "@/components/reminders/reminder-card";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";
import type { Reminder } from "@/types/reminder";

type ContactRemindersSectionProps = {
  contact: Contact;
  contacts: Contact[];
  reminders: Reminder[];
  onCreateReminder: (data: Omit<Reminder, "id" | "createdAt">) => void;
};

export function ContactRemindersSection({
  contact,
  contacts,
  reminders,
  onCreateReminder,
}: ContactRemindersSectionProps) {
  const [adding, setAdding] = useState(false);

  const sortedReminders = useMemo(
    () =>
      [...reminders].sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      ),
    [reminders],
  );

  const handleCreate = (data: {
    text: string;
    contactId: string;
    scheduledAt: string;
  }) => {
    onCreateReminder({ ...data, contactId: contact.id });
    setAdding(false);
  };

  return (
    <ContactDetailSection title={ui.reminders}>
      {adding ? (
        <ReminderComposer
          contacts={contacts}
          defaultContactId={contact.id}
          onCreateReminder={handleCreate}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <div className="space-y-2">
          {sortedReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              contact={contact}
              appearance="profile"
            />
          ))}
          <ContactAddActivityButton
            label={ui.addReminder}
            onClick={() => setAdding(true)}
          />
        </div>
      )}
    </ContactDetailSection>
  );
}
