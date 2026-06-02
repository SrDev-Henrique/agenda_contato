import type { z } from "zod";

import { inferReminderType } from "@/lib/activity-display";
import type { AppState } from "@/types/app-state";

import type { appStateSchema } from "./schema";

type ParsedAppState = z.infer<typeof appStateSchema>;

export function normalizeAppState(state: ParsedAppState | AppState): AppState {
  return {
    ...state,
    reminders: state.reminders.map((reminder) => ({
      ...reminder,
      type: reminder.type ?? inferReminderType(reminder.text),
    })),
  };
}
