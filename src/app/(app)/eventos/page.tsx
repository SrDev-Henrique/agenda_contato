import type { Metadata } from "next";

import { EventsPageClient } from "./events-page-client";

export const metadata: Metadata = {
  title: "Eventos — Agendly",
  description: "Timeline de eventos e lembretes futuros da Agendly.",
};

export default function EventsPage() {
  return <EventsPageClient />;
}
