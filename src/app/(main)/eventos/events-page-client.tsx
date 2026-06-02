"use client";

import { UpcomingActivityTimeline } from "@/components/events/upcoming-activity-timeline";
import { appMainPanelClassName } from "@/components/layout/app-shell";
import { useEventListFilters } from "@/hooks/use-event-list-filters";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

export function EventsPageClient() {
  const {
    state,
    addEvent,
    addReminder,
    updateEvent,
    updateReminder,
    deleteEvent,
    deleteReminder,
  } = useContactsStore();
  const { filters, setFilters } = useEventListFilters();

  return (
    <UpcomingActivityTimeline
      contacts={state.contacts}
      events={state.events}
      reminders={state.reminders}
      className={cn(appMainPanelClassName, "p-4 md:p-5")}
      period={filters.period}
      kindFilter={filters.kind}
      onPeriodChange={(period) => setFilters({ period })}
      onKindFilterChange={(kind) => setFilters({ kind })}
      onCreateEvent={addEvent}
      onCreateReminder={addReminder}
      onUpdateEvent={updateEvent}
      onUpdateReminder={updateReminder}
      onDeleteEvent={deleteEvent}
      onDeleteReminder={deleteReminder}
    />
  );
}
