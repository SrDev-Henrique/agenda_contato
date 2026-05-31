"use client";

import { useState } from "react";

import { NoteCard } from "@/components/notes/note-card";
import { NoteComposer } from "@/components/notes/note-composer";
import { createId } from "@/lib/id";
import type { Note } from "@/types/note";

type NotesPreviewProps = {
  contactId: string;
  notes: Note[];
};

export function NotesPreview({ contactId, notes }: NotesPreviewProps) {
  const [items, setItems] = useState(notes);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <NoteComposer
        contactId={contactId}
        onCreateNote={(data) => {
          const now = new Date().toISOString();

          setItems((currentItems) => [
            {
              id: createId(),
              createdAt: now,
              updatedAt: now,
              ...data,
            },
            ...currentItems,
          ]);
        }}
      />

      <div className="grid gap-2 lg:grid-cols-2">
        {items.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
