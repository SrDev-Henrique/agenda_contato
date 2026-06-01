"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { ContactFilters } from "@/types/app-state";

export type ContactListFiltersState = {
  favorites?: boolean;
  tag?: string;
  q?: string;
  sort: "az" | "za";
};

export function useContactListFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ContactListFiltersState>(() => {
    const sortParam = searchParams.get("sort");
    return {
      favorites: searchParams.get("favorites") === "true" ? true : undefined,
      tag: searchParams.get("tag") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      sort: sortParam === "za" ? "za" : "az",
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (partial: Partial<ContactListFiltersState>) => {
      const next = new URLSearchParams(searchParams.toString());

      if ("favorites" in partial) {
        if (partial.favorites) {
          next.set("favorites", "true");
        } else {
          next.delete("favorites");
        }
      }

      if ("tag" in partial) {
        if (partial.tag) {
          next.set("tag", partial.tag);
        } else {
          next.delete("tag");
        }
      }

      if ("q" in partial) {
        if (partial.q?.trim()) {
          next.set("q", partial.q.trim());
        } else {
          next.delete("q");
        }
      }

      if ("sort" in partial && partial.sort) {
        next.set("sort", partial.sort);
      }

      const qs = next.toString();
      const base = pathname === "/" ? "/" : pathname;
      router.replace(qs ? `${base}?${qs}` : base);
    },
    [pathname, router, searchParams],
  );

  const toContactFilters = useCallback((): ContactFilters => {
    return {
      favorites: filters.favorites,
      tagSlug: filters.tag,
      query: filters.q,
      sort: filters.sort,
    };
  }, [filters]);

  return { filters, setFilters, toContactFilters, searchParams };
}
