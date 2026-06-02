"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ui } from "@/lib/i18n/pt-br";
import type { Contact } from "@/types/contact";

type ActivityContactSelectProps = {
  id: string;
  contacts: Contact[];
  value: string;
  onValueChange: (contactId: string) => void;
  label?: string;
};

export function ActivityContactSelect({
  id,
  contacts,
  value,
  onValueChange,
  label = ui.contacts,
}: ActivityContactSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value || "none"} onValueChange={(next) => onValueChange(next === "none" ? "" : next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={ui.contactTagNone} />
        </SelectTrigger>
        <SelectContent position="popper" className="z-100">
          <SelectItem value="none">{ui.contactTagNone}</SelectItem>
          {contacts.map((contact) => (
            <SelectItem key={contact.id} value={contact.id}>
              {contact.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
