"use client";

import { useMemo, useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { ReminderCard } from "@/components/reminders/reminder-card";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import {
  EditableListItem,
  EditableListPanel,
} from "@/components/shared/editable-list-item";
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

  const panelKey = adding
    ? "composer"
    : sortedReminders.length === 0
      ? "empty"
      : "list";

  const handleCreate = (data: Omit<Reminder, "id" | "createdAt">) => {
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
      <EditableListPanel panelKey={panelKey}>
        {adding ? (
          <ReminderComposer
            contacts={contacts}
            defaultContactId={contact.id}
            onCreateReminder={handleCreate}
            onCancel={() => setAdding(false)}
          />
        ) : sortedReminders.length === 0 ? (
          <ContactAddActivityButton
            label={ui.addReminder}
            onClick={() => setAdding(true)}
          />
        ) : (
          <div className="space-y-2">
            {sortedReminders.map((reminder) => (
              <EditableListItem
                key={reminder.id}
                itemId={reminder.id}
                isEditing={editingReminder?.id === reminder.id}
                card={
                  <ReminderCard
                    reminder={reminder}
                    contact={contact}
                    onEdit={setEditingReminder}
                    onDelete={setDeletingReminder}
                  />
                }
                composer={
                  <ReminderComposer
                    contacts={contacts}
                    defaultContactId={contact.id}
                    reminder={reminder}
                    onCreateReminder={handleCreate}
                    onUpdateReminder={handleUpdate}
                    onCancel={() => setEditingReminder(null)}
                  />
                }
              />
            ))}
            <ContactAddActivityButton
              label={ui.addReminder}
              onClick={() => setAdding(true)}
            />
          </div>
        )}
      </EditableListPanel>

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
