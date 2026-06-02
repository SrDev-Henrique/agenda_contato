"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ui } from "@/lib/i18n/pt-br";

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return;

    onOpenChange(nextOpen);
    if (!nextOpen) {
      setDeleteError(null);
    }
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await onConfirm();
    } catch {
      setDeleteError(ui.deleteAccountError);
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={!isDeleting}>
        <DialogHeader>
          <DialogTitle>{ui.deleteAccountTitle}</DialogTitle>
          <DialogDescription>{ui.deleteAccountDescription}</DialogDescription>
        </DialogHeader>

        {deleteError ? (
          <p className="text-destructive text-sm">{deleteError}</p>
        ) : null}

        <DialogFooter className="border-t-0 bg-transparent p-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => handleOpenChange(false)}
          >
            {ui.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? <Spinner className="size-4" /> : null}
            {ui.deleteAccountConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
