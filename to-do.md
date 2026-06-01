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
| **0 — Fundação** | Concluída: tipos, storage, seed, i18n, seletores, Redux (RTK) + `useContactsStore` e Provider global |
| **1 — Shell da aplicação** | Concluída: layout `(app)` + AppShell flex responsivo (`<md` conteúdo + sheet; `md–lg` sidebar + conteúdo; `xl+` sidebar + lista + conteúdo) |
| **2 — Lista de contatos** | Concluída: rota `/` como lista em todos os breakpoints, filtros por URL, sidebar e criar contato |
| **3 — Detalhe do contato** | Concluída: edição inline dos campos, nome editável, 404 com hydration e persistência no localStorage |
| **4 — Eventos** | Parcial: rota `/eventos` e timeline de eventos/lembretes futuros prontas; falta filtros via searchParams, paginação e CRUD global |
| **5–7** | Pendente — mobile, animações e polish final |

**Já no repositório:** `src/app/(app)/layout.tsx` (AppShell como layout), `src/types/`, `src/lib/storage/`, `src/lib/selectors.ts`, `src/lib/id.ts`, `src/lib/i18n/pt-br.ts`, `src/data/seed.ts` (pt-BR), `src/store/` (Redux: `agenda-slice`, `index`, `persistence`, facade `contacts-store.tsx`), `src/components/layout/`, `src/components/contacts/`, `src/components/events/`, páginas em `src/app/(app)/contato/`, `src/app/(app)/eventos/`, `/preview`, `to-do.md`.

**Ainda não existe:** `AddContactFab`, animações (fase 6). Rotas atuais: `/` (lista), `/contato/[nome]`, `/eventos`, `/preview`.

---

## Decisões de arquitetura

- **Redux Toolkit** para estado global da agenda (`src/store/agenda-slice.ts`, Provider em `providers.tsx`). Hook `useContactsStore()` mantém a API anterior para os consumidores. Estado de UI local (dialogs, edição inline) continua com `useState`.
- A autenticação deverá utilizar **Better Auth** com PostgreSQL (`pg`) e Drizzle, com email/senha e OAuth por GitHub. Configuração inicial em `src/lib/auth.ts`, cliente em `src/lib/auth-client.ts` e rota `/api/auth/[...all]`.
- O banco/infra remota será **Supabase**. Helpers SSR/browser ficam em `src/utils/supabase/` e o proxy em `src/proxy.ts` mantém sessões Supabase renovadas.

---

## Referência rápida — Rotas e query params

| Rota | Descrição | Status |
|------|-----------|--------|
| `/` | Lista de contatos em todos os breakpoints | Feito |
| `/preview` | Vitrine de componentes | Feito |
| `/contato/[nome]` | Detalhe do contato por slug do nome (edição inline + 404) | Feito |
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
- [x] Redux (`@reduxjs/toolkit` + `react-redux`): `agenda-slice`, persistência via listener + `localStorage`
- [x] Facade `src/store/contacts-store.tsx` + hook `useContactsStore()` (mesma API para componentes)
- [x] Provider conectado nas páginas já implementadas (`/contato/[nome]`, `/eventos`)
- [x] Provider no layout global da aplicação

**Critério de pronto:** criar/editar contato persiste após reload. *(Provider global conectado; fluxos de edição/criação serão validados nas fases de UI.)*

---

## Fase 1 — Shell da aplicação

- [x] `AppShell` como layout em [`src/app/(app)/layout.tsx`](src/app/(app)/layout.tsx) (rotas `/contato/*` e `/eventos`)
- [x] Layout **flex** responsivo (não empilhar sidebar/lista/conteúdo em coluna única):
  - `< md`: só `{children}` + header com `MobileNavSheet`
  - `md` – `lg`: sidebar fixo à esquerda + `{children}` à direita
  - `xl+`: sidebar + `ContactsList` + `{children}` em linha
- [x] `AppSidebar` + `sidebar-nav.tsx` (nav compartilhado)
- [x] `MobileNavSheet` + `app-shell-mobile-header.tsx`
- [x] Lista central `ContactsList` só em `xl+`; highlight do contato ativo na lista
- [x] Páginas renderizam só o painel direito (`appMainPanelClassName`)
- [x] Home `/`: lista de contatos no painel principal (todos os breakpoints)
- [x] Metadata pt-BR e `lang="pt-BR"` no `<html>`
- [x] Tema dark no `<html>`
- [x] Componente shadcn `sheet` (mobile)
- [ ] `AddContactFab` (fase 5)

**Critério de pronto:** navegar `/eventos` ↔ `/contato/[nome]` com layout correto em mobile, tablet e desktop (`xl+`).

---

## Fase 2 — Lista de contatos (`/`)

- [x] Componente `ContactsList`
- [x] Rota `/` como lista de contatos (todos os breakpoints)
- [x] Filtros por query params: favorites, tag, q, sort
- [x] Filtros internos: todos, favoritos, fixados e sort A–Z/Z–A (sincronizados com URL)
- [x] Tap/click em contato abre `/contato/[nome]`
- [x] Ações: favoritar, pin, excluir
- [x] Links do sidebar: `/`, `/?favorites=true`, `/?tag=<slug>`
- [x] Criar contato (dialog) → navega para `/contato/[nome]`

**Critério de pronto:** filtros do sidebar refletem na lista.

---

## Fase 3 — Detalhe do contato (`/contato/[nome]`)

- [x] Rota `/contato/[nome]`
- [x] Cabeçalho com avatar, tags e ações rápidas
- [x] Edição inline dos campos (nome, telefone com máscara, e-mail, localização, endereço, aniversário, parentesco, empresa, cargo)
- [x] CRUD tags (adicionar/remover/criar)
- [x] Seções: reminders, events, notes
- [x] Criar reminder/event/note vinculado ao contato
- [x] Excluir contato a partir da lista central
- [x] Estado 404/not found completo para slug inexistente (aguarda hydration; links para `/` e `/eventos`)

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
- [x] `bun run build` sem erros
- [ ] README atualizado

---

## Pastas-chave

```
src/
  app/(app)/          # feito — layout AppShell + contato + eventos
  app/preview/        # feito — sem shell
  components/layout/  # feito — AppShell, sidebar-nav, mobile sheet, sidebar, busca
  components/contacts/# feito parcial — header, lista, row, tags
  components/events/  # feito parcial — composer, card, timeline
  components/reminders/# feito parcial — composer, card
  components/notes/   # feito parcial — composer, card
  components/ui/      # feito — shadcn base
  data/seed.ts       # feito
  lib/storage/       # feito
  lib/i18n/pt-br.ts  # feito — textos da UI
  lib/selectors.ts   # feito
  store/             # feito — Redux RTK (agenda-slice, persistence, hooks, facade)
  types/             # feito
```

---

## Próximos passos pós-v1

- [ ] Dropdown de notificações no sidebar
- [ ] All Businesses / Smart Tags
- [ ] Busca global no sidebar
- [ ] PWA / exportação de dados
