"use client";

import { ActivityListItem } from "@/components/events/activity-list-item";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Reminder } from "@/types/reminder";

type ReminderCardProps = {
  reminder: Reminder;
  contact?: Contact;
  className?: string;
  appearance?: "default" | "profile";
};

export function ReminderCard({
  reminder,
  contact,
  className,
  appearance = "default",
}: ReminderCardProps) {
  return (
    <article
      className={cn(
        appearance === "profile"
          ? "rounded-lg bg-muted/50 px-3 py-2 ring-1 ring-border"
          : "rounded-lg bg-background/80 px-2 py-1 ring-1 ring-border",
        className,
      )}
    >
      <ActivityListItem
        activity={{
          kind: "reminder",
          id: reminder.id,
          at: reminder.scheduledAt,
          contact,
          reminder,
        }}
        variant="compact"
        appearance={appearance}
        menu={
          appearance === "profile"
            ? { activityLabel: reminder.text }
            : undefined
        }
      />
    </article>
  );
}
