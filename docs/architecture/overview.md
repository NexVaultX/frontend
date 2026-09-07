# Architecture Overview

NexVaultX is a full-stack TypeScript application built with TanStack
Start, React 19, Better Auth, and Drizzle ORM.

## Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | TanStack Start (file-based routing)     |
| UI         | React 19, Tailwind CSS v4, Base UI      |
| Animation  | Motion (framer-motion)                  |
| Auth       | Better Auth                             |
| Database   | PostgreSQL, Drizzle ORM                 |
| Validation | Zod                                     |
| Lint       | Ultracite (Oxlint + Oxfmt)              |

## Directory layout

```text
src/
  components/       Reusable UI components
    settings/       Settings page sections
    ui/             Base UI primitives (button, tabs, ...)
  db/               Drizzle client and schema
  lib/              Auth, validation, animation easing
  routes/           TanStack Start file-based routes
  styles.css        Tailwind theme and global styles
drizzle/            Generated SQL migrations
docs/               Guides (this documentation)
```

## Request flow

1. A route file under `src/routes/` defines the page component and any
   `beforeLoad` guards.
2. Server functions (for example `src/lib/auth.functions.ts`) run on
   the server and are called from client components.
3. Better Auth handles sessions, social login, and passkeys. The
   server config is in `src/lib/auth.ts`; the client is in
   `src/lib/auth-client.ts`.
4. Drizzle reads and writes PostgreSQL through the pool in
   `src/db/index.ts`.

## Authentication

* Email/password sign-up and sign-in.
* Google (and optionally GitHub) social login.
* Passkeys via the Better Auth passkey plugin.
* Sessions with sliding expiration (30-day lifetime).

See the [authentication guides](../README.md#authentication).

## Theming

The design system uses OKLCH semantic tokens defined in
`src/styles.css`. Themes are applied from tweakcn.com with the shadcn
CLI. See [Custom Theme](../theming/custom-theme.md).

## Accessibility

Accessibility is a first-class requirement. Every component must meet
WCAG 2.2 AA. See [Accessibility Standards](../accessibility/standards.md).

## Related

* [Setup](../development/setup.md)
* [Commands](../development/commands.md)
* [Migrations](../database/migrations.md)
