"use client";

import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";

type NoteComposerProps = {
  contactId: string;
  onCreateNote: (data: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  className?: string;
};

export function NoteComposer({
  contactId,
  onCreateNote,
  className,
}: NoteComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canSubmit = title.trim() && content.trim();

  const handleCreateNote = () => {
    if (!canSubmit) {
      return;
    }

    onCreateNote({
      contactId,
      title: title.trim(),
      content: content.trim(),
    });

    setTitle("");
    setContent("");
  };

  return (
    <div
      className={cn(
        "rounded-lg bg-surface p-3 shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <input
        aria-label={ui.title}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground text-sm outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder={ui.noteTitlePlaceholder}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        aria-label={ui.notes}
        className="mt-2 min-h-28 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm leading-5 outline-none transition-colors placeholder:text-foreground-placeholder focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        placeholder={ui.noteContentPlaceholder}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            handleCreateNote();
          }
        }}
      />

      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="primary"
          disabled={!canSubmit}
          onClick={handleCreateNote}
        >
          {ui.createNote}
          <Send data-icon="inline-end" />
        </Button>
      </div>
    </div>
  );
}
