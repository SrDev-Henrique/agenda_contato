"use client";

import { useState } from "react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { NoteCard } from "@/components/notes/note-card";
import { NoteComposer } from "@/components/notes/note-composer";
import {
  EditableListItem,
  EditableListPanel,
} from "@/components/shared/editable-list-item";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";
import type { Note } from "@/types/note";

type ContactNotesSectionProps = {
  contact: Contact;
  notes: Note[];
  onCreateNote: (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateNote: (id: string, patch: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
};

export function ContactNotesSection({
  contact,
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
}: ContactNotesSectionProps) {
  const [adding, setAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);

  const panelKey = adding
    ? "composer"
    : notes.length === 0
      ? "empty"
      : "list";

  const handleCreate = (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    onCreateNote({ ...data, contactId: contact.id });
    setAdding(false);
  };

  const handleUpdate = (id: string, patch: Partial<Note>) => {
    onUpdateNote(id, patch);
    setEditingNote(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingNote) {
      return;
    }

    onDeleteNote(deletingNote.id);
    setDeletingNote(null);
  };

  return (
    <ContactDetailSection title={ui.notes}>
      <EditableListPanel panelKey={panelKey}>
        {adding ? (
          <NoteComposer
            contactId={contact.id}
            onCreateNote={handleCreate}
            onCancel={() => setAdding(false)}
          />
        ) : notes.length === 0 ? (
          <ContactAddActivityButton
            label={ui.addNote}
            onClick={() => setAdding(true)}
          />
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <EditableListItem
                key={note.id}
                itemId={note.id}
                isEditing={editingNote?.id === note.id}
                card={
                  <NoteCard
                    note={note}
                    onEdit={setEditingNote}
                    onDelete={setDeletingNote}
                  />
                }
                composer={
                  <NoteComposer
                    contactId={contact.id}
                    note={note}
                    onCreateNote={handleCreate}
                    onUpdateNote={handleUpdate}
                    onCancel={() => setEditingNote(null)}
                  />
                }
              />
            ))}
            <ContactAddActivityButton
              label={ui.addNote}
              onClick={() => setAdding(true)}
            />
          </div>
        )}
      </EditableListPanel>

      <ConfirmDeleteDialog
        open={deletingNote !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingNote(null);
          }
        }}
        title={ui.deleteNoteTitle}
        description={ui.deleteNoteDescription}
        onConfirm={handleConfirmDelete}
      />
    </ContactDetailSection>
  );
}
