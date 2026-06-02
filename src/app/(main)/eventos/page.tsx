import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";

import { EventsPageClient } from "./events-page-client";

export const metadata: Metadata = {
  title: "Eventos — Agendly",
  description: "Timeline de eventos e lembretes futuros da Agendly.",
};

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      }
    >
      <EventsPageClient />
    </Suspense>
  );
}
