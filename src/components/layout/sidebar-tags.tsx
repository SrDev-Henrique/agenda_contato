"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";
import type { Tag } from "@/types/tag";

type SidebarTagsProps = {
  tags: Tag[];
  onNavigate?: () => void;
  className?: string;
};

export function SidebarTagsPanel({
  open,
  tags,
  onNavigate,
  className,
  id = "desktop-sidebar-tags-panel",
}: SidebarTagsProps & { open: boolean; id?: string }) {
  const { sidebarTagsPanelVariants } = useAppMotion();

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="sidebar-tags-panel"
          id={id}
          variants={sidebarTagsPanelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="overflow-hidden"
        >
          <SidebarTags
            tags={tags}
            onNavigate={onNavigate}
            className={className}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SidebarTags({ tags, onNavigate, className }: SidebarTagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const { deleteTag } = useContactsStore();
  const { sidebarNavStaggerContainer, sidebarNavStaggerItem } = useAppMotion();

  const handleDeleteTag = (tag: Tag) => {
    deleteTag(tag.id);

    if (activeTag === tag.slug) {
      router.replace("/");
    }
  };

  return (
    <motion.div
      variants={sidebarNavStaggerContainer}
      initial="initial"
      animate="animate"
      className={cn("mt-1 space-y-1 pl-8", className)}
    >
      {tags.map((tag) => (
        <motion.div key={tag.id} variants={sidebarNavStaggerItem}>
          <div className="group flex items-center gap-0.5">
            <Link
              href={`/?tag=${encodeURIComponent(tag.slug)}`}
              onClick={onNavigate}
              className={cn(
                "min-w-0 flex-1 truncate rounded-md px-2 py-1 text-left text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                activeTag === tag.slug
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-foreground-subtle",
              )}
            >
              {tag.name}
            </Link>
            <button
              type="button"
              aria-label={`${ui.deleteTag} ${tag.name}`}
              className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-subtle opacity-0 transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 group-hover:opacity-100"
              onClick={() => handleDeleteTag(tag)}
            >
              <X className="size-3" />
            </button>
          </div>
        </motion.div>
      ))}
      <motion.div variants={sidebarNavStaggerItem}>
        <Link
          href="/"
          onClick={onNavigate}
          className="block w-full truncate rounded-md px-2 py-1 text-left text-foreground-subtle text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {ui.navAllTags}
        </Link>
      </motion.div>
    </motion.div>
  );
}
