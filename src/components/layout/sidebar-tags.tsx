"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
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
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const { sidebarNavStaggerContainer, sidebarNavStaggerItem } = useAppMotion();

  return (
    <motion.div
      variants={sidebarNavStaggerContainer}
      initial="initial"
      animate="animate"
      className={cn("mt-1 space-y-1 pl-8", className)}
    >
      {tags.map((tag) => (
        <motion.div key={tag.id} variants={sidebarNavStaggerItem}>
          <Link
            href={`/?tag=${encodeURIComponent(tag.slug)}`}
            onClick={onNavigate}
            className={cn(
              "block w-full truncate rounded-md px-2 py-1 text-left text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              activeTag === tag.slug
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-foreground-subtle",
            )}
          >
            {tag.name}
          </Link>
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
