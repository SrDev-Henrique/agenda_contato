"use client";

import { ContactRow } from "@/components/contacts/contact-row";
import type { Contact } from "@/types/contact";
import type { Tag } from "@/types/tag";

type ContactRowPreviewProps = {
  contacts: Contact[];
  tags: Tag[];
};

export function ContactRowPreview({ contacts, tags }: ContactRowPreviewProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-border bg-surface p-3">
        {contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            tag={tags.find((tag) => contact.tagIds.includes(tag.id))}
            onEdit={() => undefined}
            onToggleFavorite={() => undefined}
            onTogglePin={() => undefined}
            onDelete={() => undefined}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <ContactRow
            key={`${contact.id}-grid`}
            contact={contact}
            tag={tags.find((tag) => contact.tagIds.includes(tag.id))}
            variant="grid"
            onEdit={() => undefined}
            onToggleFavorite={() => undefined}
            onTogglePin={() => undefined}
            onDelete={() => undefined}
          />
        ))}
      </div>
    </div>
  );
}
