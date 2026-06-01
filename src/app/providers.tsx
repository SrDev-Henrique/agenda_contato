"use client";

import { ThemeProvider } from "@teispace/next-themes";
import { Provider } from "react-redux";

import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/store";
import { StoreHydration } from "@/store/store-hydration";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreHydration />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        storage="local"
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
}
