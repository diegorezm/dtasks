# DTasks Agent Guide

## Product

DTasks is B2B project-management platform with two surfaces:

- Internal dashboard for company users.
- Branded customer portal for invited customers.

Keep surfaces separate in routes, behavior, authorization, and data access. Scope customer data and actions to invited projects.

## Before Coding

1. Inspect code, conventions, routes, translations, and tests.
2. Classify request:
   - **Feature:** new capability with domain behavior, permissions, data access, routes, or multiple UI states.
   - **Focused change:** bug fix, copy, styling, or narrow workflow change.
3. For features, state classification, affected surface, outcome, and smallest useful MVP.
4. Ask at most three questions. Ask only if answers change scope, behavior, permissions, or data model. Otherwise state assumptions and ship.

## Architecture

Organize by feature, not file type. Keep feature UI, hooks, types, data access, views, and routes together:

```text
src/
  core/                  # providers, config, styles, shared utilities
  layouts/               # application-level structure
  features/
    <feature>/
      components/
      hooks/
      types/
      views/
      routes.ts
  routes/                # framework routing boundary
```

Create only needed directories. Move code to shared areas only when multiple features need it. Do not import private feature code across features.

Feature work:

- Colocate behavior and routes under `src/features/<feature>/`.
- Wire framework routes through `src/routes`.
- Use shadcn/ui for new interface primitives.
- Regenerate generated route files with owning command. Never edit manually.
- Enforce authorization and project/customer scoping in Convex or other backend boundaries. Frontend guards are UX only, not access control.
- Keep MVP narrow. Avoid speculative abstractions and variants.

Focused changes: modify existing ownership area. Do not create feature directories or abstractions without clear need.

## Stack And Commands

- TanStack Start and TanStack Router
- React and Tailwind CSS
- Convex
- Better Auth
- Paraglide
- Cloudflare Workers

Use `pnpm`, never npm or yarn.

```text
pnpm dev                         # frontend development server
pnpm convex:dev                  # local anonymous Convex deployment
pnpm install                     # after dependency changes
pnpm build                       # production build
pnpm exec tsc --noEmit           # typecheck
pnpm check                       # Biome checks
pnpm generate-routes             # regenerate TanStack route tree
pnpm dlx shadcn@latest add <component>
```

Keep Convex running during frontend data-access tests.

## TypeScript

- Never use `any` without explicit approval.
- Avoid type assertions, especially `as unknown as X`; use correct types or type guards.
- Never use `@ts-ignore` or `@ts-expect-error` without comment explaining exception.
- Avoid non-null assertions unless justified.
- Prefer `type` over `interface`.

## React

- Keep components small. Extract complex UI into focused components.
- Treat a component with many local states, effects, handlers, and server concerns as a refactor signal. Tell the next agent or maintainer when you encounter one, and prefer extracting feature hooks or Zustand stores before adding more responsibility.
- Avoid `useEffect`; use only for genuine external synchronization.
- Compute derived values during render, not with `useEffect` and `useState`.
- Keep business logic and data fetching in hooks or services, not components.
- Do not mutate state; return new references.
- Use stable IDs for list keys. Use array indexes only for static lists.
- Do not pass inline object, array, or function literals to memoized children.
- Avoid prop drilling beyond two or three levels. Use context or client-state store when needed.

Use Zustand for complex client/UI state. Use React Query or SWR for server state. Do not put server state in Zustand.

When multiple board-specific child components need the same client/UI state, they may read the feature-scoped Zustand hook directly. Keep workspace/project identifiers explicit so the store remains correctly scoped, and continue passing server-derived data as props.

## UI And Localization

- Use shadcn/ui and existing design conventions.
- Localize every user-visible string through Paraglide.
- Add or update messages in `src/paraglide/`; use generated messages in UI.
- Verify desktop and mobile behavior.
- Preserve accessibility, loading, empty, error, and permission states.

## Hygiene And Dependencies

- Add tests when behavior warrants them. Keep new code testable.
- Remove commented-out code before commit.
- Remove debug logging. Use project logger when logging is needed.
- Ask before installing dependencies.
- Never commit secrets, credentials, or local deployment files.

## Verification And Handoff

Run relevant checks, usually:

```text
pnpm check
pnpm exec tsc --noEmit
pnpm build
```

Report changes, assumptions, affected surface, and verification. Mention skipped checks and blockers.

## Commits

Use Conventional Commits:

```text
<type>(optional-scope): description
```

Allowed types include `feat`, `fix`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `perf`, and `revert`.

Use lowercase, imperative descriptions. No trailing period.

Examples:

```text
feat: add issue filters
fix(auth): scope customer session
refactor: split project feature
docs: update local setup
```
