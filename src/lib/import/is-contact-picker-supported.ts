export function isContactPickerSupported(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return "contacts" in navigator && "ContactsManager" in window;
}
