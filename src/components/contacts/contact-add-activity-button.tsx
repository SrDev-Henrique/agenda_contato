"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactAddActivityButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

export function ContactAddActivityButton({
  label,
  onClick,
  className,
}: ContactAddActivityButtonProps) {
  return (
    <Button
      type="button"
      variant="muted"
      className={cn("h-10 w-full justify-center gap-2", className)}
      onClick={onClick}
    >
      {label}
      <Plus data-icon="inline-end" />
    </Button>
  );
}
