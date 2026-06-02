"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Star,
  Tags,
  Users,
} from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { type ComponentType, Fragment } from "react";

import { SidebarTagsPanel } from "@/components/layout/sidebar-tags";
import { ui } from "@/lib/i18n/pt-br";
import { useAppMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";

export type SidebarItemId =
  | "people"
  | "businesses"
  | "favorites"
  | "tags"
  | "events";

export const sidebarNavItems: Array<{
  id: SidebarItemId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  expandable?: boolean;
  href?: string;
}> = [
  { id: "people", label: ui.navAllPeople, icon: Users, href: "/" },
  { id: "businesses", label: ui.navAllBusinesses, icon: BriefcaseBusiness },
  {
    id: "favorites",
    label: ui.navFavorites,
    icon: Star,
    href: "/?favorites=true",
  },
  { id: "tags", label: ui.navTags, icon: Tags, expandable: true },
  { id: "events", label: ui.navEvents, icon: CalendarDays, href: "/eventos" },
];

export function getActiveSidebarItem(
  pathname: string,
  searchParams?: ReadonlyURLSearchParams | URLSearchParams,
): SidebarItemId {
  if (pathname.startsWith("/eventos")) {
    return "events";
  }

  if (pathname.startsWith("/contato")) {
    return "people";
  }

  if (pathname === "/") {
    if (searchParams?.get("favorites") === "true") {
      return "favorites";
    }
    if (searchParams?.get("tag")) {
      return "tags";
    }
    return "people";
  }

  return "people";
}

type SidebarNavListProps = {
  activeItem: SidebarItemId;
  peopleHref?: string;
  onNavigate?: () => void;
  className?: string;
  layoutScope?: "desktop" | "mobile";
  tagsExpanded?: boolean;
  tagsNavActive?: boolean;
  onTagsToggle?: () => void;
  tags?: Tag[];
};

export function SidebarNavList({
  activeItem,
  peopleHref = "/",
  onNavigate,
  className,
  layoutScope = "desktop",
  tagsExpanded = false,
  tagsNavActive = false,
  onTagsToggle,
  tags = [],
}: SidebarNavListProps) {
  const { sidebarNavStaggerContainer, sidebarNavStaggerItem } = useAppMotion();
  const activeIndicatorId = `${layoutScope}-sidebar-active-indicator`;
  const tagsPanelId = `${layoutScope}-sidebar-tags-panel`;

  return (
    <LayoutGroup id={`sidebar-nav-${layoutScope}`}>
      <motion.nav
        variants={sidebarNavStaggerContainer}
        initial="initial"
        animate="animate"
        className={cn("flex flex-col gap-1", className)}
      >
        {sidebarNavItems.map((item) => {
          const href = item.id === "people" ? peopleHref : item.href;
          const isTagsItem = item.id === "tags";

          return (
            <Fragment key={item.id}>
              <motion.div variants={sidebarNavStaggerItem}>
                <SidebarNavItem
                  active={isTagsItem ? tagsNavActive : activeItem === item.id}
                  icon={item.icon}
                  label={item.label}
                  expandable={item.expandable}
                  expanded={isTagsItem ? tagsExpanded : false}
                  href={href}
                  onNavigate={onNavigate}
                  onClick={isTagsItem ? onTagsToggle : undefined}
                  activeIndicatorId={activeIndicatorId}
                  tagsPanelId={isTagsItem ? tagsPanelId : undefined}
                />
              </motion.div>
              {isTagsItem ? (
                <SidebarTagsPanel
                  open={tagsExpanded}
                  tags={tags}
                  onNavigate={onNavigate}
                  id={tagsPanelId}
                />
              ) : null}
            </Fragment>
          );
        })}
      </motion.nav>
    </LayoutGroup>
  );
}

function SidebarNavItem({
  active,
  icon: Icon,
  label,
  expandable,
  expanded = false,
  href,
  onNavigate,
  onClick,
  activeIndicatorId,
  tagsPanelId,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  expandable?: boolean;
  expanded?: boolean;
  href?: string;
  onNavigate?: () => void;
  onClick?: () => void;
  activeIndicatorId: string;
  tagsPanelId?: string;
}) {
  const { spring, tween } = useAppMotion();

  const className = cn(
    "relative flex h-7 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-left font-medium text-sidebar-foreground text-xs transition-colors",
    active
      ? "text-accent"
      : "hover:bg-accent-muted hover:text-sidebar-accent-foreground",
  );

  const content = (
    <>
      {active ? (
        <motion.span
          layoutId={activeIndicatorId}
          className="absolute inset-0 rounded-md bg-accent-subtle"
          transition={spring}
        />
      ) : null}
      <Icon className="relative z-10 size-3.5 shrink-0" />
      <span className="relative z-10 min-w-0 flex-1 truncate">{label}</span>
      {expandable ? (
        <motion.span
          className="relative z-10 shrink-0 text-foreground-subtle"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={tween}
        >
          <ChevronDown className="size-3.5" />
        </motion.span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      aria-expanded={expandable ? expanded : undefined}
      aria-controls={tagsPanelId}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}

export function useSidebarActiveItem(): SidebarItemId {
  const pathname = usePathname();
  return getActiveSidebarItem(pathname);
}
