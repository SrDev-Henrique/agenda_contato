"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

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

  const activeItem = getActiveSidebarItem(pathname, searchParams);
  const peopleHref = "/";

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-background text-foreground">
      <AppShellMobileHeader
        activeItem={activeItem}
        peopleHref={peopleHref}
        untaggedCount={untaggedCount}
        tags={state.tags}
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
            "flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden py-2 pe-2",
          )}
        >
          <AppShellBreadcrumb />
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
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
  "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-border bg-surface text-foreground shadow-2xl shadow-black/25";
