"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";

type SidebarTagsProps = {
  tags: Tag[];
  onNavigate?: () => void;
  className?: string;
};

export function SidebarTags({ tags, onNavigate, className }: SidebarTagsProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  return (
    <div className={cn("mt-1 space-y-1 pl-8", className)}>
      {tags.map((tag) => (
        <Link
          key={tag.id}
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
      ))}
      <Link
        href="/"
        onClick={onNavigate}
        className="block w-full truncate rounded-md px-2 py-1 text-left text-xs text-foreground-subtle transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        Todas as tags
      </Link>
    </div>
  );
}
