"use client";

import { ContactsList } from "@/components/contacts/contacts-list";
import type { Contact } from "@/types/contact";
import type { Tag } from "@/types/tag";

type ContactsListPreviewProps = {
  contacts: Contact[];
  tags: Tag[];
};

export function ContactsListPreview({ contacts, tags }: ContactsListPreviewProps) {
  return (
    <ContactsList
      contacts={contacts}
      tags={tags}
      onEditContact={() => undefined}
      onToggleFavorite={() => undefined}
      onTogglePin={() => undefined}
      onDeleteContact={() => undefined}
    />
  );
}
