"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { CreateContactDialog } from "@/components/contacts/create-contact-dialog";
import { ContactsSearch } from "@/components/layout/contacts-search";
import { Notifications } from "@/components/layout/notifications";
import { ProfileMenu } from "@/components/layout/profile-menu";
import {
  type SidebarItemId,
  SidebarNavList,
} from "@/components/layout/sidebar-nav";
import { SidebarTags } from "@/components/layout/sidebar-tags";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types/tag";

type AppSidebarProps = {
  activeItem?: SidebarItemId;
  peopleHref?: string;
  untaggedCount?: number;
  tags?: Tag[];
  className?: string;
};

export function AppSidebar({
  activeItem = "tags",
  peopleHref = "/",
  untaggedCount = 0,
  tags = [],
  className,
}: AppSidebarProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "flex h-full w-full shrink-0 flex-col border-sidebar-border border-r bg-sidebar px-4 py-5 text-sidebar-foreground",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="truncate font-semibold text-base tracking-tight">
            {ui.appName}
          </div>
          <Notifications />
        </div>

        <ContactsSearch
          className="mt-4 max-w-none"
          contentClassName="w-80"
          inputClassName="h-7 rounded-md border-sidebar-border bg-sidebar-accent/70 pl-8 text-xs shadow-none"
          placeholder={ui.searchPlaceholder}
          syncWithUrl
        />

        <SidebarNavList
          activeItem={activeItem}
          peopleHref={peopleHref}
          className="mt-4"
        />

        {activeItem === "tags" ? <SidebarTags tags={tags} /> : null}

        <div className="mt-5">
          <button
            type="button"
            className="group flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2 text-left transition-colors hover:bg-muted"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-medium text-[0.6rem] text-foreground-subtle uppercase">
                {ui.navUntagged}
              </span>
              <span className="text-sidebar-foreground text-xl leading-none">
                {untaggedCount}
              </span>
            </span>
            <ChevronRight className="size-3.5 text-foreground-subtle transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <Button
          className="mt-3 w-full"
          variant="primary"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
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

      <CreateContactDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
