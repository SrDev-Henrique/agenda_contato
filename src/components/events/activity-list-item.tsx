"use client";

import {
  Bell,
  CalendarDays,
  Gift,
  Phone,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ItemOptionsMenu } from "@/components/ui/item-options-menu";
import {
  formatActivityTimestamp,
  formatDateBadge,
  formatEventTimeRange,
  getActivityIconKind,
  getEventActionLabel,
  getReminderActionLabel,
  isCalendarStyleEvent,
  shouldShowEventDetailCard,
} from "@/lib/activity-display";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import type { TodayActivity } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import type { Contact } from "@/types/contact";
import type { Event } from "@/types/event";
import type { Reminder } from "@/types/reminder";

export type ActivityListItemData = {
  kind: "event" | "reminder";
  id: string;
  at: string;
  contact?: Contact;
  attendees?: Contact[];
  event?: Event;
  reminder?: Reminder;
};

type ActivityListItemProps = {
  activity: ActivityListItemData;
  variant?: "timeline" | "compact";
  appearance?: "default" | "profile" | "events";
  unread?: boolean;
  className?: string;
  onPress?: () => void;
  href?: string;
  menu?: {
    activityLabel: string;
    onEditEvent?: (event: Event) => void;
    onEditReminder?: (reminder: Reminder) => void;
    onDelete?: () => void;
  };
};

export function ActivityListItem({
  activity,
  variant = "timeline",
  appearance = "default",
  unread = false,
  className,
  onPress,
  href,
  menu,
}: ActivityListItemProps) {
  const isCompact = variant === "compact";
  const isProfile = appearance === "profile";
  const isEvents = appearance === "events";
  const useDateBadge =
    activity.kind === "event" &&
    activity.event &&
    isCalendarStyleEvent(activity.event);

  const iconKind = getActivityIconKind(
    activity.kind,
    activity.event,
    activity.reminder?.text,
  );

  const timestamp = formatActivityTimestamp(activity.at);
  const actionLabel = getActionLabel(activity);
  const inlineText = isProfile
    ? getProfileInlineText(activity)
    : getInlineText(activity);
  const showDetailCard =
    activity.kind === "event" &&
    activity.event &&
    shouldShowEventDetailCard(activity.event);

  const menuOnEdit = menu ? getActivityMenuEditHandler(activity, menu) : undefined;

  const row = (
    <div
      className={cn(
        "group relative flex gap-3",
        isCompact && !isProfile ? "items-start py-2" : "items-center",
        isProfile && "py-0",
        unread && "rounded-lg bg-primary/5",
        className,
      )}
    >
      {unread ? (
        <span
          aria-hidden
          className="absolute top-3 -left-1 size-1.5 rounded-full bg-accent"
        />
      ) : null}

      {useDateBadge ? (
        <DateBadge at={activity.at} compact={isCompact} elevated={isEvents} />
      ) : isProfile && activity.kind === "reminder" ? null : (
        <ActivityIconRing
          kind={iconKind}
          compact={isCompact}
          elevated={isEvents}
        />
      )}

      <div className="min-w-0 flex-1 space-y-2">
        <div
          className={cn(
            "flex gap-2",
            isCompact && !isProfile ? "flex-col" : "flex-wrap items-center",
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {!useDateBadge ? (
              <span
                className={cn(
                  isEvents ? "text-foreground-soft" : "text-foreground-muted",
                )}
              >
                {actionLabel}
              </span>
            ) : null}

            {activity.contact && !useDateBadge ? (
              <ContactLink
                contact={activity.contact}
                accent={isProfile || isEvents}
              />
            ) : null}

            {inlineText ? (
              <span
                className={cn(
                  "min-w-0 text-foreground",
                  (isEvents || useDateBadge) && "font-medium",
                  isProfile && "text-foreground-muted",
                )}
              >
                {inlineText}
              </span>
            ) : null}
          </div>

          <div
            className={cn(
              "flex shrink-0 items-center gap-1",
              isCompact && !isProfile && "w-full justify-between",
            )}
          >
            <time
              className={cn(
                "whitespace-nowrap rounded-md px-2 py-1 text-xs",
                isEvents
                  ? "border border-border/80 bg-card text-foreground-soft"
                  : "bg-muted text-foreground-muted",
              )}
            >
              {timestamp}
            </time>
            {menu &&
            (menu.onEditEvent ||
              menu.onEditReminder ||
              menu.onDelete) ? (
              <ItemOptionsMenu
                label={menu.activityLabel}
                editLabel={
                  activity.kind === "event" ? ui.editEvent : ui.edit
                }
                onEdit={menuOnEdit}
                onDelete={menu.onDelete}
              />
            ) : null}
          </div>
        </div>

        {activity.kind === "event" && activity.event && showDetailCard ? (
          <EventDetailCard
            event={activity.event}
            attendees={activity.attendees ?? []}
            elevated={isEvents}
          />
        ) : null}

        {activity.kind === "event" &&
        activity.event &&
        useDateBadge &&
        !showDetailCard ? (
          <CalendarEventMeta
            event={activity.event}
            attendees={activity.attendees ?? []}
            elevated={isEvents}
          />
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        className="block rounded-lg transition-colors hover:bg-accent/10"
        href={href}
        onClick={onPress}
      >
        {row}
      </Link>
    );
  }

  if (onPress) {
    return (
      <button
        className="block w-full rounded-lg text-left transition-colors hover:bg-muted/60"
        onClick={onPress}
        type="button"
      >
        {row}
      </button>
    );
  }

  return row;
}

function DateBadge({
  at,
  compact,
  elevated,
}: {
  at: string;
  compact?: boolean;
  elevated?: boolean;
}) {
  const { month, day } = formatDateBadge(at);

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-lg text-center ring-1",
        elevated
          ? "bg-card text-foreground ring-border/80"
          : "bg-muted text-center ring-border",
        compact ? "size-10" : "size-11",
      )}
    >
      <span
        className={cn(
          "font-semibold text-[10px] leading-none tracking-wide",
          elevated ? "text-foreground-muted" : "text-foreground-muted",
        )}
      >
        {month}
      </span>
      <span className="font-semibold text-foreground text-sm leading-tight">
        {day}
      </span>
    </div>
  );
}

function ActivityIconRing({
  kind,
  compact,
  elevated,
}: {
  kind: ReturnType<typeof getActivityIconKind>;
  compact?: boolean;
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full ring-1",
        elevated
          ? "bg-card text-foreground-soft ring-border/80"
          : "bg-muted text-foreground-muted ring-border",
        compact ? "size-9" : "size-8",
      )}
    >
      <ActivityIcon kind={kind} />
    </div>
  );
}

function ActivityIcon({
  kind,
}: {
  kind: ReturnType<typeof getActivityIconKind>;
}) {
  const className = "size-4";

  switch (kind) {
    case "phone":
      return <Phone className={className} aria-hidden />;
    case "video":
      return <Video className={className} aria-hidden />;
    case "gift":
      return <Gift className={className} aria-hidden />;
    case "bell":
      return <Bell className={className} aria-hidden />;
    case "calendar":
      return <CalendarDays className={className} aria-hidden />;
    default:
      return <Users className={className} aria-hidden />;
  }
}

function ContactLink({
  contact,
  accent = false,
}: {
  contact: Contact;
  accent?: boolean;
}) {
  return (
    <Link
      href={`/contato/${slugify(contact.name)}`}
      className={cn(
        "inline-flex max-w-full items-center gap-2 hover:underline",
        accent ? "text-accent" : "text-primary",
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <Avatar className="size-6">
        {contact.avatarUrl ? (
          <AvatarImage src={contact.avatarUrl} alt={contact.name} />
        ) : null}
        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
      </Avatar>
      <span className="truncate font-medium">{contact.name}</span>
    </Link>
  );
}

function EventDetailCard({
  event,
  attendees,
  elevated,
}: {
  event: Event;
  attendees: Contact[];
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 ring-1",
        elevated
          ? "border border-border/60 bg-card shadow-sm"
          : "bg-background/80 ring-border",
      )}
    >
      <p className="font-medium text-foreground text-sm">{event.title}</p>
      {event.description ? (
        <p
          className={cn(
            "mt-1.5 text-xs leading-5",
            elevated ? "text-foreground-soft" : "text-foreground-muted",
          )}
        >
          {event.description}
        </p>
      ) : null}
      {attendees.length > 0 ? (
        <AttendeeStack attendees={attendees} className="mt-3" />
      ) : null}
    </div>
  );
}

function CalendarEventMeta({
  event,
  attendees,
  elevated,
}: {
  event: Event;
  attendees: Contact[];
  elevated?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p
        className={cn(
          "text-xs",
          elevated ? "text-foreground-soft" : "text-foreground-muted",
        )}
      >
        {formatEventTimeRange(event.startsAt)}
      </p>
      {attendees.length > 0 ? <AttendeeStack attendees={attendees} /> : null}
    </div>
  );
}

function AttendeeStack({
  attendees,
  className,
}: {
  attendees: Contact[];
  className?: string;
}) {
  const visible = attendees.slice(0, 3);
  const extra = attendees.length - visible.length;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex -space-x-2">
        {visible.map((attendee) => (
          <Avatar key={attendee.id} className="size-6 border-2 border-card">
            {attendee.avatarUrl ? (
              <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
            ) : null}
            <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      {extra > 0 ? (
        <span className="text-foreground-muted text-xs">+{extra}</span>
      ) : null}
    </div>
  );
}

function getActivityMenuEditHandler(
  activity: ActivityListItemData,
  menu: NonNullable<ActivityListItemProps["menu"]>,
): (() => void) | undefined {
  if (activity.kind === "event" && activity.event && menu.onEditEvent) {
    const event = activity.event;
    const onEditEvent = menu.onEditEvent;
    return () => onEditEvent(event);
  }

  if (
    activity.kind === "reminder" &&
    activity.reminder &&
    menu.onEditReminder
  ) {
    const reminder = activity.reminder;
    const onEditReminder = menu.onEditReminder;
    return () => onEditReminder(reminder);
  }

  return undefined;
}

function getActionLabel(activity: ActivityListItemData) {
  if (activity.kind === "reminder" && activity.reminder) {
    return getReminderActionLabel(activity.reminder.text);
  }

  if (activity.kind === "event" && activity.event) {
    return getEventActionLabel(activity.event);
  }

  return ui.reminder;
}

function getProfileInlineText(activity: ActivityListItemData) {
  if (activity.kind === "reminder" && activity.reminder) {
    return activity.reminder.text;
  }

  if (activity.kind === "event" && activity.event) {
    return activity.event.description ?? activity.event.title;
  }

  return null;
}

function getInlineText(activity: ActivityListItemData) {
  if (activity.kind === "reminder" && activity.reminder) {
    if (looksLikeCongratulateOrCall(activity.reminder.text)) {
      return null;
    }
    return activity.reminder.text;
  }

  if (activity.kind === "event" && activity.event) {
    if (isCalendarStyleEvent(activity.event)) {
      return activity.event.title;
    }

    if (activity.event.description) {
      return activity.event.description;
    }

    return activity.event.title;
  }

  return null;
}

function looksLikeCongratulateOrCall(text: string) {
  const lower = text.toLowerCase();
  return (
    lower.includes("lig") || lower.includes("sentir") || lower.includes("falta")
  );
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "A";
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function toActivityListItemFromToday(
  activity: TodayActivity,
): ActivityListItemData {
  if (activity.kind === "event") {
    return {
      kind: "event",
      id: activity.id,
      at: activity.at,
      contact: activity.contact,
      event: activity.event,
    };
  }

  return {
    kind: "reminder",
    id: activity.id,
    at: activity.at,
    contact: activity.contact,
    reminder: activity.reminder,
  };
}
