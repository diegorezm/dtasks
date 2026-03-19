# server — Agent Guide

## Overview

Hono API running on a Cloudflare Worker. Follows a domain-driven architecture where each feature is its own self-contained module.

## Stack

- **Framework**: Hono
- **Runtime**: Cloudflare Workers (via Alchemy)
- **DB access**: Drizzle ORM via `@dtask/db`
- **Validation**: Zod

## How to run

```bash
bun run dev          # start local worker (port 3000)
```

Wrangler is managed by Alchemy — you don't need a `wrangler.toml`.

## Architecture

```
src/
  index.ts           # Hono app entrypoint, mounts all domain routes
  types.ts           # Exports AppType for the web client
  domains/
    auth/
      repository.ts  # DB queries (reads/writes via Drizzle)
      service.ts     # Business logic, calls repository
      controller.ts  # Hono route handlers, calls service
      index.ts       # Mounts routes, exports domain router
    <domain>/
      repository.ts
      service.ts
      controller.ts
      index.ts
```

## Domain conventions

### Repository
Handles all database access. Receives the `db` instance, returns raw data.

```ts
// domains/auth/repository.ts
export const authRepository = (db: DrizzleD1) => ({
  findUserByEmail: (email: string) =>
    db.select().from(users).where(eq(users.email, email)),
});
```

### Service
Contains business logic. Calls the repository, throws errors, returns results.

```ts
// domains/auth/service.ts
export const authService = (db: DrizzleD1) => ({
  login: async (email: string, password: string) => {
    const repo = authRepository(db);
    // ...
  },
});
```

### Controller
Hono route handlers. Reads request, calls service, returns response.

```ts
// domains/auth/controller.ts
export const authController = new Hono()
  .post("/login", async (c) => {
    const service = authService(c.env.DB);
    // ...
  });
```

### Mounting domains

```ts
// src/index.ts
import { authController } from "./domains/auth";

const app = new Hono()
  .route("/auth", authController);

export default app;
```

## Type export

```ts
// src/types.ts
import type app from "./index.ts";
export type AppType = typeof app;
```

```json
// package.json
{ "exports": { ".": "./src/types.ts" } }
```

## Bindings

| Binding       | Description          |
|---------------|----------------------|
| `DB`          | D1 database instance |
| `CORS_ORIGIN` | Allowed CORS origin  |

Access via Hono context: `c.env.DB`, `c.env.CORS_ORIGIN`.

## Adding a new domain

1. Create `src/domains/<name>/` with `repository.ts`, `service.ts`, `controller.ts`, `index.ts`
2. Mount the controller in `src/index.ts`
