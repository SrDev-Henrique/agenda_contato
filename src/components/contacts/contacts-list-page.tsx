"use client";

import { useMemo, useState } from "react";

import { ContactsList } from "@/components/contacts/contacts-list";
import { useContactListFilters } from "@/hooks/use-contact-list-filters";
import { useContactsStore } from "@/store/contacts-store";

export function ContactsListPage() {
  const {
    state,
    deleteContact,
    toggleFavorite,
    togglePinned,
    getFilteredContacts,
  } = useContactsStore();
  const { filters, setFilters, toContactFilters } = useContactListFilters();
  const [pinnedOnly, setPinnedOnly] = useState(false);

  const baseContacts = useMemo(
    () => getFilteredContacts(toContactFilters()),
    [getFilteredContacts, toContactFilters],
  );

  const displayedContacts = useMemo(() => {
    if (pinnedOnly) {
      return baseContacts.filter((contact) => contact.pinned);
    }
    return baseContacts;
  }, [baseContacts, pinnedOnly]);

  const listFilter = pinnedOnly
    ? "pinned"
    : filters.favorites
      ? "favorites"
      : "all";

  return (
    <ContactsList
      className="h-full overflow-y-auto max-md:h-[calc(100vh-2rem)] max-md:pb-8"
      contacts={displayedContacts}
      tags={state.tags}
      totalCount={state.contacts.length}
      filter={listFilter}
      sort={filters.sort}
      onFilterChange={(value) => {
        if (value === "pinned") {
          setPinnedOnly(true);
          setFilters({ favorites: undefined, tag: undefined });
          return;
        }
        setPinnedOnly(false);
        if (value === "favorites") {
          setFilters({ favorites: true, tag: undefined });
        } else {
          setFilters({ favorites: undefined, tag: undefined });
        }
      }}
      onSortChange={(sort) => setFilters({ sort })}
    />
  );
}
