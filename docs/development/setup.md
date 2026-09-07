# Local Development Setup

This guide walks through getting the NexVaultX frontend running
locally.

## Prerequisites

* Node.js 22 or newer
* pnpm 11 (managed via Corepack)
* PostgreSQL 16 or newer

## 1. Install dependencies

```bash
pnpm install
```

## 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable             | Description                          |
| -------------------- | ------------------------------------ |
| `DATABASE_URL`       | PostgreSQL connection string         |
| `BETTER_AUTH_SECRET` | Secret for signing sessions (32+)    |
| `BETTER_AUTH_URL`    | Public URL of the app                |

Optional variables:

| Variable                | Description                    |
| ----------------------- | ------------------------------ |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID         |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret     |

Generate a secret with:

```bash
openssl rand -base64 32
```

## 3. Start PostgreSQL

Use an existing PostgreSQL instance or run one with Docker:

```bash
docker run -d \
  --name nexvaultx-db \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16
```

## 4. Apply migrations

```bash
./node_modules/.bin/drizzle-kit migrate
```

## 5. Run the dev server

```bash
pnpm dev
```

The app is served at `http://localhost:6001`.

## 6. Verify

* Open `http://localhost:6001` — the homepage renders.
* Open `http://localhost:6001/signup` — create an account.
* Open `http://localhost:6001/settings` — manage profile, passkeys,
  and sessions.

## Related

* [Commands](commands.md)
* [Migrations](../database/migrations.md)
* [Google Social Provider](../social-providers/google.md)
