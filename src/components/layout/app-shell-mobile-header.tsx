"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { MobileNavSheet } from "@/components/layout/mobile-nav-sheet";
import type { SidebarItemId } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";

type AppShellMobileHeaderProps = {
  activeItem: SidebarItemId;
  peopleHref: string;
  untaggedCount: number;
};

export function AppShellMobileHeader({
  activeItem,
  peopleHref,
  untaggedCount,
}: AppShellMobileHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 md:hidden">
      <div className="truncate text-base font-semibold tracking-tight">
        {ui.appName}
      </div>

      <MobileNavSheet
        open={open}
        onOpenChange={setOpen}
        activeItem={activeItem}
        peopleHref={peopleHref}
        untaggedCount={untaggedCount}
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
    </header>
  );
}
