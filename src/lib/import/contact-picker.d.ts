export type ContactProperty = "name" | "email" | "tel" | "address" | "icon";

export type ContactInfo = {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: unknown[];
  icon?: Blob[];
};

export type ContactsSelectOptions = {
  multiple?: boolean;
};

export interface ContactsManager {
  select(
    properties: ContactProperty[],
    options?: ContactsSelectOptions,
  ): Promise<ContactInfo[]>;
}

declare global {
  interface Navigator {
    readonly contacts?: ContactsManager;
  }

  interface Window {
    ContactsManager?: unknown;
  }
}

export {};
