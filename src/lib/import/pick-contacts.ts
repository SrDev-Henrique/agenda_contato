import type { ContactInfo } from "./contact-picker";
import { isContactPickerSupported } from "./is-contact-picker-supported";

export async function pickContacts(): Promise<ContactInfo[]> {
  if (!isContactPickerSupported() || !navigator.contacts) {
    throw new Error("Contact Picker API não disponível neste navegador.");
  }

  return navigator.contacts.select(["name", "email", "tel"], {
    multiple: true,
  });
}
