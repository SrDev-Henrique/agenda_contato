"use client";

import { ChevronRight } from "lucide-react";

import { ContactsSearch } from "@/components/layout/contacts-search";
import { Notifications } from "@/components/layout/notifications";
import { ProfileMenu } from "@/components/layout/profile-menu";
import {
  SidebarNavList,
  sidebarTagItems,
  type SidebarItemId,
} from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  activeItem?: SidebarItemId;
  peopleHref?: string;
  untaggedCount?: number;
  className?: string;
};

export function AppSidebar({
  activeItem = "tags",
  peopleHref,
  untaggedCount = 41,
  className,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex w-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 text-sidebar-foreground",
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

      <SidebarNavList
        activeItem={activeItem}
        peopleHref={peopleHref}
        className="mt-4"
      />

      {activeItem === "tags" ? (
        <div className="mt-1 space-y-1 pl-8">
          {sidebarTagItems.map((tag) => (
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
