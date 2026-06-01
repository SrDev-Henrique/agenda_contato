"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Star,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";

import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

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
};

export function SidebarNavList({
  activeItem,
  peopleHref = "/",
  onNavigate,
  className,
}: SidebarNavListProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {sidebarNavItems.map((item) => {
        const href = item.id === "people" ? peopleHref : item.href;

        return (
          <SidebarNavItem
            key={item.id}
            active={activeItem === item.id}
            icon={item.icon}
            label={item.label}
            expandable={item.expandable}
            href={href}
            onNavigate={onNavigate}
          />
        );
      })}
    </nav>
  );
}

function SidebarNavItem({
  active,
  icon: Icon,
  label,
  expandable,
  href,
  onNavigate,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  expandable?: boolean;
  href?: string;
  onNavigate?: () => void;
}) {
  const className = cn(
    "flex h-7 w-full items-center gap-2 rounded-md px-2 text-left font-medium text-sidebar-foreground text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    active && "bg-sidebar-accent text-sidebar-accent-foreground",
  );

  const content = (
    <>
      <Icon className="size-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {expandable ? (
        <ChevronDown className="size-3.5 shrink-0 text-foreground-subtle" />
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
