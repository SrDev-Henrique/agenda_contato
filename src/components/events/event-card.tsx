"use client";

import { ActivityCardShell } from "@/components/events/activity-card-shell";
import {
  ActivityListItem,
  type ActivityListItemData,
} from "@/components/events/activity-list-item";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  contact?: Contact;
  attendees?: Contact[];
  className?: string;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
};

export function EventCard({
  event,
  contact,
  attendees = [],
  className,
  onEdit,
  onDelete,
}: EventCardProps) {
  const activity: ActivityListItemData = {
    kind: "event",
    id: event.id,
    at: event.startsAt,
    contact,
    attendees,
    event,
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
                activityLabel: event.title,
                onEditEvent: onEdit,
                onDelete: onDelete ? () => onDelete(event) : undefined,
              }
            : undefined
        }
      />
    </ActivityCardShell>
  );
}
