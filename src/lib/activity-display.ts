import { eventTypeLabels, ui } from "@/lib/i18n/pt-br";
import type { Event } from "@/types/event";

export function isFullDayDate(value: string) {
  const date = new Date(value);
  return date.getHours() === 0 && date.getMinutes() === 0;
}

export function formatActivityTimestamp(value: string) {
  const date = new Date(value);

  if (isFullDayDate(value)) {
    const dayMonth = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);
    return `${dayMonth}, ${ui.activityFullDay}`;
  }

  const dayMonth = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${dayMonth}, ${time}`;
}

export function formatDateBadge(value: string) {
  const date = new Date(value);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date)
    .replace(/\./g, "")
    .slice(0, 3)
    .toUpperCase();
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);

  return { month, day };
}

export function formatEventTimeRange(startsAt: string) {
  const start = new Date(startsAt);
  if (isFullDayDate(startsAt)) {
    return ui.activityFullDay;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
}

export function looksLikeCallReminder(text: string) {
  return text.toLowerCase().includes("lig");
}

export function looksLikeCongratulateReminder(text: string) {
  const lower = text.toLowerCase();
  return (
    lower.includes("parab") ||
    lower.includes("anivers") ||
    lower.includes("sentir") ||
    lower.includes("falta")
  );
}

export function isCalendarStyleEvent(event: Event) {
  return (
    event.type === "party" ||
    event.type === "birthday" ||
    (event.type === "other" && !event.contactId)
  );
}

export function getReminderActionLabel(text: string) {
  if (looksLikeCallReminder(text)) return ui.activityCall;
  if (looksLikeCongratulateReminder(text)) return ui.activityCongratulate;
  return ui.reminder;
}

export function getEventActionLabel(event: Event) {
  switch (event.type) {
    case "call":
      return ui.activityCall;
    case "meeting":
      return ui.activityMeetingWith;
    case "birthday":
      return ui.activityBirthdayOf;
    case "party":
      return ui.activityParty;
    default:
      return eventTypeLabels[event.type];
  }
}

export type ActivityIconKind =
  | "phone"
  | "video"
  | "bell"
  | "gift"
  | "users"
  | "calendar";

export function getActivityIconKind(
  kind: "event" | "reminder",
  event?: Event,
  reminderText?: string,
): ActivityIconKind {
  if (kind === "reminder") {
    if (reminderText && looksLikeCallReminder(reminderText)) return "phone";
    if (reminderText && looksLikeCongratulateReminder(reminderText)) {
      return "gift";
    }
    return "bell";
  }

  if (!event) return "calendar";

  switch (event.type) {
    case "call":
      return "phone";
    case "meeting":
      return "video";
    case "birthday":
    case "party":
      return "gift";
    default:
      return "users";
  }
}

export function shouldShowEventDetailCard(event: Event) {
  return Boolean(event.description?.trim());
}
