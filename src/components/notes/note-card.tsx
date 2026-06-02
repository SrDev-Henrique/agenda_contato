"use client";

import { NotebookText } from "lucide-react";

import { ItemOptionsMenu } from "@/components/ui/item-options-menu";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";

type NoteCardProps = {
  note: Note;
  className?: string;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
};

export function NoteCard({ note, className, onEdit, onDelete }: NoteCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg bg-background p-3 text-sm shadow-sm ring-1 ring-border",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground-muted">
          <NotebookText className="size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-medium text-foreground">
                {note.title}
              </h3>
              <p className="mt-1 line-clamp-3 text-foreground-muted text-sm leading-5">
                {note.content}
              </p>
            </div>

            <ItemOptionsMenu
              label={note.title}
              onEdit={onEdit ? () => onEdit(note) : undefined}
              onDelete={onDelete ? () => onDelete(note) : undefined}
            />
          </div>

          <p className="mt-3 text-foreground-subtle text-xs">
            Atualizada em {formatNoteDate(note.updatedAt)}
          </p>
        </div>
      </div>
    </article>
  );
}

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
