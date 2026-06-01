import { z } from "zod";

import { ui } from "@/lib/i18n/pt-br";
import { stripPhoneDigits } from "@/lib/phone-mask";

export const createContactFormSchema = z.object({
  name: z.string().trim().min(1, ui.contactNameRequired),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || z.email().safeParse(value).success, {
      message: ui.invalidEmail,
    }),
  phone: z
    .string()
    .trim()
    .min(1, ui.phoneRequired)
    .refine((value) => stripPhoneDigits(value).length >= 10, {
      message: ui.phoneInvalid,
    }),
  tagIds: z.array(z.string()),
  favorite: z.boolean(),
});

export type CreateContactFormValues = z.infer<typeof createContactFormSchema>;

export const createContactDefaultValues: CreateContactFormValues = {
  name: "",
  email: "",
  phone: "",
  tagIds: [],
  favorite: false,
};
