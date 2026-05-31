"use client";

import { UpcomingActivityTimeline } from "@/components/events/upcoming-activity-timeline";
import { AppShell } from "@/components/layout/app-shell";
import { useContactsStore } from "@/store/contacts-store";

export function EventsPageClient() {
  const { state } = useContactsStore();

  return (
    <AppShell activeItem="events">
      <UpcomingActivityTimeline
        contacts={state.contacts}
        events={state.events}
        reminders={state.reminders}
        className="xl:sticky xl:top-5 xl:max-h-[calc(100vh-2.5rem)]"
      />
    </AppShell>
  );
}
