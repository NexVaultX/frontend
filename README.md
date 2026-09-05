#  **OpenVault** (FastVault) Frontend

<p align="center">
  <strong>The modern frontend for OpenVault.</strong>
  <br>
  Fast, clean, and developer-focused.
</p>

<p align="center">
  <a href="https://github.com/FastVault/frontend">
    <img src="https://img.shields.io/github/license/FastVault/frontend?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/FastVault/frontend">
    <img src="https://img.shields.io/github/stars/FastVault/frontend?style=flat-square" alt="Stars">
  </a>
  <a href="https://github.com/FastVault/frontend">
    <img src="https://img.shields.io/github/last-commit/FastVault/frontend?style=flat-square" alt="Last commit">
  </a>
</p>

---

## About

OpenVault Frontend is the web application powering the OpenVault platform.

It is designed to provide a fast, modern, and intuitive interface for discovering and interacting with Minecraft projects while keeping the codebase maintainable and scalable.

The frontend is built with a modern React ecosystem and follows a component-driven architecture.

## Tech Stack

| Technology      | Purpose                       |
| --------------- | ----------------------------- |
| React           | User interface                |
| TypeScript      | Type-safe development         |
| TanStack Start  | Full-stack React framework    |
| TanStack Router | Type-safe routing             |
| Tailwind CSS    | Styling                       |
| shadcn/ui       | Reusable UI components        |
| Vite            | Development and build tooling |
| Vitest          | Testing                       |
| ESLint          | Code quality                  |
| Prettier        | Code formatting               |

## Project Structure

```text
src/
├── components/
│   └── ui/             # Reusable UI primitives
│
├── lib/                # Shared utilities and helpers
│
├── routes/             # Application routes
│
├── router.tsx          # Router configuration
│
└── styles.css          # Global styles
```

As OpenVault grows, the structure will be expanded around individual features and domains to keep the application modular and maintainable.

## Getting Started

### Requirements

Make sure you have the following installed:

- Node.js
- pnpm

### Clone

```bash
git clone https://github.com/OpenVault/frontend.git
cd frontend
```

### Install dependencies

```bash
pnpm install
```

### Start development

```bash
pnpm dev
```

The development server will be available at:

```text
http://localhost:3000
```

## Development

### Available commands

| Command          | Description                  |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Start the development server |
| `pnpm build`     | Create a production build    |
| `pnpm preview`   | Preview the production build |
| `pnpm test`      | Run tests                    |
| `pnpm lint`      | Check the code with ESLint   |
| `pnpm format`    | Format the codebase          |
| `pnpm check`     | Check formatting             |
| `pnpm typecheck` | Run TypeScript checks        |

Before opening a pull request, it is recommended to run:

```bash
pnpm lint
pnpm check
pnpm typecheck
pnpm test
pnpm build
```

## Architecture

OpenVault follows a component-driven approach built around reusable primitives and predictable application structure.

The frontend is intended to evolve toward a feature-oriented architecture:

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   └── ...
│
├── features/
│   ├── projects/
│   ├── search/
│   ├── versions/
│   ├── authentication/
│   └── ...
│
├── lib/
│   ├── api/
│   ├── utils/
│   └── ...
│
└── routes/
```

This keeps domain-specific logic close to the feature it belongs to while allowing shared components and utilities to remain independent.

## Design Principles

### Fast

Keep navigation, rendering, and interactions responsive.

### Simple

Prefer clear interfaces and straightforward solutions over unnecessary complexity.

### Consistent

Use shared components, spacing, typography, and interaction patterns throughout the application.

### Accessible

Build interfaces that work across different devices, input methods, and accessibility needs.

### Maintainable

Keep components focused, dependencies intentional, and application logic easy to understand.

### Scalable

Establish patterns that can support OpenVault as the platform and codebase grow.

## Contributing

Contributions are welcome.

Before making a large change, consider opening an issue to discuss the idea and its implementation.

When submitting a pull request:

1. Keep changes focused.
2. Follow the existing project structure and conventions.
3. Add or update tests where appropriate.
4. Run the project checks locally.
5. Provide a clear description of the change.

## License

OpenVault Frontend is licensed under the **Apache License 2.0**.

See [`LICENSE`](./LICENSE) for the complete license text.

---

<p align="center">
  Built for OpenVault.
</p>
