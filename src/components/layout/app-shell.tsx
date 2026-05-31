"use client";

import { ContactsList } from "@/components/contacts/contacts-list";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

type AppShellProps = {
  activeItem?: "people" | "businesses" | "favorites" | "tags" | "events";
  children: React.ReactNode;
  className?: string;
  contactsListClassName?: string;
};

export function AppShell({
  activeItem = "people",
  children,
  className,
  contactsListClassName,
}: AppShellProps) {
  const { state, deleteContact, toggleFavorite, togglePinned } =
    useContactsStore();
  const contacts = state.contacts;
  const untaggedCount = contacts.filter(
    (contact) => contact.tagIds.length === 0,
  ).length;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground md:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto grid w-full max-w-[1360px] gap-4 lg:grid-cols-[210px_minmax(360px,0.95fr)] xl:grid-cols-[210px_minmax(390px,0.95fr)_minmax(460px,1.15fr)]",
          className,
        )}
      >
        <AppSidebar
          activeItem={activeItem}
          untaggedCount={untaggedCount}
          className="h-auto min-h-[calc(100vh-2.5rem)] w-full lg:sticky lg:top-5"
        />

        <ContactsList
          className={cn("min-h-[calc(100vh-2.5rem)]", contactsListClassName)}
          contacts={contacts}
          tags={state.tags}
          totalCount={contacts.length}
          onToggleFavorite={(contact) => toggleFavorite(contact.id)}
          onTogglePin={(contact) => togglePinned(contact.id)}
          onDeleteContact={(contact) => deleteContact(contact.id)}
        />

        {children}
      </div>
    </main>
  );
}
