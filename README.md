<p align="center">
  <img
    alt="NexVaultX Frontend"
    src="https://shieldcn.dev/header/surface.svg?title=NexVaultX+Frontend&subtitle=The+modern+frontend+for+NexVaultX.%0AFast,+clean,+and+developer-focused.&mode=dark&image=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1678566111481-8e275550b700%3Fq%3D80%26w%3D387%26auto%3Dformat%26fit%3Dcrop"
  />
</p>

<p align="center">
  <strong>The modern, open-source marketplace for Minecraft creators.</strong><br/>
  Built with TanStack Start, React, TypeScript, PNPM, and Ultracite.
</p>

<p align="center">
  <a href="https://github.com/NexVaultX/frontend">
    <img
      alt="GitHub Health"
      src="https://shieldcn.dev/group/github/stars/NexVaultX/frontend+github/forks/NexVaultX/frontend+github/commits/NexVaultX/frontend+discord/1545907423502536766.svg?variant=branded"
    />
  </a>
  <a href="https://github.com/NexVaultX/frontend">
    <img
      alt="License"
      src="https://shieldcn.dev/github/NexVaultX/frontend/license.svg?mode=light&brand=github"
    />
  </a>
</p>

---

## Overview

NexVaultX is a modern, open-source marketplace for Minecraft creators.

The platform is designed for discovering, sharing, and managing community-created content such as mods, plugins, resource packs, datapacks, shaders, and more.

## Features

* Fast server-rendered React application.
* End-to-end type safety with TypeScript.
* Accessible UI built with shadcn/ui.
* Responsive and modern interface.
* Dark-mode-first design.
* Type-safe routing with TanStack Router.
* Efficient data fetching and caching with TanStack Query.
* Modern TanStack-first architecture.

> [!IMPORTANT]
> The `main` branch is the development branch. Every time `main` is merged into `prod`, the production website is automatically redeployed.

## Tech Stack

| Technology          | Purpose                    |
| ------------------- | -------------------------- |
| **React 19**        | User interface             |
| **TypeScript**      | End-to-end type safety     |
| **TanStack Start**  | Full-stack React framework |
| **TanStack Router** | Type-safe routing          |
| **TanStack Query**  | Data fetching and caching  |
| **Tailwind CSS v4** | Styling                    |
| **shadcn/ui**       | Accessible UI components   |
| **PNPM**            | Package manager            |
| **Ultracite**       | Linting and formatting     |

## Getting Started

### Requirements

* **Node.js 24+**
* **PNPM 10+**

### Clone the Repository

```bash
git clone https://github.com/NexVaultX/frontend.git
cd frontend
```

### Install Dependencies

```bash
pnpm install
```

### Start the Development Server

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:3000
```

## Development

The repository follows a development-to-production workflow:

```text
main → prod → production deployment
```

Use `main` for active development and merge tested changes into `prod` when they are ready for deployment.

---

<p align="center">
  <img
    alt="GitHub Stars Chart"
    src="https://shieldcn.dev/chart/github/stars/NexVaultX/frontend.svg"
  />
</p>
