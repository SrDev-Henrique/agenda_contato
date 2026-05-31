export type EventType =
  | "meeting"
  | "call"
  | "birthday"
  | "party"
  | "reminder"
  | "other";

export type Event = {
  id: string;
  contactId?: string;
  title: string;
  description?: string;
  startsAt: string;
  type: EventType;
  attendeeContactIds?: string[];
};
