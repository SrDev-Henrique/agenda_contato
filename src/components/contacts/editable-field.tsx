"use client";

import { type KeyboardEvent, useCallback, useState } from "react";

import { HintTooltip } from "@/components/ui/hint-tooltip";
import { Input } from "@/components/ui/input";
import { ui } from "@/lib/i18n/pt-br";
import { formatBrazilPhone } from "@/lib/phone-mask";
import { cn } from "@/lib/utils";

type EditableFieldProps = {
  value: string;
  emptyLabel: string;
  onSave: (value: string) => void;
  className?: string;
  inputClassName?: string;
  type?: "text" | "email" | "tel" | "date";
  formatValue?: (value: string) => string;
  displayFormatter?: (value: string) => string;
  validate?: (value: string) => string | null;
};

export function EditableField({
  value,
  emptyLabel,
  onSave,
  className,
  inputClassName,
  type = "text",
  formatValue,
  displayFormatter,
  validate,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const startEditing = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const isEmpty = !value.trim();
  const displayValue = isEmpty
    ? emptyLabel
    : displayFormatter
      ? displayFormatter(value)
      : value;

  const commit = useCallback(() => {
    const next = formatValue ? formatValue(draft) : draft.trim();
    const error = validate?.(next);

    if (error) {
      setIsEditing(false);
      return;
    }

    onSave(next);
    setIsEditing(false);
  }, [draft, formatValue, onSave, validate]);

  const cancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        type={type}
        inputMode={type === "tel" ? "numeric" : undefined}
        value={draft}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(formatValue ? formatValue(next) : next);
        }}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn("h-8 text-[16px]", inputClassName)}
        aria-label={emptyLabel}
      />
    );
  }

  return (
    <HintTooltip label={ui.clickToEdit}>
      <button
        type="button"
        onClick={startEditing}
        className={cn(
          "block h-8 w-full truncate rounded-md px-1 py-0.5 text-left font-medium text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          isEmpty ? "text-foreground-muted" : "text-foreground",
          className,
        )}
      >
        {displayValue}
      </button>
    </HintTooltip>
  );
}

export function validateOptionalEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return isValid ? null : ui.invalidEmail;
}

export function phoneFieldFormat(value: string): string {
  return formatBrazilPhone(value);
}
