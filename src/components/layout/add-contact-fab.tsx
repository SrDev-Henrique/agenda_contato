"use client";

import { Plus } from "lucide-react";

import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

type AddContactFabProps = {
  navSheetOpen: boolean;
  onAddContact: () => void;
};

export function AddContactFab({
  navSheetOpen,
  onAddContact,
}: AddContactFabProps) {
  return (
    <button
      type="button"
      aria-label={ui.addContactShort}
      onClick={onAddContact}
      className={cn(
        "fixed right-4 bottom-4 z-60 flex items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden",
        navSheetOpen ? "h-11 px-4 text-sm" : "size-14",
      )}
    >
      <Plus className={cn("shrink-0", navSheetOpen ? "size-4" : "size-6")} />
    </button>
  );
}
