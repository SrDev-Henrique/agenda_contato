"use client";

import { Grid2X2, List } from "lucide-react";
import { useMemo, useState } from "react";

import { ContactRow } from "@/components/contacts/contact-row";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { groupContactsByLetter } from "@/lib/selectors";
import { ui } from "@/lib/i18n/pt-br";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Tag } from "@/types/tag";

type ContactsListView = "list" | "grid";
type ContactsListFilter = "all" | "favorites" | "pinned";
type ContactsListSort = "az" | "za";

type ContactsListProps = {
  contacts: Contact[];
  tags: Tag[];
  totalCount?: number;
  className?: string;
  defaultView?: ContactsListView;
  onEditContact?: (contact: Contact) => void;
  onToggleFavorite?: (contact: Contact) => void;
  onTogglePin?: (contact: Contact) => void;
  onDeleteContact?: (contact: Contact) => void;
};

export function ContactsList({
  contacts,
  tags,
  totalCount = contacts.length,
  className,
  defaultView = "list",
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: ContactsListProps) {
  const [view, setView] = useState<ContactsListView>(defaultView);
  const [filter, setFilter] = useState<ContactsListFilter>("all");
  const [sort, setSort] = useState<ContactsListSort>("az");

  const visibleContacts = useMemo(() => {
    const filteredContacts = contacts.filter((contact) => {
      if (filter === "favorites") {
        return contact.favorite;
      }

      if (filter === "pinned") {
        return contact.pinned;
      }

      return true;
    });

    return [...filteredContacts].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, "pt-BR", {
        sensitivity: "base",
      });

      return sort === "az" ? comparison : -comparison;
    });
  }, [contacts, filter, sort]);

  const pinnedContacts = visibleContacts.filter((contact) => contact.pinned);
  const unpinnedContacts = visibleContacts.filter((contact) => !contact.pinned);
  const groupedContacts = groupContactsByLetter(unpinnedContacts);

  return (
    <section
      className={cn(
        "flex min-h-[560px] w-full flex-col rounded-[28px] border border-border bg-background p-4 text-foreground shadow-2xl shadow-black/25",
        className,
      )}
    >
      <header className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-medium uppercase tracking-wide text-foreground-subtle">
              {ui.totalContacts(totalCount)}
            </p>
            <h2 className="mt-1 font-inter text-xl font-semibold leading-none text-foreground">
              {ui.contacts}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <Button
              aria-label={ui.listView}
              aria-current={view === "list" ? "true" : undefined}
              size="icon-sm"
              variant="ghost"
              onClick={() => setView("list")}
            >
              <List />
            </Button>
            <Button
              aria-label={ui.gridView}
              aria-current={view === "grid" ? "true" : undefined}
              size="icon-sm"
              variant="ghost"
              onClick={() => setView("grid")}
            >
              <Grid2X2 />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as ContactsListFilter)}
          >
            <SelectTrigger size="sm">
              <SelectValue aria-label={ui.filterBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{ui.allContacts}</SelectItem>
              <SelectItem value="favorites">{ui.navFavorites}</SelectItem>
              <SelectItem value="pinned">{ui.pinned}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as ContactsListSort)}
          >
            <SelectTrigger size="sm">
              <SelectValue aria-label={sort === "az" ? ui.sortAz : ui.sortZa} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="az">{ui.sortAz}</SelectItem>
              <SelectItem value="za">{ui.sortZa}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        {visibleContacts.length === 0 ? (
          <div className="flex h-full min-h-72 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-foreground">
              {ui.noContacts}
            </p>
            <p className="mt-1 max-w-xs text-xs leading-5 text-foreground-muted">
              {ui.noContactsHint}
            </p>
          </div>
        ) : view === "grid" ? (
          <ContactsGrid
            contacts={visibleContacts}
            tags={tags}
            onEditContact={onEditContact}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDeleteContact={onDeleteContact}
          />
        ) : (
          <ContactsListGroups
            pinnedContacts={pinnedContacts}
            groupedContacts={groupedContacts}
            tags={tags}
            onEditContact={onEditContact}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDeleteContact={onDeleteContact}
          />
        )}
      </div>
    </section>
  );
}

function ContactsListGroups({
  pinnedContacts,
  groupedContacts,
  tags,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: {
  pinnedContacts: Contact[];
  groupedContacts: Map<string, Contact[]>;
  tags: Tag[];
} & Pick<
  ContactsListProps,
  "onEditContact" | "onToggleFavorite" | "onTogglePin" | "onDeleteContact"
>) {
  return (
    <div className="h-full overflow-y-auto pt-3">
      {pinnedContacts.length > 0 ? (
        <ContactSection
          title={ui.pinned}
          contacts={pinnedContacts}
          tags={tags}
          onEditContact={onEditContact}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
          onDeleteContact={onDeleteContact}
        />
      ) : null}

      {[...groupedContacts.entries()].map(([letter, contacts]) => (
        <ContactSection
          key={letter}
          title={letter}
          contacts={contacts}
          tags={tags}
          onEditContact={onEditContact}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
          onDeleteContact={onDeleteContact}
        />
      ))}
    </div>
  );
}

function ContactSection({
  title,
  contacts,
  tags,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: {
  title: string;
  contacts: Contact[];
  tags: Tag[];
} & Pick<
  ContactsListProps,
  "onEditContact" | "onToggleFavorite" | "onTogglePin" | "onDeleteContact"
>) {
  return (
    <section className="mb-3 last:mb-0">
      <h3 className="px-3 pb-1.5 font-inter text-[0.65rem] font-semibold uppercase tracking-wide text-foreground-subtle">
        {title}
      </h3>
      <div>
        {contacts.map((contact) => (
          <ContactRow
            key={contact.id}
            contact={contact}
            tag={getPrimaryTag(tags, contact)}
            onEdit={onEditContact}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDelete={onDeleteContact}
          />
        ))}
      </div>
    </section>
  );
}

function ContactsGrid({
  contacts,
  tags,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: {
  contacts: Contact[];
  tags: Tag[];
} & Pick<
  ContactsListProps,
  "onEditContact" | "onToggleFavorite" | "onTogglePin" | "onDeleteContact"
>) {
  return (
    <div className="grid gap-3 overflow-y-auto pt-4 sm:grid-cols-2 xl:grid-cols-3">
      {contacts.map((contact) => (
        <ContactRow
          key={contact.id}
          contact={contact}
          tag={getPrimaryTag(tags, contact)}
          variant="grid"
          onEdit={onEditContact}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
          onDelete={onDeleteContact}
        />
      ))}
    </div>
  );
}

function getPrimaryTag(tags: Tag[], contact: Contact) {
  return tags.find((tag) => contact.tagIds.includes(tag.id));
}
