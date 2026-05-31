"use client";

import { ThemeProvider } from "@teispace/next-themes";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ContactsStoreProvider } from "@/store/contacts-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storage="local"
    >
      <ContactsStoreProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ContactsStoreProvider>
    </ThemeProvider>
  );
}
