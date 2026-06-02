"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type EditableListItemProps = {
  itemId: string;
  isEditing: boolean;
  card: ReactNode;
  composer: ReactNode;
  className?: string;
};

export function EditableListItem({
  itemId,
  isEditing,
  card,
  composer,
  className,
}: EditableListItemProps) {
  const { reduceMotion, tween } = useAppMotion();

  return (
    <div className={cn(className)}>
      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key={`${itemId}-composer`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={tween}
          >
            {composer}
          </motion.div>
        ) : (
          <motion.div
            key={`${itemId}-card`}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={tween}
          >
            {card}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type EditableListPanelProps = {
  panelKey: string;
  children: ReactNode;
  className?: string;
};

export function EditableListPanel({
  panelKey,
  children,
  className,
}: EditableListPanelProps) {
  const { reduceMotion, tween } = useAppMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={panelKey}
        className={className}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
        transition={tween}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
