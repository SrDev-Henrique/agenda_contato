"use client";

import { useMemo, useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { ReminderCard } from "@/components/reminders/reminder-card";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";
import type { Reminder } from "@/types/reminder";

type ContactRemindersSectionProps = {
  contact: Contact;
  contacts: Contact[];
  reminders: Reminder[];
  onCreateReminder: (data: Omit<Reminder, "id" | "createdAt">) => void;
  onUpdateReminder: (id: string, patch: Partial<Reminder>) => void;
  onDeleteReminder: (id: string) => void;
};

export function ContactRemindersSection({
  contact,
  contacts,
  reminders,
  onCreateReminder,
  onUpdateReminder,
  onDeleteReminder,
}: ContactRemindersSectionProps) {
  const [adding, setAdding] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(
    null,
  );

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

  const handleUpdate = (id: string, patch: Partial<Reminder>) => {
    onUpdateReminder(id, patch);
    setEditingReminder(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingReminder) {
      return;
    }

    onDeleteReminder(deletingReminder.id);
    setDeletingReminder(null);
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
          {sortedReminders.map((reminder) =>
            editingReminder?.id === reminder.id ? (
              <ReminderComposer
                key={reminder.id}
                contacts={contacts}
                defaultContactId={contact.id}
                reminder={reminder}
                onCreateReminder={handleCreate}
                onUpdateReminder={handleUpdate}
                onCancel={() => setEditingReminder(null)}
              />
            ) : (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                contact={contact}
                appearance="profile"
                onEdit={setEditingReminder}
                onDelete={setDeletingReminder}
              />
            ),
          )}
          <ContactAddActivityButton
            label={ui.addReminder}
            onClick={() => setAdding(true)}
          />
        </div>
      )}

      <ConfirmDeleteDialog
        open={deletingReminder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingReminder(null);
          }
        }}
        title={ui.deleteReminderTitle}
        description={ui.deleteReminderDescription}
        onConfirm={handleConfirmDelete}
      />
    </ContactDetailSection>
  );
}
