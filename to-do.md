# Plano de desenvolvimento — Agenda de contatos (Alloy)

Checklist de implementação. Marque `[x]` conforme concluir cada item.

## Idioma da interface (obrigatório)

**Todo texto visível ao usuário deve estar em português brasileiro (pt-BR).**

- Não usar inglês em labels, botões, placeholders, mensagens de erro/toast, estados vazios, títulos de página ou dados de exemplo exibidos na UI.
- Centralizar strings reutilizáveis em [`src/lib/i18n/pt-br.ts`](src/lib/i18n/pt-br.ts) (`ui`, `eventTypeLabels`) e importar nos componentes — evitar strings soltas nos JSX.
- Metadados e `<html lang="pt-BR">` em [`src/app/layout.tsx`](src/app/layout.tsx).
- Dados iniciais em [`src/data/seed.ts`](src/data/seed.ts) já em pt-BR (tags, lembretes, eventos, notas, cargos, etc.). Slugs de tag em português (`familia`, `trabalho`, …) para combinar com `?tag=` na URL.
- Ao criar novos componentes (sidebar, lista, detalhe, timeline, FAB, dialogs): usar `ui` do i18n ou adicionar chaves novas em `pt-br.ts` antes de hardcodar texto.
- Exceções aceitáveis: nomes próprios de contatos fictícios, marcas (Google Inc), e-mails/URLs técnicos, identificadores internos (`id`, `slug` no código).

---

## Status atual (última atualização)

| Fase | Progresso |
|------|-----------|
| **0 — Fundação** | Concluída: tipos, storage, seed, i18n, seletores, store e Provider global prontos |
| **1 — Shell da aplicação** | Concluída: AppShell compartilhado, sidebar, lista central, redirect, dark theme e sheet base prontos |
| **2 — Lista de contatos** | Parcial: componente de lista, filtros internos e ações principais prontos; falta rota dedicada/filtros por query params e criação de contato |
| **3 — Detalhe do contato** | Parcial: rota `/contato/[nome]`, header, tags, seções e criação de lembrete/evento/nota prontos; falta edição inline e fluxo completo de exclusão/404 |
| **4 — Eventos** | Parcial: rota `/eventos` e timeline de eventos/lembretes futuros prontas; falta filtros via searchParams, paginação e CRUD global |
| **5–7** | Pendente — mobile, animações e polish final |

**Já no repositório:** `src/types/`, `src/lib/storage/`, `src/lib/selectors.ts`, `src/lib/id.ts`, `src/lib/i18n/pt-br.ts`, `src/data/seed.ts` (pt-BR), `src/store/contacts-store.tsx`, `src/components/layout/`, `src/components/contacts/`, `src/components/events/`, `src/components/reminders/`, `src/components/notes/`, páginas `/preview`, `/contato/[nome]`, `/eventos`, `to-do.md`.

**Ainda não existe:** `src/app/(app)/`, `MobileNavSheet`, `AddContactFab`, fluxo de criação de contato, páginas `/contacts` e `/events` antigas. As rotas atuais decididas são `/contato/[nome]` e `/eventos`.

---

## Decisões de arquitetura

- A aplicação deverá utilizar **Redux** para os estados globais. Migrar/substituir o store atual em `src/store/contacts-store.tsx` por uma estrutura Redux antes de conectar os fluxos principais às páginas.
- A autenticação deverá utilizar **Better Auth** com PostgreSQL (`pg`) e Drizzle, com email/senha e OAuth por GitHub. Configuração inicial em `src/lib/auth.ts`, cliente em `src/lib/auth-client.ts` e rota `/api/auth/[...all]`.
- O banco/infra remota será **Supabase**. Helpers SSR/browser ficam em `src/utils/supabase/` e o proxy em `src/proxy.ts` mantém sessões Supabase renovadas.

---

## Referência rápida — Rotas e query params

| Rota | Descrição | Status |
|------|-----------|--------|
| `/` | Redireciona para a área principal da aplicação | Pendente |
| `/preview` | Vitrine de componentes | Feito |
| `/contato/[nome]` | Detalhe do contato por slug do nome | Feito parcial |
| `/eventos` | Timeline de eventos e lembretes futuros | Feito parcial |
| `/contacts` | Lista de contatos na rota antiga planejada | Pendente / revisar necessidade |
| `/contacts/[id]` | Detalhe do contato na rota antiga planejada | Substituída por `/contato/[nome]` |
| `/events` | Timeline na rota antiga planejada | Substituída por `/eventos` |

| Query param | Efeito |
|-------------|--------|
| `?favorites=true` | Apenas favoritos |
| `?tag=<slug>` | Filtrar por tag (ex.: `familia`, `trabalho`) |
| `?q=<texto>` | Busca por nome |
| `?sort=az` | Ordenação A–Z |
| `?week=current` | Eventos da semana atual |

**Persistência:** `localStorage` chave `alloy-agenda:v1` (implementado em `src/lib/storage/`)

---

## Fase 0 — Fundação (dados + persistência)

- [x] Tipos em `src/types/` (contact, tag, event, reminder, note, app-state)
- [x] Schema Zod e storage em `src/lib/storage/` (`schema.ts`, `persistence.ts`, `constants.ts`)
- [x] Seletores em `src/lib/selectors.ts` (filtros, agrupamento A–Z, eventos, tags)
- [x] Utilitário `src/lib/id.ts` (`createId`, `slugify`)
- [x] Seed em `src/data/seed.ts` (conteúdo exibido em pt-BR)
- [x] Strings de UI centralizadas em `src/lib/i18n/pt-br.ts`
- [x] Store `src/store/contacts-store.tsx` + hook `useContactsStore()`
- [x] Provider conectado nas páginas já implementadas (`/contato/[nome]`, `/eventos`)
- [x] Provider no layout global da aplicação

**Critério de pronto:** criar/editar contato persiste após reload. *(Provider global conectado; fluxos de edição/criação serão validados nas fases de UI.)*

---

## Fase 1 — Shell da aplicação

- [x] Grid 3 colunas desktop / 1 coluna mobile aplicado nas páginas `/contato/[nome]` e `/eventos`
- [x] `AppShell` compartilhado para evitar duplicação entre páginas
- [x] `AppSidebar` — navegação, tags, sem tag, adicionar contato (textos via `ui` em pt-br.ts)
- [x] `ContactListColumn` / lista central — implementado com `ContactsList`
- [x] Redirect `/` → `/eventos`
- [x] Metadata pt-BR e `lang="pt-BR"` no `<html>` ([layout.tsx](src/app/layout.tsx))
- [x] Tema dark no `<html>` (`className="dark"`)
- [x] Componente shadcn `sheet` (mobile)

**Pré-requisito UI:** componentes shadcn base em `src/components/ui/` (button, dialog, input, etc.) — já instalados; **componentes de layout/app ainda serão criados por você**.

**Critério de pronto:** navegar `/contacts` ↔ `/events` no desktop com 3 colunas.

---

## Fase 2 — Lista de contatos (`/contacts`)

- [x] Componente `ContactsList`
- [ ] Filtros por query params: favorites, tag, q, sort
- [x] Filtros internos: todos, favoritos, fixados e sort A–Z/Z–A
- [ ] Desktop: empty state no painel direito
- [x] Tap/click em contato abre `/contato/[nome]`
- [x] Ações: favoritar, pin, excluir
- [ ] Criar contato (dialog) → navega para `[id]`

**Critério de pronto:** filtros do sidebar refletem na lista.

---

## Fase 3 — Detalhe do contato (`/contato/[nome]`)

- [x] Rota `/contato/[nome]`
- [x] Cabeçalho com avatar, tags e ações rápidas
- [ ] Edição inline dos campos
- [x] CRUD tags (adicionar/remover/criar)
- [x] Seções: reminders, events, notes
- [x] Criar reminder/event/note vinculado ao contato
- [x] Excluir contato a partir da lista central
- [ ] Estado 404/not found completo para slug inexistente

**Critério de pronto:** todas as edições persistem no localStorage.

---

## Fase 4 — Eventos (`/eventos`)

- [x] Rota `/eventos`
- [x] Timeline ordenada por data, com eventos e lembretes futuros
- [ ] Filtros semana / tipo via searchParams
- [x] Filtros client semana / tipo
- [ ] Paginação client (ex.: `ui.showMoreEvents`) — pt-BR
- [ ] CRUD evento global

**Critério de pronto:** sidebar Eventos abre timeline funcional.

---

## Fase 5 — Mobile

- [ ] `MobileNavSheet` — menu hamburger
- [ ] `AddContactFab` — z-index > sheet; label `ui.addContactShort` ("Add Contato +") ao abrir sheet
- [ ] Mesmo fluxo criar contato

**Critério de pronto:** FAB clicável com sheet aberto.

---

## Fase 6 — Animações (`motion`)

- [ ] Transições painel direito / páginas mobile
- [ ] Stagger na lista ao filtrar
- [ ] Timeline entrada sequencial
- [ ] Spring FAB/Sheet
- [ ] `prefers-reduced-motion`

---

## Fase 7 — Polish

- [ ] Estados vazios
- [ ] Acessibilidade básica (aria, foco)
- [ ] `bun run build` sem erros
- [ ] README atualizado

---

## Pastas-chave

```
src/
  app/(app)/          # pendente — layout + páginas
  app/contato/[nome]/ # feito parcial — detalhe do contato
  app/eventos/        # feito parcial — timeline
  components/layout/  # feito — AppShell, sidebar, busca, perfil, notificações
  components/contacts/# feito parcial — header, lista, row, tags
  components/events/  # feito parcial — composer, card, timeline
  components/reminders/# feito parcial — composer, card
  components/notes/   # feito parcial — composer, card
  components/ui/      # feito — shadcn base
  data/seed.ts       # feito
  lib/storage/       # feito
  lib/i18n/pt-br.ts  # feito — textos da UI
  lib/selectors.ts   # feito
  store/             # feito
  types/             # feito
```

---

## Próximos passos pós-v1

- [ ] Dropdown de notificações no sidebar
- [ ] All Businesses / Smart Tags
- [ ] Busca global no sidebar
- [ ] PWA / exportação de dados
