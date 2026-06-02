"use client";

import { Grid2X2, List } from "lucide-react";
import { motion, type Variants } from "motion/react";
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
import { useShouldAnimateOnKeyChange } from "@/hooks/use-previous";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { useAppMotion } from "@/lib/motion";
import { groupContactsByLetter } from "@/lib/selectors";
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
  activeContactSlug?: string;
  className?: string;
  defaultView?: ContactsListView;
  filter?: ContactsListFilter;
  sort?: ContactsListSort;
  onFilterChange?: (filter: ContactsListFilter) => void;
  onSortChange?: (sort: ContactsListSort) => void;
  onEditContact?: (contact: Contact) => void;
  onToggleFavorite?: (contact: Contact) => void;
  onTogglePin?: (contact: Contact) => void;
  onDeleteContact?: (contact: Contact) => void;
};

export function ContactsList({
  contacts,
  tags,
  totalCount = contacts.length,
  activeContactSlug,
  className,
  defaultView = "list",
  filter: filterProp,
  sort: sortProp,
  onFilterChange,
  onSortChange,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: ContactsListProps) {
  const [view, setView] = useState<ContactsListView>(defaultView);
  const [internalFilter, setInternalFilter] =
    useState<ContactsListFilter>("all");
  const [internalSort, setInternalSort] = useState<ContactsListSort>("az");

  const filter = filterProp ?? internalFilter;
  const sort = sortProp ?? internalSort;

  const handleFilterChange = (value: ContactsListFilter) => {
    if (onFilterChange) {
      onFilterChange(value);
    } else {
      setInternalFilter(value);
    }
  };

  const handleSortChange = (value: ContactsListSort) => {
    if (onSortChange) {
      onSortChange(value);
    } else {
      setInternalSort(value);
    }
  };

  const visibleContacts = useMemo(() => {
    let filteredContacts = contacts;

    if (!onFilterChange) {
      filteredContacts = contacts.filter((contact) => {
        if (filter === "favorites") {
          return contact.favorite;
        }

        if (filter === "pinned") {
          return contact.pinned;
        }

        return true;
      });
    }

    return [...filteredContacts].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, "pt-BR", {
        sensitivity: "base",
      });

      return sort === "az" ? comparison : -comparison;
    });
  }, [contacts, filter, sort, onFilterChange]);

  const pinnedContacts = visibleContacts.filter((contact) => contact.pinned);
  const unpinnedContacts = visibleContacts.filter((contact) => !contact.pinned);
  const groupedContacts = groupContactsByLetter(unpinnedContacts);
  const listAnimationKey = `${filter}-${sort}-${view}`;
  const shouldStaggerList = useShouldAnimateOnKeyChange(listAnimationKey);

  return (
    <section
      className={cn(
        "flex h-full min-h-0 w-full flex-col bg-background p-4 text-foreground",
        className,
      )}
    >
      <header className="flex flex-col gap-4 border-border border-b pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium text-[0.65rem] text-foreground-subtle uppercase tracking-wide">
              {ui.totalContacts(totalCount)}
            </p>
            <h2 className="mt-1 text-foreground">{ui.contacts}</h2>
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
            onValueChange={(value) =>
              handleFilterChange(value as ContactsListFilter)
            }
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
            onValueChange={(value) =>
              handleSortChange(value as ContactsListSort)
            }
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
            <p className="font-medium text-foreground text-sm">
              {ui.noContacts}
            </p>
            <p className="mt-1 max-w-xs text-foreground-muted text-xs leading-5">
              {ui.noContactsHint}
            </p>
          </div>
        ) : view === "grid" ? (
          <ContactsGrid
            key={listAnimationKey}
            contacts={visibleContacts}
            tags={tags}
            activeContactSlug={activeContactSlug}
            animate={shouldStaggerList}
            onEditContact={onEditContact}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDeleteContact={onDeleteContact}
          />
        ) : (
          <ContactsListGroups
            key={listAnimationKey}
            pinnedContacts={pinnedContacts}
            groupedContacts={groupedContacts}
            tags={tags}
            activeContactSlug={activeContactSlug}
            animate={shouldStaggerList}
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
  activeContactSlug,
  animate = true,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: {
  pinnedContacts: Contact[];
  groupedContacts: Map<string, Contact[]>;
  tags: Tag[];
  activeContactSlug?: string;
  animate?: boolean;
} & Pick<
  ContactsListProps,
  "onEditContact" | "onToggleFavorite" | "onTogglePin" | "onDeleteContact"
>) {
  const { staggerContainer, staggerItem } = useAppMotion();

  return (
    <motion.div
      className="h-full overflow-y-auto pt-3"
      variants={staggerContainer}
      initial={animate ? "initial" : false}
      animate="animate"
    >
      {pinnedContacts.length > 0 ? (
        <ContactSection
          title={ui.pinned}
          contacts={pinnedContacts}
          tags={tags}
          activeContactSlug={activeContactSlug}
          staggerItem={staggerItem}
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
          activeContactSlug={activeContactSlug}
          staggerItem={staggerItem}
          onEditContact={onEditContact}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
          onDeleteContact={onDeleteContact}
        />
      ))}
    </motion.div>
  );
}

function ContactSection({
  title,
  contacts,
  tags,
  activeContactSlug,
  staggerItem,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: {
  title: string;
  contacts: Contact[];
  tags: Tag[];
  activeContactSlug?: string;
  staggerItem: Variants;
} & Pick<
  ContactsListProps,
  "onEditContact" | "onToggleFavorite" | "onTogglePin" | "onDeleteContact"
>) {
  return (
    <section className="mb-3 last:mb-0">
      <h3 className="px-3 pb-1.5 font-inter font-semibold text-[0.65rem] text-foreground-subtle uppercase tracking-wide">
        {title}
      </h3>
      <div>
        {contacts.map((contact) => (
          <motion.div key={contact.id} variants={staggerItem}>
            <ContactRow
              contact={contact}
              active={
                activeContactSlug !== undefined &&
                slugify(contact.name) === activeContactSlug
              }
              tag={getPrimaryTag(tags, contact)}
              onEdit={onEditContact}
              onToggleFavorite={onToggleFavorite}
              onTogglePin={onTogglePin}
              onDelete={onDeleteContact}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ContactsGrid({
  contacts,
  tags,
  activeContactSlug,
  animate = true,
  onEditContact,
  onToggleFavorite,
  onTogglePin,
  onDeleteContact,
}: {
  contacts: Contact[];
  tags: Tag[];
  activeContactSlug?: string;
  animate?: boolean;
} & Pick<
  ContactsListProps,
  "onEditContact" | "onToggleFavorite" | "onTogglePin" | "onDeleteContact"
>) {
  const { staggerContainer, staggerItem } = useAppMotion();

  return (
    <motion.div
      className="grid gap-3 overflow-y-auto pt-4 sm:grid-cols-2 xl:grid-cols-3"
      variants={staggerContainer}
      initial={animate ? "initial" : false}
      animate="animate"
    >
      {contacts.map((contact) => (
        <motion.div key={contact.id} variants={staggerItem}>
          <ContactRow
            contact={contact}
            active={
              activeContactSlug !== undefined &&
              slugify(contact.name) === activeContactSlug
            }
            tag={getPrimaryTag(tags, contact)}
            variant="grid"
            onEdit={onEditContact}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
            onDelete={onDeleteContact}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function getPrimaryTag(tags: Tag[], contact: Contact) {
  return tags.find((tag) => contact.tagIds.includes(tag.id));
}
