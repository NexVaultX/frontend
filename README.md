<p align="center">
  <img
    alt="NexVaultX Frontend"
    src="https://shieldcn.dev/header/surface.svg?title=NexVaultX+Frontend"
  />
</p>

<p align="center">
  <strong>The modern, open-source marketplace for Minecraft creators.</strong>
  <br />
  Discover, share, and manage community-created Minecraft content.
</p>

<p align="center">
  <a href="https://github.com/NexVaultX/frontend">
    <img
      alt="License"
      src="https://shieldcn.dev/github/NexVaultX/frontend/license.svg"
    />
  </a>
</p>

# NexVaultX Frontend

## Overview

**NexVaultX Frontend** is the web application for
[NexVaultX](https://github.com/NexVaultX), an open-source marketplace for
Minecraft creators.

This repository contains the **frontend and server-side application layer**,
built with TanStack Start, TanStack Router, and Nitro. It is part of the
NexVaultX platform but does not include the full infrastructure stack.

### Features

#### Product

* Minecraft content marketplace experience
* Content discovery and browsing
* Creator-focused interfaces
* Responsive web interface
* Dark-mode-first design
* Accessible component foundation
* Server-rendered application

#### Engineering

* React 19
* TypeScript
* TanStack Start (full-stack React framework with SSR)
* TanStack Router (file-based, type-safe routing)
* Tailwind CSS v4
* Base UI + shadcn-style components (UI foundation)
* Better Auth (authentication)
* Drizzle ORM (database access and schema management)
* PostgreSQL (relational database)
* Vitest (testing)
* Oxlint (linting)
* Oxfmt (formatting)
* Ultracite (unified code-quality checks and fixes)
* PNPM (package management)

---

## Tech Stack

| Technology          | Purpose                               |
| ------------------- | ------------------------------------- |
| **React 19**        | User interface                        |
| **TypeScript**      | Static typing                         |
| **TanStack Start**  | Full-stack React framework and SSR    |
| **TanStack Router** | Type-safe, file-based routing         |
| **Tailwind CSS v4** | Styling                               |
| **Base UI**         | Accessible UI primitives              |
| **Better Auth**     | Authentication                        |
| **Drizzle ORM**     | Database access and schema management |
| **PostgreSQL**      | Relational database                   |
| **Vite**            | Development and build tooling         |
| **Nitro**           | Production server runtime             |
| **Vitest**          | Testing                               |
| **Oxlint**          | Linting                               |
| **Oxfmt**           | Formatting                            |
| **Ultracite**       | Unified code-quality checks and fixes |
| **PNPM**            | Package management                    |

---

## Requirements

Before starting development, ensure you have:

* **Node.js 22+**
* **PNPM 11.3.0** (managed via `packageManager` in `package.json`)
* **PostgreSQL** for local server-side database integration
* Git

> **Note:** The repository pins PNPM through the `packageManager` field, so
> using the pinned version is recommended.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/NexVaultX/frontend.git
cd frontend
```

### Install Dependencies

```bash
pnpm install
```

### Configure the Environment

Create a `.env.local` file in the root directory with the following
variables:

```env
BETTER_AUTH_SECRET=your-secret-here  # Must be at least 32 characters
BETTER_AUTH_URL=http://localhost:6001
DATABASE_URL=postgresql://user:password@localhost:5432/nexvaultx
NODE_ENV=development
```

> Never commit `.env.local` or real credentials to the repository.

### Start the Development Server

```bash
pnpm dev
```

The development server runs on `http://localhost:6001`.

---

## Available Commands

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Starts the development server       |
| `pnpm build`     | Builds the production bundle        |
| `pnpm preview`   | Previews the production build       |
| `pnpm start`     | Starts the built Nitro server       |
| `pnpm test`      | Runs the Vitest test suite          |
| `pnpm typecheck` | Runs the TypeScript type checker    |
| `pnpm lint`      | Runs the Oxlint linter              |
| `pnpm lint:md`   | Runs markdownlint on Markdown files |
| `pnpm format`    | Runs the Oxfmt formatter            |
| `pnpm check`     | Runs the Ultracite checker          |
| `pnpm fix`       | Applies Ultracite checks            |
| `pnpm prepare`   | Initializes Husky Git hooks         |

---

## Architecture

The application follows this structure:

```text
src/
├── components/   # UI components (Base UI + shadcn-style)
├── routes/       # TanStack Start file-based routes
├── lib/          # Shared utilities and configuration
├── db/           # Drizzle ORM schema and client
└── styles/       # Global styles and design tokens
```

The Vite configuration integrates TanStack Start, TanStack Router, Tailwind
CSS, TanStack DevTools, Nitro, and React.

---

## Database

The application uses **PostgreSQL** via **Drizzle ORM**.

* A local PostgreSQL instance is required for server-side database
  functionality.
* The connection is configured via `DATABASE_URL`:

  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/nexvaultx
  ```

* Database migrations are stored in the `drizzle/` directory.

---

## Authentication

The application uses **Better Auth** for authentication.

* Required configuration:

  ```env
  BETTER_AUTH_SECRET=your-secret-here
  BETTER_AUTH_URL=http://localhost:6001
  ```

* For local development, `BETTER_AUTH_URL` should be set to the local
  application URL.

---

## Development Workflow

The workflow follows a simple promotion pattern:

```text
feature branch → main → prod → production deployment
```

### `main`

* The primary development branch.
* New work is developed on a dedicated branch and merged into `main` via
  pull requests.

### `prod`

* Represents the production branch.
* Merging `main` into `prod` triggers automatic production deployment.
* The `prod` branch is protected: changes can only land through a pull
  request whose head branch is `main`.

> [!IMPORTANT] Do not develop directly on `prod`. Changes must flow through
> `main` first.

---

## Code Quality

Before opening a pull request, run the following commands:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm lint:md
```

For automatic fixes:

```bash
pnpm fix
```

For formatting:

```bash
pnpm format
```

The project uses **Ultracite**, **Oxlint**, and **Oxfmt** for code-quality
enforcement, and **markdownlint** (via `markdownlint-cli2` with the GitHub
ruleset) for documentation.

---

## Testing

Tests use **Vitest** with Testing Library. Run the test suite with:

```bash
pnpm test
```

The repository is configured to succeed when no tests are present, allowing
the test command to remain part of the workflow.

---

## Production Build

Build the production application with:

```bash
pnpm build
```

Preview the generated build with:

```bash
pnpm preview
```

Start the production server:

```bash
pnpm start
```

The application uses **Nitro** for its production server output.

---

## Docker

### Development

Run the development environment with Docker:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up
```

The development Compose configuration mounts the source tree and runs the
Vite development server with hot reload. The container listens on port
`6001` and is exposed on host port `1112`:

```text
host :1112 → container :6001 (Vite dev server)
```

### Production

Run the production environment with Docker:

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d
```

The production Compose configuration builds and runs the production image
with the Nitro server. The container listens on port `3000` and is exposed
on host port `1112`:

```text
host :1112 → container :3000 (Nitro server)
```

> The host port defaults to `1112` to avoid conflicts with other services
> (for example, Dokploy commonly occupies host port `3000`). Override it
> with the `PORT` environment variable if needed.

---

## Deployment

Production deployment follows this workflow:

```text
main → prod → automatic production deployment
```

Changes merged from `main` into `prod` are automatically deployed to
production.

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for the
full contribution guide, including branch strategy, code-quality
requirements, and the pull request process.

---

## Security

Found a security issue? See [SECURITY.md](SECURITY.md) for our vulnerability
reporting policy.

---

## Code of Conduct

Please review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating
in the community.
