"use client";

import { useMemo, useState } from "react";

import { ContactHeader } from "@/components/contacts/contact-header";
import { createId, slugify } from "@/lib/id";
import type { Contact } from "@/types/contact";
import type { Tag } from "@/types/tag";

type ContactHeaderPreviewProps = {
  contact: Contact;
  tags: Tag[];
};

export function ContactHeaderPreview({
  contact,
  tags,
}: ContactHeaderPreviewProps) {
  const contactTags = useMemo(
    () => tags.filter((tag) => contact.tagIds.includes(tag.id)),
    [contact.tagIds, tags],
  );
  const [currentTags, setCurrentTags] = useState(contactTags);

  return (
    <ContactHeader
      contact={contact}
      tags={currentTags}
      onCall={() => undefined}
      onVideoCall={() => undefined}
      onEmail={() => undefined}
      onAddTag={(name) => {
        const slug = slugify(name);

        if (currentTags.some((tag) => tag.slug === slug)) {
          return;
        }

        setCurrentTags((items) => [
          ...items,
          {
            id: createId(),
            name,
            slug,
          },
        ]);
      }}
      onRemoveTag={(tag) =>
        setCurrentTags((items) => items.filter((item) => item.id !== tag.id))
      }
    />
  );
}
