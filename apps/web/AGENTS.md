# web — Agent Guide

## Overview

TanStack Start frontend running on Cloudflare via Alchemy. Organized by feature, using React Query for all API calls and a typed Hono client for end-to-end type safety.

## Stack

- **Framework**: TanStack Start + TanStack Router
- **Runtime**: Cloudflare (via Alchemy `TanStackStart`)
- **API client**: `hono/client` typed against `@dtask/server`
- **Server state**: React Query (`@tanstack/react-query`)
- **UI components**: shadcn/ui from `@dtask/ui`
- **Styling**: Tailwind CSS v4

## How to run

```bash
bun run dev          # start local dev server
```

## Architecture

```
src/
  lib/
    api.ts           # Typed Hono client (source of truth for all API calls)
  features/
    auth/
      use_cases/     # React Query hooks (queries + mutations)
      ui/
        components/  # Feature-specific UI components
        pages/       # Full pages registered in the router
    <feature>/
      use_cases/
      ui/
        components/
        pages/
  routes/            # TanStack Router file-based routes, import pages from features
```

## API client

All API calls go through the typed Hono client. Never use `fetch` directly.

```ts
// src/lib/api.ts
import { env } from "@dtask/env/web";
import type { AppType } from "@dtask/server";
import { hc } from "hono/client";

export const client = hc<AppType>(env.VITE_SERVER_URL);
```

## Feature conventions

### use_cases
React Query hooks that wrap API calls. One hook per use case.

```ts
// features/auth/use_cases/use-login.ts
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/api";

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await client.auth.login.$post({ json: data });
      return res.json();
    },
  });
```

### ui/components
Reusable UI pieces scoped to the feature.

```ts
// features/auth/ui/components/login-form.tsx
import { useLogin } from "../use_cases/use-login";
```

### ui/pages
Full page components. Imported by TanStack Router routes.

```ts
// features/auth/ui/pages/login-page.tsx
export const LoginPage = () => { ... };
```

### routes
TanStack Router file-based routes just import and render pages:

```ts
// routes/login.tsx
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/ui/pages/login-page";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
```

## Adding a new feature

1. Create `src/features/<n>/use_cases/`, `ui/components/`, `ui/pages/`
2. Write React Query hooks in `use_cases/` using `client` from `src/lib/api.ts`
3. Build components and pages in `ui/`
4. Add route files in `src/routes/` that import from the feature's pages
