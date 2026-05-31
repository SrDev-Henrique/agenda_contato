"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Star,
  Tags,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";

import { ContactsSearch } from "@/components/layout/contacts-search";
import { Notifications } from "@/components/layout/notifications";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

type SidebarItemId = "people" | "businesses" | "favorites" | "tags" | "events";

type AppSidebarProps = {
  activeItem?: SidebarItemId;
  untaggedCount?: number;
  className?: string;
};

const tagItems = ["Trabalho", "Família", "Amigos", "Esportes", "Dev", "Design"];

const navItems: Array<{
  id: SidebarItemId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  expandable?: boolean;
  href?: string;
}> = [
  { id: "people", label: ui.navAllPeople, icon: Users },
  { id: "businesses", label: ui.navAllBusinesses, icon: BriefcaseBusiness },
  { id: "favorites", label: ui.navFavorites, icon: Star },
  { id: "tags", label: ui.navTags, icon: Tags, expandable: true },
  { id: "events", label: ui.navEvents, icon: CalendarDays, href: "/eventos" },
];

export function AppSidebar({
  activeItem = "tags",
  untaggedCount = 41,
  className,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-[620px] w-[190px] shrink-0 flex-col rounded-[28px] border border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground shadow-2xl shadow-black/30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="truncate text-base font-semibold tracking-tight">
          {ui.appName}
        </div>
        <Notifications />
      </div>

      <ContactsSearch
        className="mt-4 max-w-none"
        contentClassName="w-80"
        inputClassName="h-7 rounded-md border-sidebar-border bg-sidebar-accent/70 pl-8 text-xs shadow-none"
        placeholder={ui.searchPlaceholder}
      />

      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            active={activeItem === item.id}
            icon={item.icon}
            label={item.label}
            expandable={item.expandable}
            href={item.href}
          />
        ))}
      </nav>

      {activeItem === "tags" ? (
        <div className="mt-1 space-y-1 pl-8">
          {tagItems.map((tag) => (
            <button
              key={tag}
              type="button"
              className="block w-full truncate rounded-md px-2 py-1 text-left text-xs text-foreground-subtle transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {tag}
            </button>
          ))}
          <button
            type="button"
            className="block w-full truncate rounded-md px-2 py-1 text-left text-xs text-foreground-subtle transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            Todas as tags
          </button>
        </div>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          className="group flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2 text-left transition-colors hover:bg-muted"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-[0.6rem] font-medium uppercase text-foreground-subtle">
              {ui.navUntagged}
            </span>
            <span className="text-xl leading-none text-sidebar-foreground">
              {untaggedCount}
            </span>
          </span>
          <ChevronRight className="size-3.5 text-foreground-subtle transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <Button className="mt-3 w-full" variant="primary">
        {ui.addContact}
        <span aria-hidden="true">+</span>
      </Button>

      <div className="mt-auto pt-6">
        <ProfileMenu
          name="Dexter Adams"
          className="border-0 bg-transparent px-0 py-0"
        />
      </div>
    </aside>
  );
}

function SidebarNavItem({
  active,
  icon: Icon,
  label,
  expandable,
  href,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  expandable?: boolean;
  href?: string;
}) {
  const className = cn(
    "flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
        aria-current={active ? "page" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-current={active ? "page" : undefined} className={className}>
      {content}
    </button>
  );
}
