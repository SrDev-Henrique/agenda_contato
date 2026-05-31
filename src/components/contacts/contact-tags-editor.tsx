"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";

type ContactTagsEditorProps = {
  tags: Tag[];
  className?: string;
  placeholder?: string;
  onAddTag: (name: string) => void;
  onRemoveTag?: (tag: Tag) => void;
};

export function ContactTagsEditor({
  tags,
  className,
  placeholder = ui.tagNamePlaceholder,
  onAddTag,
  onRemoveTag,
}: ContactTagsEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const tagName = value.trim();

    if (!tagName) {
      return;
    }

    onAddTag(tagName);
    setValue("");
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
      return;
    }

    if (event.key === "Escape") {
      setValue("");
      setIsEditing(false);
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant="outline"
          className="h-7 rounded-lg border-border bg-background px-2 text-foreground"
        >
          {tag.name}
          {onRemoveTag ? (
            <button
              type="button"
              aria-label={`${ui.removeTag} ${tag.name}`}
              className="-mr-1 inline-flex size-4 items-center justify-center rounded-full text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              onClick={() => onRemoveTag(tag)}
            >
              <X className="size-3" />
            </button>
          ) : null}
        </Badge>
      ))}

      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key="tag-input"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 144 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <Input
              ref={inputRef}
              aria-label={ui.newTag}
              className="h-7 rounded-lg bg-background px-2 text-xs"
              placeholder={placeholder}
              value={value}
              onBlur={() => {
                if (!value.trim()) {
                  setIsEditing(false);
                }
              }}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
            />
          </motion.div>
        ) : (
          <motion.div
            key="tag-button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            <Button
              type="button"
              aria-label={ui.addTag}
              title={ui.addTag}
              variant="muted"
              size="icon-sm"
              onClick={() => setIsEditing(true)}
            >
              <Plus />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
