"use client";

import { useMemo, useState } from "react";

import { ContactTagsEditor } from "@/components/contacts/contact-tags-editor";
import { createId, slugify } from "@/lib/id";
import type { Tag } from "@/types/tag";

type ContactTagsEditorPreviewProps = {
  tags: Tag[];
};

export function ContactTagsEditorPreview({
  tags,
}: ContactTagsEditorPreviewProps) {
  const initialTags = useMemo(() => tags.slice(0, 2), [tags]);
  const [currentTags, setCurrentTags] = useState(initialTags);

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <ContactTagsEditor
        tags={currentTags}
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
    </div>
  );
}
