import type { EventType } from "@/types/event";

export type Reminder = {
  id: string;
  contactId: string;
  text: string;
  scheduledAt: string;
  createdAt: string;
  type: EventType;
};
