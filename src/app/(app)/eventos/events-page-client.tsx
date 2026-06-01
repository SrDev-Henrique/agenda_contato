"use client";

import { UpcomingActivityTimeline } from "@/components/events/upcoming-activity-timeline";
import { appMainPanelClassName } from "@/components/layout/app-shell";
import { cn } from "@/lib/utils";
import { useContactsStore } from "@/store/contacts-store";

export function EventsPageClient() {
  const { state } = useContactsStore();

  return (
    <UpcomingActivityTimeline
      contacts={state.contacts}
      events={state.events}
      reminders={state.reminders}
      className={cn(appMainPanelClassName, "p-4 md:p-5")}
    />
  );
}
