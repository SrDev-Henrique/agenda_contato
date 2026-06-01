"use client";

import { type KeyboardEvent, useState } from "react";

import { HintTooltip } from "@/components/ui/hint-tooltip";
import { Input } from "@/components/ui/input";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

type EditableContactNameProps = {
  name: string;
  onSave: (name: string) => void;
  className?: string;
};

export function EditableContactName({
  name,
  onSave,
  className,
}: EditableContactNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const startEditing = () => {
    setDraft(name);
    setIsEditing(true);
  };

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setIsEditing(false);
      return;
    }

    if (trimmed !== name) {
      onSave(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-10 max-w-full text-center font-inter font-semibold text-2xl sm:text-left",
          className,
        )}
        aria-label={ui.contactName}
      />
    );
  }

  return (
    <HintTooltip label={ui.clickToEdit}>
      <button
        type="button"
        onClick={startEditing}
        className={cn(
          "max-w-full truncate rounded-md px-1 py-0.5 font-inter font-semibold text-2xl text-foreground leading-tight transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          className,
        )}
      >
        {name}
      </button>
    </HintTooltip>
  );
}
