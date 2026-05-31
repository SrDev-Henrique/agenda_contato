import type { Metadata } from "next";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { Notifications } from "@/components/layout/notifications";
import { ContactsSearch } from "@/components/layout/contacts-search";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { createSeedState } from "@/data/seed";
import { ContactRowPreview } from "./contact-row-preview";
import { ContactsListPreview } from "./contacts-list-preview";
import { ContactTagsEditorPreview } from "./contact-tags-editor-preview";
import { ContactHeaderPreview } from "./contact-header-preview";
import { RemindersPreview } from "./reminders-preview";
import { EventsPreview } from "./events-preview";
import { NotesPreview } from "./notes-preview";

export const metadata: Metadata = {
  title: "Prévia de componentes — Alloy",
  description: "Vitrine dos componentes visuais da agenda Alloy.",
};

const iconOnlyButtons = [
  { label: "Buscar", icon: Search },
  { label: "Notificações", icon: Bell },
  { label: "Favoritos", icon: Star },
  { label: "Ajustes", icon: Settings },
  { label: "Mais opções", icon: MoreHorizontal },
];

const previewState = createSeedState();
const previewContacts = [
  previewState.contacts[2],
  previewState.contacts[0],
  {
    ...previewState.contacts[4],
    phone: undefined,
    email: undefined,
  },
];

export default function PreviewPage() {
  return (
    <main className="dark min-h-screen bg-background px-6 py-8 text-foreground md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-border pb-8">
          <p className="text-sm font-medium text-foreground-subtle">
            Biblioteca visual
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-5xl leading-none md:text-7xl">
                Componentes Alloy
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-foreground-muted md:text-base">
                Vitrine de referência para construir a agenda com uma interface
                compacta, escura e focada em produtividade.
              </p>
            </div>
            <Button variant="primary" size="lg">
              Novo contato
              <Plus data-icon="inline-end" />
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Texto e ícone à direita"
            description="Ações principais e secundárias com leitura direta, mantendo o ícone como confirmação visual no fim do botão."
          />
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-5">
            <Button variant="primary">
              Adicionar contato
              <UserPlus data-icon="inline-end" />
            </Button>
            <Button variant="background">
              Ver agenda
              <CalendarDays data-icon="inline-end" />
            </Button>
            <Button variant="primary" size="lg">
              Continuar
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="background" size="sm">
              Criar grupo
              <Users data-icon="inline-end" />
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Texto e ícone à esquerda"
            description="Itens de navegação ou filtros começam sem preenchimento e ganham fundo suave ao passar o cursor ou quando estão ativos."
          />
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:flex-wrap">
            <Button className="justify-start" variant="ghost">
              <Users data-icon="inline-start" />
              Todos os contatos
            </Button>
            <Button className="justify-start" variant="ghost" aria-current="page">
              <Star data-icon="inline-start" />
              Favoritos
            </Button>
            <Button className="justify-start" variant="ghost">
              <CalendarDays data-icon="inline-start" />
              Eventos
            </Button>
            <Button className="justify-start" variant="ghost" aria-expanded>
              <Bell data-icon="inline-start" />
              Lembretes
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Apenas ícones"
            description="Controles compactos para barras de ferramentas, sempre com fundo suave e nome acessível."
          />
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-5">
            {iconOnlyButtons.map(({ label, icon: Icon }) => (
              <Button
                key={label}
                aria-label={label}
                title={label}
                variant="muted"
                size="icon"
              >
                <Icon />
              </Button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Perfil"
            description="Identidade compacta do usuário com acesso rápido às preferências visuais da aplicação."
          />
          <div className="flex items-center rounded-lg border border-border bg-surface p-5">
            <ProfileMenu name="Henrique Albuquerque" className="w-full max-w-sm" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Notificações"
            description="Central compacta para alertas recentes, com contagem de itens não lidos e leitura individual."
          />
          <div className="flex items-center rounded-lg border border-border bg-surface p-5">
            <Notifications />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Busca de contatos"
            description="Campo de busca com ícone e resultados filtrados em popup conforme o usuário digita."
          />
          <div className="flex items-center rounded-lg border border-border bg-surface p-5">
            <ContactsSearch />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Sidebar"
            description="Menu lateral inspirado no Alloy, com navegação compacta, busca, tags, notificações e perfil."
          />
          <div className="flex items-center rounded-lg border border-border bg-background p-5">
            <AppSidebar />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Linha de contato"
            description="Item de lista e cartão em grid inspirados no Alloy, com dados essenciais e ações rápidas."
          />
          <ContactRowPreview
            contacts={previewContacts}
            tags={previewState.tags}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Lista de contatos"
            description="Coluna central inspirada no Alloy, com filtros, ordenação, troca de view e contatos agrupados."
          />
          <ContactsListPreview
            contacts={previewState.contacts}
            tags={previewState.tags}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Editor de tags"
            description="Controle para adicionar tags ao perfil do contato com transição do botão para o campo digitável."
          />
          <ContactTagsEditorPreview tags={previewState.tags} />
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Header do contato"
            description="Topo do perfil com foto grande, nome, ações de contato e editor de tags."
          />
          <ContactHeaderPreview
            contact={previewState.contacts[2]}
            tags={previewState.tags}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Lembretes"
            description="Criação de lembretes com menção de contatos e cards inspirados no Alloy."
          />
          <RemindersPreview
            contacts={previewState.contacts}
            reminders={previewState.reminders}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Eventos"
            description="Criação de eventos com menção no título, dia, horário e participantes."
          />
          <EventsPreview
            contacts={previewState.contacts}
            events={previewState.events}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <SectionIntro
            title="Anotações"
            description="Criação de notas simples com título e texto da anotação."
          />
          <NotesPreview
            contactId={previewState.contacts[2].id}
            notes={previewState.notes}
          />
        </section>
      </div>
    </main>
  );
}

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center gap-2">
      <h2 className="text-3xl leading-none">{title}</h2>
      <p className="max-w-md text-sm leading-6 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}
