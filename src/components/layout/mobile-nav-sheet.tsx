"use client";

import { ChevronRight } from "lucide-react";

import { ContactsSearch } from "@/components/layout/contacts-search";
import { ProfileMenu } from "@/components/layout/profile-menu";
import {
  SidebarNavList,
  sidebarTagItems,
  type SidebarItemId,
} from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ui } from "@/lib/i18n/pt-br";

type MobileNavSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeItem: SidebarItemId;
  peopleHref: string;
  untaggedCount: number;
  trigger: React.ReactNode;
};

export function MobileNavSheet({
  open,
  onOpenChange,
  activeItem,
  peopleHref,
  untaggedCount,
  trigger,
}: MobileNavSheetProps) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[min(100vw-2rem,280px)] flex-col gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
      >
        <SheetHeader className="border-b border-sidebar-border px-4 py-4">
          <SheetTitle className="text-left text-base font-semibold">
            {ui.appName}
          </SheetTitle>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
          <ContactsSearch
            className="max-w-none"
            contentClassName="w-[min(100vw-3rem,320px)]"
            inputClassName="h-8 rounded-md border-sidebar-border bg-sidebar-accent/70 pl-8 text-xs shadow-none"
            placeholder={ui.searchPlaceholder}
          />

          <SidebarNavList
            activeItem={activeItem}
            peopleHref={peopleHref}
            onNavigate={close}
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
