"use client";

import { LogOut, Settings, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ui } from "@/lib/i18n/pt-br";

import { ThemeSwitcher } from "./theme-switcher";

type ProfileSettingsPopoverProps = {
  onSignOut?: () => void | Promise<void>;
  onDeleteAccount?: () => void | Promise<void>;
  onOpenDeleteDialog: () => void;
};

export function ProfileSettingsPopover({
  onSignOut,
  onDeleteAccount,
  onOpenDeleteDialog,
}: ProfileSettingsPopoverProps) {
  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Abrir configurações"
          title="Configurações"
          variant="muted"
          size="icon-lg"
          className="touch-manipulation"
        >
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        sideOffset={8}
        collisionPadding={16}
        className="z-[200] w-64"
      >
        <PopoverHeader>
          <PopoverTitle>Configurações</PopoverTitle>
          <PopoverDescription>Preferências da interface</PopoverDescription>
        </PopoverHeader>

        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
            <span className="font-medium text-foreground text-sm">Tema</span>
            <ThemeSwitcher />
          </div>

          {onSignOut ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={onSignOut}
            >
              <LogOut className="size-4" />
              {ui.signOut}
            </Button>
          ) : null}

          {onDeleteAccount ? (
            <Button
              type="button"
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={onOpenDeleteDialog}
            >
              <Trash2 className="size-4" />
              {ui.deleteAccount}
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
