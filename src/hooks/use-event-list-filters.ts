"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type EventListPeriod = "week" | "all";
export type EventListKindFilter = "all" | "events" | "reminders";

export type EventListFiltersState = {
  period: EventListPeriod;
  kind: EventListKindFilter;
};

export function useEventListFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<EventListFiltersState>(() => {
    const kindParam = searchParams.get("kind");
    return {
      period: searchParams.get("week") === "current" ? "week" : "all",
      kind:
        kindParam === "events" || kindParam === "reminders"
          ? kindParam
          : "all",
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (partial: Partial<EventListFiltersState>) => {
      const next = new URLSearchParams(searchParams.toString());

      if ("period" in partial) {
        if (partial.period === "week") {
          next.set("week", "current");
        } else {
          next.delete("week");
        }
      }

      if ("kind" in partial) {
        if (partial.kind && partial.kind !== "all") {
          next.set("kind", partial.kind);
        } else {
          next.delete("kind");
        }
      }

      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  return { filters, setFilters, searchParams };
}
