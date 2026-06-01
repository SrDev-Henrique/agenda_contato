"use client";

import {
  Edit,
  Ellipsis,
  Pin,
  PinOff,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { slugify } from "@/lib/id";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Tag } from "@/types/tag";

type ContactRowProps = {
  contact: Contact;
  tag?: Tag;
  href?: string;
  active?: boolean;
  className?: string;
  variant?: "list" | "grid";
  onEdit?: (contact: Contact) => void;
  onToggleFavorite?: (contact: Contact) => void;
  onTogglePin?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
};

export function ContactRow({
  contact,
  tag,
  href = `/contato/${slugify(contact.name)}`,
  active = false,
  className,
  variant = "list",
  onEdit,
  onToggleFavorite,
  onTogglePin,
  onDelete,
}: ContactRowProps) {
  const hasActions =
    Boolean(onEdit) ||
    Boolean(onToggleFavorite) ||
    Boolean(onTogglePin) ||
    Boolean(onDelete);

  if (variant === "grid") {
    return (
      <article
        className={cn(
          "group/contact-row relative flex min-h-52 flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-muted/30",
          active && "bg-muted/50 ring-1 ring-ring/40",
          className,
        )}
      >
        <div className="absolute right-3 top-3 z-10">
          {hasActions ? (
            <ContactActions
              contact={contact}
              onEdit={onEdit}
              onToggleFavorite={onToggleFavorite}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
            />
          ) : (
            <Button
              aria-label="Opções indisponíveis"
              title="Opções indisponíveis"
              size="icon-sm"
              variant="ghost"
              disabled
            >
              <Ellipsis />
            </Button>
          )}
        </div>

        <Link
          href={href}
          className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-md text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <Avatar className="size-16">
            {contact.avatarUrl ? (
              <AvatarImage src={contact.avatarUrl} alt={contact.name} />
            ) : null}
            <AvatarFallback className="text-lg">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>

          <span className="mt-3 max-w-full truncate text-sm font-medium text-foreground">
            {contact.name}
          </span>
          {tag ? (
            <span className="mt-1 max-w-full truncate text-xs text-foreground-subtle">
              {tag.name}
            </span>
          ) : null}
        </Link>

        <Link
          href={href}
          className="mt-4 rounded-md border-t border-border pt-3 text-center outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="block truncate text-sm text-foreground">
            {contact.phone ?? ui.noPhone}
          </span>
          <span className="mt-1 block truncate text-xs text-foreground-muted">
            {contact.email ?? ui.noEmail}
          </span>
        </Link>
      </article>
    );
  }

  return (
    <div
      className={cn(
        "group/contact-row grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-2 py-2 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_minmax(9rem,0.7fr)_auto] sm:px-3",
        active && "bg-muted/60",
        className,
      )}
    >
      <Link
        href={href}
        className="flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar size="lg">
          {contact.avatarUrl ? (
            <AvatarImage src={contact.avatarUrl} alt={contact.name} />
          ) : null}
          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
        </Avatar>

        <span className="min-w-0 flex-1">
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-sm font-medium text-foreground">
              {contact.name}
            </span>
            {tag ? (
              <span className="hidden shrink-0 text-xs text-foreground-subtle sm:inline">
                {tag.name}
              </span>
            ) : null}
          </span>
          {tag ? (
            <span className="mt-0.5 block truncate text-xs text-foreground-subtle sm:hidden">
              {tag.name}
            </span>
          ) : null}
        </span>
      </Link>

      <Link
        href={href}
        className="hidden min-w-0 rounded-md text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:block"
      >
        <span className="block truncate text-sm text-foreground">
          {contact.phone ?? ui.noPhone}
        </span>
        <span className="mt-0.5 block truncate text-xs text-foreground-muted">
          {contact.email ?? ui.noEmail}
        </span>
      </Link>

      {hasActions ? (
        <ContactActions
          contact={contact}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
        />
      ) : (
        <Button
          aria-label="Opções indisponíveis"
          title="Opções indisponíveis"
          size="icon-sm"
          variant="ghost"
          disabled
        >
          <Ellipsis />
        </Button>
      )}
    </div>
  );
}

function ContactActions({
  contact,
  onEdit,
  onToggleFavorite,
  onTogglePin,
  onDelete,
}: Required<Pick<ContactRowProps, "contact">> &
  Pick<
    ContactRowProps,
    "onEdit" | "onToggleFavorite" | "onTogglePin" | "onDelete"
  >) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Abrir ações de ${contact.name}`}
          title="Ações"
          size="icon-sm"
          variant="ghost"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {onEdit ? (
          <DropdownMenuItem onSelect={() => onEdit(contact)}>
            <Edit />
            {ui.edit}
          </DropdownMenuItem>
        ) : null}
        {onToggleFavorite ? (
          <DropdownMenuItem onSelect={() => onToggleFavorite(contact)}>
            {contact.favorite ? <StarOff /> : <Star />}
            {contact.favorite ? ui.unfavorite : ui.favorite}
          </DropdownMenuItem>
        ) : null}
        {onTogglePin ? (
          <DropdownMenuItem onSelect={() => onTogglePin(contact)}>
            {contact.pinned ? <PinOff /> : <Pin />}
            {contact.pinned ? ui.unpin : ui.pin}
          </DropdownMenuItem>
        ) : null}
        {onDelete ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(contact)}
            >
              <Trash2 />
              {ui.delete}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "C";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
