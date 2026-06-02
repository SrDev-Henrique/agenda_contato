"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ActivityCardShellProps = {
  children: ReactNode;
  className?: string;
};

export function ActivityCardShell({ children, className }: ActivityCardShellProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border/80 bg-background p-4 shadow-sm dark:border-white/10",
        className,
      )}
    >
      {children}
    </article>
  );
}
