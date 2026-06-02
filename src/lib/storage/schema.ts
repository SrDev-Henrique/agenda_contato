import { z } from "zod";

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const contactSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  favorite: z.boolean(),
  pinned: z.boolean(),
  tagIds: z.array(z.string()),
  phone: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  relationship: z.string().optional(),
  relationshipStatus: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const eventTypeSchema = z.enum([
  "meeting",
  "call",
  "birthday",
  "party",
  "reminder",
  "other",
]);

export const eventSchema = z.object({
  id: z.string(),
  contactId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  startsAt: z.string(),
  type: eventTypeSchema,
  attendeeContactIds: z.array(z.string()).optional(),
});

export const reminderSchema = z.object({
  id: z.string(),
  contactId: z.string(),
  text: z.string(),
  scheduledAt: z.string(),
  createdAt: z.string(),
  type: eventTypeSchema.optional(),
});

export const noteSchema = z.object({
  id: z.string(),
  contactId: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const appStateSchema = z.object({
  contacts: z.array(contactSchema),
  tags: z.array(tagSchema),
  events: z.array(eventSchema),
  reminders: z.array(reminderSchema),
  notes: z.array(noteSchema),
});
