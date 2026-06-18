# Agendly

**Agenda de contatos** com lembretes, eventos e notas — uma aplicação web moderna para organizar relacionamentos e atividades do dia a dia.

**Demo:** [https://agenda-contato-blond.vercel.app/](https://agenda-contato-blond.vercel.app/)

---

## Visão geral

O Agendly é um gerenciador de contatos pessoais construído com Next.js. Ele combina uma interface responsiva em português (pt-BR) com autenticação via GitHub, onboarding guiado e persistência local dos dados da agenda por usuário.

Principais capacidades:

- **Contatos** — cadastro, busca, favoritos, fixação, tags e perfil detalhado com informações profissionais e pessoais
- **Eventos** — reuniões, ligações, aniversários e outros tipos, com timeline de atividades futuras
- **Lembretes** — agendamento vinculado a contatos, com notificações do dia
- **Notas** — anotações por contato com título e conteúdo
- **Onboarding** — importação da lista de contatos do dispositivo, dados de exemplo ou rede do GitHub (seguidores/seguindo)
- **Conta** — login com GitHub, tema claro/escuro e exclusão de conta

## Stack tecnológica

| Camada | Tecnologia |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Linguagem | TypeScript |
| UI | React 19, Tailwind CSS 4, componentes COSS/shadcn |
| Estado | Redux Toolkit |
| Autenticação | [Better Auth](https://www.better-auth.com) (OAuth GitHub) |
| Banco (auth) | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Validação | Zod, React Hook Form |
| Animações | Motion |

Os dados da agenda (contatos, eventos, lembretes e notas) são persistidos no **localStorage** do navegador, isolados por usuário autenticado.

## Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- [npm](https://www.npmjs.com), [pnpm](https://pnpm.io), [yarn](https://yarnpkg.com) ou [bun](https://bun.sh)
- Instância PostgreSQL acessível (local ou hospedada, ex.: [Neon](https://neon.tech))
- Aplicativo OAuth no [GitHub](https://github.com/settings/developers) com callback configurado

## Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd agenda_contato

# Instale as dependências
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados (autenticação)
DATABASE_URL=postgres://usuario:senha@localhost:5432/agenda_contato

# Better Auth
BETTER_AUTH_SECRET=          # mín. 32 caracteres — gere com: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Opcional — origens adicionais confiáveis (separadas por vírgula)
# BETTER_AUTH_TRUSTED_ORIGINS=https://seu-dominio.com
```

| Variável | Obrigatória | Descrição |
| --- | :---: | --- |
| `DATABASE_URL` | Sim | Connection string PostgreSQL |
| `BETTER_AUTH_SECRET` | Sim | Chave secreta para criptografia de sessões |
| `BETTER_AUTH_URL` | Sim | URL base do servidor (ex.: `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Sim | Mesma URL, exposta ao cliente |
| `GITHUB_CLIENT_ID` | Sim* | Client ID do app OAuth GitHub |
| `GITHUB_CLIENT_SECRET` | Sim* | Client secret do app OAuth GitHub |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Não | Origens extras para produção |

\* Sem as credenciais GitHub, o login social fica indisponível.

### Configurar OAuth no GitHub

1. Crie um **OAuth App** em GitHub → Settings → Developer settings.
2. Defina **Authorization callback URL** como `{BETTER_AUTH_URL}/api/auth/callback/github`.
3. Copie Client ID e Client Secret para o `.env`.

## Banco de dados

O schema de autenticação é gerenciado pelo Drizzle. Após configurar `DATABASE_URL`:

```bash
# Aplicar o schema ao banco
npx drizzle-kit push
```

Para regenerar o schema a partir do Better Auth:

```bash
npx @better-auth/cli@latest generate --output src/db/auth-schema.ts
npx drizzle-kit push
```

## Executando localmente

```bash
# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
npm start

# Lint
npm run lint
```

Acesse [http://localhost:3000](http://localhost:3000). O fluxo inicial é:

1. **Sign-up** — autenticação com GitHub em `/sign-up`
2. **Onboarding** — escolha como popular a agenda em `/onboarding`
3. **App** — lista de contatos em `/` e eventos em `/eventos`

## Estrutura do projeto

```
src/
├── app/                  # Rotas Next.js (App Router)
│   ├── (auth)/           # Sign-up e onboarding
│   ├── (main)/           # Contatos e eventos (área autenticada)
│   └── api/              # Rotas de API (auth, importação GitHub)
├── components/           # Componentes React (UI, contatos, eventos, layout)
├── db/                   # Drizzle schema e conexão PostgreSQL
├── hooks/                # Hooks customizados
├── lib/                  # Auth, i18n, validação, persistência, importação
├── store/                # Redux store e hidratação
└── types/                # Tipos TypeScript da aplicação
```

## Deploy

A versão em produção está disponível em [https://agenda-contato-blond.vercel.app/](https://agenda-contato-blond.vercel.app/).

O projeto é compatível com [Vercel](https://vercel.com) e outras plataformas que suportam Next.js. Em produção:

- Defina todas as variáveis de ambiente no painel da plataforma
- Use `BETTER_AUTH_URL` e `NEXT_PUBLIC_BETTER_AUTH_URL` com a URL pública do deploy
- Atualize o callback OAuth do GitHub para a URL de produção
- Garanta que `BETTER_AUTH_TRUSTED_ORIGINS` inclua o domínio de produção, se necessário

## Licença

Projeto privado — todos os direitos reservados.
