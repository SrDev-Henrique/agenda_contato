"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AddContactFabProps = {
  navSheetOpen: boolean;
  onAddContact: () => void;
};

export function AddContactFab({
  navSheetOpen,
  onAddContact,
}: AddContactFabProps) {
  const { fabSpring, reduceMotion, tween } = useAppMotion();

  return (
    <motion.button
      type="button"
      layout
      aria-label={navSheetOpen ? ui.addContactShort : ui.addContact}
      onClick={onAddContact}
      transition={fabSpring}
      className={cn(
        "fixed right-4 bottom-4 z-60 flex items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden",
        navSheetOpen ? "h-11 px-4 text-sm" : "size-14",
      )}
    >
      <motion.span layout transition={fabSpring}>
        <Plus className={cn("shrink-0", navSheetOpen ? "size-4" : "size-6")} />
      </motion.span>

      <AnimatePresence initial={false}>
        {navSheetOpen ? (
          <motion.span
            key="fab-label"
            initial={{ opacity: reduceMotion ? 1 : 0, width: reduceMotion ? "auto" : 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: reduceMotion ? 1 : 0, width: reduceMotion ? "auto" : 0 }}
            transition={tween}
            className="overflow-hidden whitespace-nowrap"
          >
            {ui.addContactShort}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
