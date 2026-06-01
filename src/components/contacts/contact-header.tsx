"use client";

import { Mail, Phone, Video } from "lucide-react";

import { ContactTagsEditor } from "@/components/contacts/contact-tags-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Tag } from "@/types/tag";

type ContactHeaderProps = {
  contact: Contact;
  tags: Tag[];
  className?: string;
  onCall?: (contact: Contact) => void;
  onVideoCall?: (contact: Contact) => void;
  onEmail?: (contact: Contact) => void;
  onAddTag: (name: string) => void;
  onRemoveTag?: (tag: Tag) => void;
};

export function ContactHeader({
  contact,
  tags,
  className,
  onCall,
  onVideoCall,
  onEmail,
  onAddTag,
  onRemoveTag,
}: ContactHeaderProps) {
  return (
    <header
      className={cn(
        "rounded-[28px] border border-border bg-surface p-5 shadow-2xl shadow-black/25",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <Avatar className="size-28 shadow-black/30 shadow-xl">
          {contact.avatarUrl ? (
            <AvatarImage src={contact.avatarUrl} alt={contact.name} />
          ) : null}
          <AvatarFallback className="text-3xl">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <h2 className="max-w-full truncate font-inter font-semibold text-2xl text-foreground leading-tight">
            {contact.name}
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <Button
              aria-label={`${ui.callContact} ${contact.name}`}
              title={ui.callContact}
              size="icon"
              variant="muted"
              disabled={!onCall}
              onClick={() => onCall?.(contact)}
            >
              <Phone />
            </Button>
            <Button
              aria-label={`${ui.videoCallContact} ${contact.name}`}
              title={ui.videoCallContact}
              size="icon"
              variant="muted"
              disabled={!onVideoCall}
              onClick={() => onVideoCall?.(contact)}
            >
              <Video />
            </Button>
            <Button
              aria-label={`${ui.emailContact} ${contact.name}`}
              title={ui.emailContact}
              size="icon"
              variant="muted"
              disabled={!onEmail}
              onClick={() => onEmail?.(contact)}
            >
              <Mail />
            </Button>
          </div>

          <ContactTagsEditor
            tags={tags}
            className="mt-4 justify-center sm:justify-start"
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
          />
        </div>
      </div>
    </header>
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
