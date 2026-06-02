"use client";

import { ActivityCardShell } from "@/components/events/activity-card-shell";
import {
  ActivityListItem,
  type ActivityListItemData,
} from "@/components/events/activity-list-item";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Reminder } from "@/types/reminder";

type ReminderCardProps = {
  reminder: Reminder;
  contact?: Contact;
  className?: string;
  onEdit?: (reminder: Reminder) => void;
  onDelete?: (reminder: Reminder) => void;
};

export function ReminderCard({
  reminder,
  contact,
  className,
  onEdit,
  onDelete,
}: ReminderCardProps) {
  const activity: ActivityListItemData = {
    kind: "reminder",
    id: reminder.id,
    at: reminder.scheduledAt,
    contact,
    reminder,
  };

  return (
    <ActivityCardShell className={cn(className)}>
      <ActivityListItem
        activity={activity}
        variant="timeline"
        appearance="events"
        menu={
          onEdit || onDelete
            ? {
                activityLabel: reminder.text,
                onEditReminder: onEdit,
                onDelete: onDelete ? () => onDelete(reminder) : undefined,
              }
            : undefined
        }
      />
    </ActivityCardShell>
  );
}
