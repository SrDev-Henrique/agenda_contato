"use client";

import { ThemeProvider } from "@teispace/next-themes";
import dynamic from "next/dynamic";
import { Provider } from "react-redux";

import { TooltipProvider } from "@/components/ui/tooltip";
import { store } from "@/store";

const StoreHydration = dynamic(
  () =>
    import("@/store/store-hydration").then((mod) => mod.StoreHydration),
  { ssr: false },
);

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
