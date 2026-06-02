import type { Metadata } from "next";

import { ContactPageClient } from "./contact-page-client";

export const metadata: Metadata = {
  title: "Contato — Agendly",
  description: "Detalhes do contato na agenda Agendly.",
};

type ContactPageProps = {
  params: Promise<{
    nome: string;
  }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { nome } = await params;

  return <ContactPageClient nome={nome} />;
}
