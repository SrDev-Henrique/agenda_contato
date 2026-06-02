"use client";

import { BellIcon } from "lucide-react";

import {
  ActivityListItem,
  toActivityListItemFromToday,
} from "@/components/events/activity-list-item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useTodayNotifications } from "@/hooks/use-today-notifications";
import { ui } from "@/lib/i18n/pt-br";
import { slugify } from "@/lib/id";
import { getActivityReadKey, type TodayActivity } from "@/lib/selectors";

type NotificationsProps = {
  previewActivities?: TodayActivity[];
};

export function Notifications({ previewActivities }: NotificationsProps) {
  const { activities, pendingCount, markRead, markAllRead, isRead } =
    useTodayNotifications(previewActivities);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label={ui.notificationsOpen}
          className="relative"
          size="icon"
          variant="muted"
        >
          <BellIcon aria-hidden="true" />
          {pendingCount > 0 ? (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {pendingCount > 99 ? "99+" : pendingCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="me-4 h-fit max-h-[calc(100vh-10rem)] w-88 overflow-y-auto bg-card p-1"
      >
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-card-foreground text-sm">
            {ui.notificationsTitle}
          </div>
          {pendingCount > 0 ? (
            <button
              className="font-medium text-foreground-muted text-xs hover:text-foreground hover:underline"
              onClick={markAllRead}
              type="button"
            >
              {ui.notificationsMarkAllRead}
            </button>
          ) : null}
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col divide-y divide-border/60 px-1">
          {activities.length === 0 ? (
            <p className="px-3 py-6 text-center text-foreground-muted text-sm">
              {ui.notificationsEmptyToday}
            </p>
          ) : (
            activities.map((activity) => {
              const readKey = getActivityReadKey(activity);
              const unread = !isRead(readKey);
              const href = getActivityHref(activity);

              return (
                <ActivityListItem
                  key={readKey}
                  activity={toActivityListItemFromToday(activity)}
                  variant="compact"
                  unread={unread}
                  href={href}
                  onPress={() => markRead(readKey)}
                  className="px-2"
                />
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function getActivityHref(activity: TodayActivity): string | undefined {
  if (activity.contact) {
    return `/contato/${slugify(activity.contact.name)}`;
  }

  if (activity.kind === "event") {
    return "/eventos";
  }

  return undefined;
}
