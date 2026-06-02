"use client";

import { useRouter } from "next/navigation";
import { ContactEventsSection } from "@/components/contacts/contact-events-section";
import { ContactNotesSection } from "@/components/contacts/contact-notes-section";
import { ContactHeader } from "@/components/contacts/contact-header";
import { ContactInfoGrid } from "@/components/contacts/contact-info-grid";
import { ContactNotFound } from "@/components/contacts/contact-not-found";
import { ContactRemindersSection } from "@/components/contacts/contact-reminders-section";
import { appMainPanelClassName } from "@/components/layout/app-shell";
import { slugify } from "@/lib/id";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

type ContactPageClientProps = {
  nome: string;
};

export function ContactPageClient({ nome }: ContactPageClientProps) {
  const router = useRouter();
  const slug = decodeURIComponent(nome);

  const {
    state,
    isHydrated,
    updateContact,
    createTag,
    addTagToContact,
    removeTagFromContact,
    addReminder,
    addEvent,
    addNote,
    updateEvent,
    deleteEvent,
    updateReminder,
    deleteReminder,
    updateNote,
    deleteNote,
    getContactEvents,
    getContactReminders,
    getContactNotes,
  } = useContactsStore();

  const contact = state.contacts.find((item) => slugify(item.name) === slug);

  const contacts = state.contacts;
  const tags = state.tags;

  if (!contact) {
    return <ContactNotFound isHydrated={isHydrated} />;
  }

  const contactTags = tags.filter((tag) => contact.tagIds.includes(tag.id));
  const reminders = getContactReminders(contact.id);
  const events = getContactEvents(contact.id);
  const notes = getContactNotes(contact.id);

  const handleUpdate = (patch: Parameters<typeof updateContact>[1]) => {
    updateContact(contact.id, patch);
  };

  const handleNameSave = (name: string) => {
    updateContact(contact.id, { name });
    const nextSlug = slugify(name);
    if (nextSlug !== slug) {
      router.replace(`/contato/${nextSlug}`);
    }
  };

  return (
    <section className={cn(appMainPanelClassName)}>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ContactHeader
          contact={contact}
          tags={contactTags}
          className="rounded-none border-0 bg-[radial-gradient(circle_at_45%_0%,oklch(from_var(--muted)_l_c_h/55%),transparent_34%),var(--surface)] shadow-none"
          onCall={() => undefined}
          onVideoCall={() => undefined}
          onEmail={() => undefined}
          onNameSave={handleNameSave}
          onAddTag={(name) => {
            const tag = createTag(name);

            if (tag) {
              addTagToContact(contact.id, tag.id);
            }
          }}
          onRemoveTag={(tag) => removeTagFromContact(contact.id, tag.id)}
        />

        <div className="space-y-5 border-border border-t bg-surface-muted p-4">
          <ContactInfoGrid contact={contact} onUpdate={handleUpdate} />

          <ContactRemindersSection
            contact={contact}
            contacts={contacts}
            reminders={reminders}
            onCreateReminder={(data) =>
              addReminder({ ...data, contactId: contact.id })
            }
            onUpdateReminder={updateReminder}
            onDeleteReminder={deleteReminder}
          />

          <ContactEventsSection
            contact={contact}
            contacts={contacts}
            events={events}
            onCreateEvent={(data) =>
              addEvent({ ...data, contactId: contact.id })
            }
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
          />

          <ContactNotesSection
            contact={contact}
            notes={notes}
            onCreateNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
        </div>
      </div>
    </section>
  );
}
