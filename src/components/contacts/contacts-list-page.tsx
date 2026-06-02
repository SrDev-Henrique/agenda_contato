"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ContactsList } from "@/components/contacts/contacts-list";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { useContactListFilters } from "@/hooks/use-contact-list-filters";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { useContactsStore } from "@/store/contacts-store";
import type { Contact } from "@/types/contact";

export function ContactsListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    state,
    deleteContact,
    toggleFavorite,
    togglePinned,
    getFilteredContacts,
  } = useContactsStore();
  const { filters, setFilters, toContactFilters } = useContactListFilters();
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);

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

  const activeContactSlug = pathname.startsWith("/contato/")
    ? decodeURIComponent(pathname.replace("/contato/", ""))
    : undefined;

  const handleConfirmDelete = () => {
    if (!deletingContact) {
      return;
    }

    deleteContact(deletingContact.id);

    if (pathname === `/contato/${slugify(deletingContact.name)}`) {
      router.push("/");
    }

    setDeletingContact(null);
  };

  return (
    <>
      <ContactsList
        className="h-full overflow-y-auto max-md:h-[calc(100vh-2rem)] max-md:pb-8"
        contacts={displayedContacts}
        tags={state.tags}
        totalCount={state.contacts.length}
        activeContactSlug={activeContactSlug}
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
        onEditContact={(contact) =>
          router.push(`/contato/${slugify(contact.name)}`)
        }
        onToggleFavorite={(contact) => toggleFavorite(contact.id)}
        onTogglePin={(contact) => togglePinned(contact.id)}
        onDeleteContact={setDeletingContact}
      />

      <ConfirmDeleteDialog
        open={deletingContact !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingContact(null);
          }
        }}
        title={ui.deleteContactTitle}
        description={ui.deleteContactDescription}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
