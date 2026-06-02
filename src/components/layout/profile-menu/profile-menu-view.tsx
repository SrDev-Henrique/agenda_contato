"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { DeleteAccountDialog } from "./delete-account-dialog";
import { getInitials } from "./get-initials";
import { ProfileSettingsPopover } from "./profile-settings-popover";

export type ProfileMenuViewProps = {
  className?: string;
  name: string;
  avatarUrl?: string;
  onSignOut?: () => void | Promise<void>;
  onDeleteAccount?: () => void | Promise<void>;
};

export function ProfileMenuView({
  className,
  name,
  avatarUrl,
  onSignOut,
  onDeleteAccount,
}: ProfileMenuViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "relative z-10 flex min-w-0 items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2",
          className,
        )}
      >
        <Avatar size="lg">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <span className="min-w-0 flex-1 truncate font-medium text-foreground text-sm">
          {name}
        </span>

        <ProfileSettingsPopover
          onSignOut={onSignOut}
          onDeleteAccount={onDeleteAccount}
          onOpenDeleteDialog={() => setDeleteDialogOpen(true)}
        />
      </div>

      {onDeleteAccount ? (
        <DeleteAccountDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={onDeleteAccount}
        />
      ) : null}
    </>
  );
}
