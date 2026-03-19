# dtask — Agent Guide

## Stack

- **Runtime**: Cloudflare (Workers + D1)
- **Infra**: Alchemy (manages Cloudflare resources declaratively)
- **Package manager**: Bun
- **Monorepo**: Turborepo
- **Language**: TypeScript

## Structure

```
apps/
  web/        # TanStack Start frontend
  server/     # Hono API (Cloudflare Worker)
packages/
  db/         # Drizzle ORM schema + migrations (D1)
  env/        # Shared env validation
  config/     # Shared TS/tooling config
  infra/      # Alchemy infra entrypoint
  ui/         # Shared shadcn/ui components
```

## How to run

```bash
bun install          # install all dependencies
bun run dev          # run all apps via Turborepo
bun run dev:web      # run web only
bun run dev:server   # run server only
```

## Database

```bash
bun run db:generate  # generate migration files from schema
bun run db:push      # apply migrations
```

Migrations live in `packages/db/src/migrations`. Alchemy applies them automatically on dev via `migrationsDir`.

## Deploy

```bash
bun run deploy       # deploy via Alchemy (packages/infra)
bun run destroy      # tear down Cloudflare resources
```

## Key conventions

- All packages are scoped under `@dtask/*` (e.g. `@dtask/server`, `@dtask/db`)
- Workspaces are defined in root `package.json` as `["apps/*", "packages/*"]`
- Env vars are validated in `@dtask/env` and imported across apps
- Cloudflare bindings (DB, CORS_ORIGIN, etc.) are wired in `packages/infra/alchemy.run.ts`
- Code style enforced with Biome (`bun run check`)
