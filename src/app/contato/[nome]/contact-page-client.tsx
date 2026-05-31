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
import Link from "next/link";

import { ContactHeader } from "@/components/contacts/contact-header";
import { EventCard } from "@/components/events/event-card";
import { EventComposer } from "@/components/events/event-composer";
import { AppShell } from "@/components/layout/app-shell";
import { NoteCard } from "@/components/notes/note-card";
import { NoteComposer } from "@/components/notes/note-composer";
import { ReminderCard } from "@/components/reminders/reminder-card";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";
import type { Contact } from "@/types/contact";

type ContactPageClientProps = {
  nome: string;
};

export function ContactPageClient({ nome }: ContactPageClientProps) {
  const {
    state,
    isHydrated,
    createTag,
    addTagToContact,
    removeTagFromContact,
    addReminder,
    addEvent,
    addNote,
    getContactEvents,
    getContactReminders,
    getContactNotes,
  } = useContactsStore();

  const contact = state.contacts.find(
    (item) => slugify(item.name) === decodeURIComponent(nome),
  );

  const contacts = state.contacts;
  const tags = state.tags;

  if (!contact) {
    return (
      <main className="dark flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
        <section className="w-full max-w-md rounded-[28px] border border-border bg-surface p-6 text-center shadow-2xl shadow-black/25">
          <h1 className="font-inter text-xl font-semibold text-foreground">
            {isHydrated ? ui.contactNotFound : ui.loading}
          </h1>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            {isHydrated ? ui.contactNotFoundHint : ui.appDescription}
          </p>
          <Button asChild className="mt-5" variant="primary">
            <Link href="/preview">{ui.backToContacts}</Link>
          </Button>
        </section>
      </main>
    );
  }

  const contactTags = tags.filter((tag) => contact.tagIds.includes(tag.id));
  const reminders = getContactReminders(contact.id);
  const events = getContactEvents(contact.id);
  const notes = getContactNotes(contact.id);

  return (
    <AppShell
      activeItem="people"
      className="lg:grid-cols-[210px_minmax(360px,0.9fr)] xl:grid-cols-[210px_minmax(390px,0.95fr)_minmax(460px,1.15fr)]"
    >
      <section className="flex min-h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-[28px] border border-border bg-surface text-foreground shadow-2xl shadow-black/25 xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)]">
        <div className="min-h-0 overflow-y-auto">
          <ContactHeader
            contact={contact}
            tags={contactTags}
            className="rounded-none border-0 bg-[radial-gradient(circle_at_45%_0%,oklch(from_var(--muted)_l_c_h_/_55%),transparent_34%),var(--surface)] shadow-none"
            onCall={() => undefined}
            onVideoCall={() => undefined}
            onEmail={() => undefined}
            onAddTag={(name) => {
              const tag = createTag(name);

              if (tag) {
                addTagToContact(contact.id, tag.id);
              }
            }}
            onRemoveTag={(tag) => removeTagFromContact(contact.id, tag.id)}
          />

          <div className="space-y-5 border-t border-border bg-surface-muted p-4">
            <ContactInfoGrid contact={contact} />

            <DetailSection title={ui.reminders}>
              <div className="space-y-2">
                {reminders.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    contact={contact}
                  />
                ))}
                <ReminderComposer
                  contacts={contacts}
                  defaultContactId={contact.id}
                  onCreateReminder={(data) =>
                    addReminder({ ...data, contactId: contact.id })
                  }
                />
              </div>
            </DetailSection>

            <DetailSection title={ui.upcomingEvents}>
              <div className="space-y-2">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    contact={contact}
                    attendees={contacts.filter((item) =>
                      event.attendeeContactIds?.includes(item.id),
                    )}
                  />
                ))}
                <EventComposer
                  contacts={contacts}
                  onCreateEvent={(data) =>
                    addEvent({ ...data, contactId: contact.id })
                  }
                />
              </div>
            </DetailSection>

            <DetailSection title={ui.notes}>
              <div className="space-y-2">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
                <NoteComposer contactId={contact.id} onCreateNote={addNote} />
              </div>
            </DetailSection>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-inter text-sm font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ContactInfoGrid({ contact }: { contact: Contact }) {
  const infoItems = [
    {
      label: ui.phone,
      value: contact.phone ?? ui.noPhone,
      icon: Phone,
      href: contact.phone ? `tel:${contact.phone}` : undefined,
    },
    {
      label: ui.email,
      value: contact.email ?? ui.noEmail,
      icon: Mail,
      href: contact.email ? `mailto:${contact.email}` : undefined,
    },
    {
      label: ui.location,
      value: contact.location ?? "Sem localização",
      icon: MapPin,
    },
    {
      label: ui.address,
      value: contact.address ?? "Sem endereço",
      icon: Home,
    },
    {
      label: ui.birthday,
      value: contact.birthday ? formatBirthday(contact.birthday) : "Sem aniversário",
      icon: Cake,
    },
    {
      label: ui.relationship,
      value: contact.relationship ?? "Sem parentesco",
      icon: Heart,
    },
    {
      label: ui.company,
      value:
        [contact.company, contact.jobTitle].filter(Boolean).join(", ") ||
        "Sem empresa",
      icon: BriefcaseBusiness,
      wide: true,
    },
  ];

  return (
    <section className="grid gap-2 sm:grid-cols-2">
      {infoItems.map((item) => (
        <InfoCard key={item.label} {...item} />
      ))}
    </section>
  );
}

function InfoCard({
  label,
  value,
  icon: Icon,
  href,
  wide,
}: {
  label: string;
  value: string;
  icon: typeof Phone;
  href?: string;
  wide?: boolean;
}) {
  const content = (
    <>
      <Icon className="size-4 shrink-0 text-foreground-muted" />
      <span className="min-w-0">
        <span className="sr-only">{label}</span>
        <span className="block truncate text-sm font-medium text-foreground">
          {value}
        </span>
      </span>
    </>
  );

  const className = cn(
    "flex h-14 min-w-0 items-center gap-3 rounded-lg bg-background px-3 shadow-sm ring-1 ring-border",
    wide && "sm:col-span-2",
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function formatBirthday(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}
