"use client";

import { Edit, Ellipsis, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

type ItemOptionsMenuProps = {
  label: string;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  className?: string;
  triggerClassName?: string;
};

export function ItemOptionsMenu({
  label,
  onEdit,
  onDelete,
  editLabel = ui.edit,
  className,
  triggerClassName,
}: ItemOptionsMenuProps) {
  if (!onEdit && !onDelete) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`${ui.options}: ${label}`}
          title={ui.options}
          size="icon-sm"
          variant="ghost"
          className={cn("opacity-70 group-hover:opacity-100", triggerClassName)}
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn("w-44", className)}>
        {onEdit ? (
          <DropdownMenuItem onSelect={onEdit}>
            <Edit />
            {editLabel}
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <>
            {onEdit ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2 />
              {ui.delete}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
