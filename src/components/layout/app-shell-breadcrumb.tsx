"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useMemo } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { useContactsStore } from "@/store/contacts-store";

type Crumb =
  | { type: "link"; label: string; href: string }
  | { type: "page"; label: string };

export function AppShellBreadcrumb() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state } = useContactsStore();

  const crumbs = useMemo(
    () => buildCrumbs(pathname, searchParams, state),
    [pathname, searchParams, state],
  );

  return (
    <div className="shrink-0 border-border/60 border-b bg-accent-muted/50 px-4 py-3 md:px-5">
      <Breadcrumb aria-label={ui.breadcrumbNav}>
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <Fragment key={`${crumb.label}-${index.toString()}`}>
                {index > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {crumb.type === "link" && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function buildCrumbs(
  pathname: string,
  searchParams: URLSearchParams,
  state: {
    contacts: Array<{ id: string; name: string }>;
    tags: Array<{ slug: string; name: string }>;
  },
): Crumb[] {
  if (pathname.startsWith("/eventos")) {
    const week = searchParams.get("week") === "current";
    const kind = searchParams.get("kind");

    if (!week && !kind) {
      return [{ type: "page", label: ui.navEvents }];
    }

    const crumbs: Crumb[] = [
      { type: "link", label: ui.navEvents, href: "/eventos" },
    ];

    if (week && kind === "reminders") {
      crumbs.push({
        type: "page",
        label: `${ui.thisWeek} — ${ui.reminders}`,
      });
    } else if (week && kind === "events") {
      crumbs.push({
        type: "page",
        label: `${ui.thisWeek} — ${ui.navEvents}`,
      });
    } else if (week) {
      crumbs.push({ type: "page", label: ui.thisWeek });
    } else if (kind === "reminders") {
      crumbs.push({ type: "page", label: ui.reminders });
    } else if (kind === "events") {
      crumbs.push({ type: "page", label: ui.navEvents });
    }

    return crumbs;
  }

  if (pathname.startsWith("/contato/")) {
    const slug = decodeURIComponent(pathname.split("/")[2] ?? "");
    const contact = state.contacts.find((item) => slugify(item.name) === slug);
    const contactName = contact?.name ?? slug;

    return [
      { type: "link", label: ui.navAllPeople, href: "/" },
      { type: "page", label: contactName },
    ];
  }

  if (pathname === "/") {
    const favorites = searchParams.get("favorites") === "true";
    const tagSlug = searchParams.get("tag");

    if (favorites) {
      return [
        { type: "link", label: ui.navAllPeople, href: "/" },
        { type: "page", label: ui.navFavorites },
      ];
    }

    if (tagSlug) {
      const tag = state.tags.find((item) => item.slug === tagSlug);
      return [
        { type: "link", label: ui.navAllPeople, href: "/" },
        { type: "page", label: tag?.name ?? tagSlug },
      ];
    }

    return [{ type: "page", label: ui.navAllPeople }];
  }

  return [{ type: "page", label: ui.navAllPeople }];
}
