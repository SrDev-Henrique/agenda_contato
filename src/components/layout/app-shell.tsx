"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CreateContactDialog } from "@/components/contacts/create-contact-dialog";
import { AddContactFab } from "@/components/layout/add-contact-fab";
import { AppShellBreadcrumb } from "@/components/layout/app-shell-breadcrumb";
import { AppShellMobileHeader } from "@/components/layout/app-shell-mobile-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getActiveSidebarItem } from "@/components/layout/sidebar-nav";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellContent({ children }: AppShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, untaggedCount } = useContactsStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createContactOpen, setCreateContactOpen] = useState(false);

  const activeItem = getActiveSidebarItem(pathname, searchParams);
  const peopleHref = "/";

  const handleAddContact = () => {
    setCreateContactOpen(true);
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-background text-foreground">
      <AppShellMobileHeader
        activeItem={activeItem}
        peopleHref={peopleHref}
        untaggedCount={untaggedCount}
        tags={state.tags}
        navOpen={mobileNavOpen}
        onNavOpenChange={setMobileNavOpen}
        onAddContact={handleAddContact}
      />

      <AddContactFab
        navSheetOpen={mobileNavOpen}
        onAddContact={handleAddContact}
      />

      <CreateContactDialog
        open={createContactOpen}
        onOpenChange={setCreateContactOpen}
      />

      <div className="flex h-screen w-full flex-1 flex-row overflow-hidden">
        <div className="app-shell__sidebar h-full shrink-0 flex-col pb-4">
          <AppSidebar
            activeItem={activeItem}
            peopleHref={peopleHref}
            untaggedCount={untaggedCount}
            tags={state.tags}
            className="h-screen"
          />
        </div>

        <main
          className={cn(
            "flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          )}
        >
          <AppShellBreadcrumb />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      }
    >
      <AppShellContent>{children}</AppShellContent>
    </Suspense>
  );
}

export const appMainPanelClassName =
  "flex min-h-0 flex-1 flex-col overflow-hidden border border-border bg-surface text-foreground";
