"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ContactAddActivityButton } from "@/components/contacts/contact-add-activity-button";
import { ContactDetailSection } from "@/components/contacts/contact-detail-section";
import { NoteCard } from "@/components/notes/note-card";
import { NoteComposer } from "@/components/notes/note-composer";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
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
  const { reduceMotion, tween } = useAppMotion();

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
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={panelKey}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
          transition={tween}
        >
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
              {notes.map((note) =>
                editingNote?.id === note.id ? (
                  <NoteComposer
                    key={note.id}
                    contactId={contact.id}
                    note={note}
                    onCreateNote={handleCreate}
                    onUpdateNote={handleUpdate}
                    onCancel={() => setEditingNote(null)}
                  />
                ) : (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={setEditingNote}
                    onDelete={setDeletingNote}
                  />
                ),
              )}
              <ContactAddActivityButton
                label={ui.addNote}
                onClick={() => setAdding(true)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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
