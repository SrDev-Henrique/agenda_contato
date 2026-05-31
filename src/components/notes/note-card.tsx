"use client";

import { Ellipsis, NotebookText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Note } from "@/types/note";

type NoteCardProps = {
  note: Note;
  className?: string;
};

export function NoteCard({ note, className }: NoteCardProps) {
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
              <p className="mt-1 line-clamp-3 text-sm leading-5 text-foreground-muted">
                {note.content}
              </p>
            </div>

            <Button aria-label="Opções" title="Opções" size="icon-sm" variant="ghost">
              <Ellipsis />
            </Button>
          </div>

          <p className="mt-3 text-xs text-foreground-subtle">
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
