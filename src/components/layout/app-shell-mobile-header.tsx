"use client";

import { Menu } from "lucide-react";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import { Notifications } from "@/components/layout/notifications";
import type { SidebarItemId } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import type { Tag } from "@/types/tag";

type AppShellMobileHeaderProps = {
  activeItem: SidebarItemId;
  peopleHref: string;
  untaggedCount: number;
  tags?: Tag[];
  navOpen: boolean;
  onNavOpenChange: (open: boolean) => void;
  onAddContact: () => void;
};

export function AppShellMobileHeader({
  activeItem,
  peopleHref,
  untaggedCount,
  tags = [],
  navOpen,
  onNavOpenChange,
  onAddContact,
}: AppShellMobileHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-border border-b px-4 py-3 md:hidden">
      <div className="min-w-0 flex-1 truncate font-semibold text-base tracking-tight">
        {ui.appName}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Notifications />

        <MobileNavSheet
          open={navOpen}
          onOpenChange={onNavOpenChange}
          activeItem={activeItem}
          peopleHref={peopleHref}
          untaggedCount={untaggedCount}
          tags={tags}
          onAddContact={onAddContact}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="size-5" />
            </Button>
          }
        />
      </div>
    </header>
  );
}
