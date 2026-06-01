"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { ContactsList } from "@/components/contacts/contacts-list";
import { AppShellMobileHeader } from "@/components/layout/app-shell-mobile-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getActiveSidebarItem } from "@/components/layout/sidebar-nav";
import { slugify } from "@/lib/id";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { state, deleteContact, toggleFavorite, togglePinned } =
    useContactsStore();

  const contacts = state.contacts;
  const untaggedCount = contacts.filter(
    (contact) => contact.tagIds.length === 0,
  ).length;

  const activeItem = getActiveSidebarItem(pathname);

  const peopleHref = useMemo(() => {
    const first = contacts[0];

    if (!first) {
      return "/eventos";
    }

    return `/contato/${slugify(first.name)}`;
  }, [contacts]);

  const activeContactSlug = pathname.startsWith("/contato/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : undefined;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-background text-foreground">
      <AppShellMobileHeader
        activeItem={activeItem}
        peopleHref={peopleHref}
        untaggedCount={untaggedCount}
      />

      <div className="flex h-screen w-full flex-1 flex-row overflow-hidden">
        <div className="app-shell__sidebar h-full min-w-84 pb-4 shrink-0 flex-col">
          <AppSidebar
            activeItem={activeItem}
            peopleHref={peopleHref}
            untaggedCount={untaggedCount}
            className="h-screen"
          />
        </div>

        <div className="app-shell__contacts-list h-screen flex-1 max-w-[620px] shrink-0 flex-col">
          <ContactsList
            contacts={contacts}
            tags={state.tags}
            totalCount={contacts.length}
            activeContactSlug={activeContactSlug}
            onToggleFavorite={(contact) => toggleFavorite(contact.id)}
            onTogglePin={(contact) => togglePinned(contact.id)}
            onDeleteContact={(contact) => deleteContact(contact.id)}
          />
        </div>

        <main
          className={cn(
            "flex h-screen pt-2 pe-2 overflow-y-auto min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export const appMainPanelClassName =
  "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-border bg-surface text-foreground xl:max-h-full";
