"use client";

import {
  BriefcaseBusiness,
  Cake,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  EditableField,
  phoneFieldFormat,
  validateOptionalEmail,
} from "@/components/contacts/editable-field";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";

type ContactInfoGridProps = {
  contact: Contact;
  onUpdate: (patch: Partial<Contact>) => void;
};

export function ContactInfoGrid({ contact, onUpdate }: ContactInfoGridProps) {
  const infoItems = [
    {
      label: ui.phone,
      icon: Phone,
      emptyLabel: ui.noPhone,
      value: contact.phone ?? "",
      type: "tel" as const,
      formatValue: phoneFieldFormat,
      onSave: (value: string) =>
        onUpdate({ phone: value.trim() || undefined }),
    },
    {
      label: ui.email,
      icon: Mail,
      emptyLabel: ui.noEmail,
      value: contact.email ?? "",
      type: "email" as const,
      validate: validateOptionalEmail,
      onSave: (value: string) =>
        onUpdate({ email: value.trim() || undefined }),
    },
    {
      label: ui.location,
      icon: MapPin,
      emptyLabel: ui.noLocation,
      value: contact.location ?? "",
      onSave: (value: string) =>
        onUpdate({ location: value.trim() || undefined }),
    },
    {
      label: ui.address,
      icon: Home,
      emptyLabel: ui.noAddress,
      value: contact.address ?? "",
      onSave: (value: string) =>
        onUpdate({ address: value.trim() || undefined }),
    },
    {
      label: ui.birthday,
      icon: Cake,
      emptyLabel: ui.noBirthday,
      value: contact.birthday ?? "",
      type: "date" as const,
      displayFormatter: (value: string) => formatBirthday(value),
      onSave: (value: string) =>
        onUpdate({ birthday: value.trim() || undefined }),
    },
    {
      label: ui.relationship,
      icon: Heart,
      emptyLabel: ui.noRelationship,
      value: contact.relationship ?? "",
      onSave: (value: string) =>
        onUpdate({ relationship: value.trim() || undefined }),
    },
    {
      label: ui.company,
      icon: BriefcaseBusiness,
      emptyLabel: ui.noCompany,
      value: contact.company ?? "",
      wide: true,
      onSave: (value: string) =>
        onUpdate({ company: value.trim() || undefined }),
    },
    {
      label: ui.jobTitle,
      icon: BriefcaseBusiness,
      emptyLabel: ui.noJobTitle,
      value: contact.jobTitle ?? "",
      wide: true,
      onSave: (value: string) =>
        onUpdate({ jobTitle: value.trim() || undefined }),
    },
  ];

  return (
    <section className="grid gap-2 sm:grid-cols-2">
      {infoItems.map((item) => (
        <InfoCard key={item.label} label={item.label} icon={item.icon} wide={item.wide}>
          <EditableField
            value={item.value}
            emptyLabel={item.emptyLabel}
            type={item.type}
            formatValue={item.formatValue}
            displayFormatter={item.displayFormatter}
            validate={item.validate}
            onSave={item.onSave}
          />
        </InfoCard>
      ))}
    </section>
  );
}

function InfoCard({
  label,
  icon: Icon,
  wide,
  children,
}: {
  label: string;
  icon: typeof Phone;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-center gap-0.5 rounded-lg bg-background px-3 py-2 shadow-sm ring-1 ring-border",
        wide && "sm:col-span-2",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-foreground-muted" aria-hidden />
        <span className="font-medium text-foreground-muted text-xs">{label}</span>
      </div>
      <div className="min-w-0 pl-6">{children}</div>
    </div>
  );
}

function formatBirthday(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
