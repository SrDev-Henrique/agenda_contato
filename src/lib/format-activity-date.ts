import { formatActivityTimestamp } from "@/lib/activity-display";

/** @deprecated Prefer formatActivityTimestamp for Alloy-style labels */
export function formatActivityDate(value: string) {
  return formatActivityTimestamp(value);
}
