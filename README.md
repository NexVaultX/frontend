<<<<<<< HEAD
# **OpenVault** (FastVault) Frontend

=======
>>>>>>> origin/main
<p align="center">
  <img
    alt="NexVaultX Frontend"
    src="https://shieldcn.dev/header/surface.svg?title=NexVaultX+Frontend&subtitle=The+modern+frontend+for+NexVaultX.%0AFast,+clean,+and+developer-focused.&mode=dark&image=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1678566111481-8e275550b700%3Fq%3D80%26w%3D387%26auto%3Dformat%26fit%3Dcrop"
  />
</p>

<p align="center">
<<<<<<< HEAD
  <a href="https://github.com/FastVault/frontend/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/FastVault/frontend/ci.yml?branch=main&style=flat-square&label=CI" alt="CI">
  </a>
  <a href="https://github.com/FastVault/frontend">
    <img src="https://img.shields.io/github/license/FastVault/frontend?style=flat-square" alt="License">
=======
  <strong>The modern, open-source marketplace for Minecraft creators.</strong><br />
  Discover, share, and manage community-created Minecraft content.
</p>

<p align="center">
  <a href="https://github.com/NexVaultX/frontend">
    <img
      alt="GitHub Health"
      src="https://shieldcn.dev/group/github/stars/NexVaultX/frontend+github/forks/NexVaultX/frontend+github/commits/NexVaultX/frontend+discord/1545907423502536766.svg?variant=branded"
    />
>>>>>>> origin/main
  </a>
  <br/>
  <a href="https://github.com/NexVaultX/frontend">
    <img
      alt="License"
      src="https://shieldcn.dev/github/NexVaultX/frontend/license.svg?mode=light&brand=github"
    />
  </a>
</p>

---

## Overview

**NexVaultX Frontend** is the web application for [NexVaultX](https://github.com/NexVaultX), an open-source marketplace for Minecraft creators.

NexVaultX is designed for discovering, sharing, and managing community-created content including:

* Mods
* Plugins
* Resource packs
* Datapacks
* Shaders
* Other Minecraft creator content

This repository contains the **web frontend and its server-side application layer**. It is not the complete NexVaultX platform or infrastructure stack.

## Features

### Product

* Minecraft content marketplace experience
* Content discovery and browsing
* Creator-focused interfaces
* Responsive web interface
* Dark-mode-first design
* Accessible component foundation
* Server-rendered application

### Engineering

* React 19
* TypeScript
* TanStack Start
* TanStack Router
* TanStack Query
* Tailwind CSS v4
* shadcn/ui
* Better Auth
* Drizzle ORM
* PostgreSQL
* Vitest
* Oxlint
* Oxfmt
* Ultracite

> [!IMPORTANT]
> `main` is the development branch. Merging `main` into `prod` triggers an automatic redeploy of the production site.

## Tech Stack

<<<<<<< HEAD
| Technology      | Purpose                                  |
| --------------- | ---------------------------------------- |
| React           | User interface                           |
| TypeScript      | Type-safe development                    |
| TanStack Start  | Full-stack React framework               |
| TanStack Router | Type-safe routing                        |
| Tailwind CSS    | Styling                                  |
| shadcn/ui       | Reusable UI components                   |
| Vite            | Development and build tooling            |
| Nitro           | Production server (deployment)           |
| Vitest          | Testing                                  |
| Ultracite       | Lint/format preset (Oxlint + Oxfmt)      |
| Oxlint          | Code quality                             |
| Oxfmt           | Code formatting                          |
| Docker          | Containerized development and deployment |
=======
| Technology          | Purpose                                   |
| ------------------- | ----------------------------------------- |
| **React 19**        | User interface                            |
| **TypeScript**      | Static typing                             |
| **TanStack Start**  | Full-stack React framework and SSR        |
| **TanStack Router** | Type-safe, file-based routing             |
| **TanStack Query**  | Data fetching and server-state management |
| **Tailwind CSS v4** | Styling                                   |
| **shadcn/ui**       | UI component foundation                   |
| **Better Auth**     | Authentication                            |
| **Drizzle ORM**     | Database access and schema management     |
| **PostgreSQL**      | Relational database                       |
| **Vite**            | Development and build tooling             |
| **Vitest**          | Testing                                   |
| **Oxlint**          | Linting                                   |
| **Oxfmt**           | Formatting                                |
| **Ultracite**       | Unified code-quality checks and fixes     |
| **PNPM**            | Package management                        |
>>>>>>> origin/main

## Requirements

Before getting started, make sure you have:

* **Node.js 24+**
* **PNPM 11.3.0**
* **PostgreSQL** for local server-side functionality
* Git

The repository pins PNPM through the `packageManager` field, so using the pinned version is recommended.

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

Create a `.env.local` file in the repository root:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/nexvaultx
NODE_ENV=development
```

The application validates its environment configuration at runtime. `BETTER_AUTH_SECRET` must contain at least 32 characters, `BETTER_AUTH_URL` must be a valid URL, and `DATABASE_URL` must be a valid URL.

> **Never commit ****`.env.local`**** or real credentials to the repository.**

### Start the Development Server

```bash
pnpm dev
```

The development server runs on:

```text
http://localhost:3000
```

<<<<<<< HEAD
## Docker

The project ships with Docker configuration for both development and production.

### Requirements

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2

### Compose files

| File                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `compose.yaml`      | Base configuration (shared service definition)      |
| `compose.dev.yaml`  | Development override (hot reload, source mounted)   |
| `compose.prod.yaml` | Production override (Nitro server, optimized image) |

### Development

Runs the Vite dev server with hot reload. The source tree is mounted into the container, so changes are picked up immediately.

```bash
docker compose -f compose.yaml -f compose.dev.yaml up
```

The development server will be available at:

```text
http://localhost:3000
```

### Production

Builds an optimized multi-stage image and runs the Nitro production server.

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

The production server will be available at:

```text
http://localhost:3000
```

### Configuration

| Variable | Default  | Description                        |
| -------- | -------- | ---------------------------------- |
| `PORT`   | `3000`   | Host port mapped to the container  |
| `TAG`    | `latest` | Image tag used for the built image |

Example with custom port and tag:

```bash
PORT=8080 TAG=v1.0.0 docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

### Dockerfile stages

The multi-stage `Dockerfile` builds a small, secure production image:

| Stage     | Purpose                                          |
| --------- | ------------------------------------------------ |
| `deps`    | Install dependencies with pnpm (frozen lockfile) |
| `build`   | Compile the production bundle (Nitro output)     |
| `runtime` | Run the Nitro server as a non-root user          |

## Development
=======
## Available Commands
>>>>>>> origin/main

| Command          | Description                                        |
| ---------------- | -------------------------------------------------- |
| `pnpm dev`       | Start the Vite development server on port 3000     |
| `pnpm build`     | Build the production application                   |
| `pnpm preview`   | Preview the production build                       |
| `pnpm start`     | Start the built Nitro server                       |
| `pnpm test`      | Run the Vitest test suite                          |
| `pnpm typecheck` | Run the TypeScript compiler without emitting files |
| `pnpm lint`      | Run Oxlint                                         |
| `pnpm format`    | Format TypeScript and JavaScript files with Oxfmt  |
| `pnpm check`     | Run Ultracite checks                               |
| `pnpm fix`       | Apply Ultracite fixes                              |
| `pnpm prepare`   | Initialize Husky Git hooks                         |

<<<<<<< HEAD
| Command          | Description                     |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Start the development server    |
| `pnpm build`     | Create a production build       |
| `pnpm preview`   | Preview the production build    |
| `pnpm start`     | Run the Nitro production server |
| `pnpm test`      | Run tests                       |
| `pnpm lint`      | Check the code with Oxlint      |
| `pnpm format`    | Format the codebase with Oxfmt  |
| `pnpm check`     | Lint + format check (read-only) |
| `pnpm fix`       | Lint + auto-fix issues          |
| `pnpm typecheck` | Run TypeScript checks           |
=======
These commands are defined directly in the repository's `package.json`.
>>>>>>> origin/main

## Project Structure

```text
.
├── src/
│   ├── components/     # Shared UI components
│   ├── db/             # Database integration
│   ├── lib/            # Shared application logic
│   ├── routes/         # TanStack Router routes
│   ├── __tests__/      # Test suites
│   ├── test/           # Test configuration/helpers
│   ├── router.tsx      # Router configuration
│   ├── routeTree.gen.ts
│   └── styles.css      # Global styles
├── drizzle/            # Drizzle database migrations
├── .github/            # GitHub configuration and automation
├── .husky/             # Git hooks
├── Dockerfile          # Production container image
├── compose.yaml        # Base Docker Compose configuration
├── compose.dev.yaml    # Development Compose configuration
├── compose.prod.yaml   # Production Compose configuration
├── env.config.ts       # Environment validation
├── drizzle.config.ts   # Drizzle configuration
├── vite.config.ts      # Vite/TanStack Start/Nitro configuration
├── package.json
└── README.md
```

The application is organized around TanStack Start and TanStack Router, with shared UI in `components`, application utilities in `lib`, database functionality in `db`, and routes under `routes`.

## Architecture

At a high level, the application follows this structure:

```text
React
  │
  ├── TanStack Start
  │     ├── TanStack Router
  │     └── SSR / server runtime
  │
  ├── TanStack Query
  │     └── Server-state and data fetching
  │
  ├── Better Auth
  │     └── Authentication
  │
  └── Drizzle ORM
        └── PostgreSQL
```

The Vite configuration integrates TanStack Start, TanStack Router support, Tailwind CSS, TanStack DevTools, Nitro, and React.

## Database

The application uses **PostgreSQL** through **Drizzle ORM**.

A local PostgreSQL instance is required when working with functionality that depends on the application's server-side database integration.

The connection is configured through:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nexvaultx
```

Database migrations are stored in the `drizzle/` directory.

## Authentication

Authentication is handled with **Better Auth**.

The required authentication configuration is:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

`BETTER_AUTH_SECRET` must contain at least 32 characters.

For local development, `BETTER_AUTH_URL` should point to the local application URL.

## Development Workflow

Development follows a simple promotion workflow:

```text
feature branch
      │
      ▼
    main
      │
      ▼
    prod
      │
      ▼
production deployment
```

### `main`

`main` is the primary development branch.

New work should be developed on a dedicated branch and merged into `main` through the project's normal pull request workflow.

### `prod`

`prod` represents the production branch.

Merging `main` into `prod` triggers the production deployment.

> [!IMPORTANT]
> Do not develop directly on `prod`. Changes should flow through `main` before being promoted to production.

## Code Quality

Before opening a pull request, run the project's validation commands:

```bash
pnpm check
pnpm typecheck
pnpm test
```

For automatic fixes:

```bash
pnpm fix
```

For formatting:

```bash
pnpm format
```

The project uses Ultracite together with Oxlint and Oxfmt for code-quality enforcement.

## Testing

Tests use **Vitest** with Testing Library.

Run the test suite with:

```bash
pnpm test
```

The repository is configured to succeed when no tests are present, allowing the test command to remain part of the standard development workflow while coverage is expanded.

## Production Build

Build the production application with:

```bash
pnpm build
```

To preview the generated build:

```bash
pnpm preview
```

The production server can be started with:

```bash
pnpm start
```

The application uses Nitro for its production server output.

## Docker

The repository includes a multi-stage Dockerfile with separate dependency, build, and runtime stages.

The runtime image executes the generated Nitro server as a non-root user and exposes port `3000`.

### Development

```bash
docker compose -f compose.yaml -f compose.dev.yaml up
```

The development Compose configuration mounts the source tree and runs the Vite development server with hot reload.

### Production

```bash
docker compose -f compose.yaml -f compose.prod.yaml up -d --build
```

The production Compose configuration builds and runs the production image with the Nitro server.

## Deployment

Production deployment follows:

```text
main → prod → automatic production deployment
```

Changes merged from `main` into `prod` are automatically deployed to production.

The repository also provides production Docker and Docker Compose configuration for running the application as a containerized Nitro server.

## Contributing

Contributions are welcome.

A typical contribution workflow is:

```bash
git checkout main
git pull
git checkout -b feat/your-change
```

Then:

1. Make your changes.
2. Run the relevant tests.
3. Run type checking.
4. Run the project's code-quality checks.
5. Open a pull request against `main`.
6. Address review feedback.
7. Once merged, changes can be promoted from `main` to `prod` for production deployment.

For larger features or architectural changes, open an issue first so the implementation can be discussed before significant work begins.

## Branch Naming

Use descriptive branch names following the Conventional Branch style:

```text
feat/add-content-search
fix/auth-session
docs/improve-readme
refactor/router-setup
chore/update-dependencies
```

Keep branch names short, descriptive, and scoped to the change being made.

## Security

If you discover a security vulnerability, **do not disclose it publicly through a GitHub issue**.

Please use the repository's private security reporting mechanism when available.

See [`SECURITY.md`](SECURITY.md) for the project's security policy and reporting instructions.

## Code of Conduct

NexVaultX is intended to be a welcoming open-source project.

Please see [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) for the project's community standards.

## Support

For bugs and feature requests, use:

* [GitHub Issues](https://github.com/NexVaultX/frontend/issues)
* [GitHub Discussions](https://github.com/NexVaultX/frontend/discussions), when available

For general community discussion, use the project's official Discord community.

## Project Status

NexVaultX Frontend is under active development.

APIs, routes, UI components, and internal architecture may change as the marketplace evolves.

For the current state of development, see the repository's issues and pull requests.

## License

NexVaultX Frontend is licensed under the **Apache License 2.0**.

See [`LICENSE`](LICENSE) for the complete license text.

---

<p align="center">
  <a href="https://github.com/NexVaultX/frontend">GitHub</a>
  ·
  <a href="https://github.com/NexVaultX/frontend/issues">Issues</a>
  ·
  <a href="https://github.com/NexVaultX/frontend/pulls">Pull Requests</a>
</p>
