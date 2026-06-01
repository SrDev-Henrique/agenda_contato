"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { useContactsStore } from "@/store/contacts-store";

type CreateContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateContactDialog({
  open,
  onOpenChange,
}: CreateContactDialogProps) {
  const router = useRouter();
  const { addContact } = useContactsStore();
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    addContact({ name: trimmed });
    onOpenChange(false);
    setName("");
    router.push(`/contato/${slugify(trimmed)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{ui.newContact}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="contact-name">{ui.contactName}</Label>
            <Input
              id="contact-name"
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={ui.contactName}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {ui.cancel}
            </Button>
            <Button type="submit" variant="primary" disabled={!name.trim()}>
              {ui.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
