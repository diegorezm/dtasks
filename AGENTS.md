# DTasks Agent Guide

## Product

DTasks is a B2B project-management platform intended to have two surfaces:

- **Internal dashboard:** implemented for company users, with workspace, project, task, member, and workspace-invitation flows.
- **Branded customer portal:** planned, but not implemented in the current routes, schema, or data-access layer.

Workspace invitations currently create internal workspace memberships. Do not treat them as customer-portal invitations or customer authorization.

When implementing the customer portal, keep it separate from the internal dashboard in routes, behavior, authorization, and data access. Scope customer data and actions to explicitly invited projects, and do not expose internal data shapes.

## Repository Map

- `src/routes/`: TanStack Router framework boundary. Route files should remain thin and delegate to feature routes or views.
- `src/features/`: frontend behavior and UI organized by domain feature.
- `src/layouts/`: application-level page structure shared across features.
- `src/core/`: shared providers, configuration, branding, validation, and utilities.
- `src/components/ui/`: shared shadcn/ui primitives.
- `convex/`: schema, backend queries and mutations, authorization, and permission enforcement.
- `messages/`: editable Paraglide source messages. Current locales are `en` and `pt-BR`.
- `src/paraglide/`, `src/routeTree.gen.ts`, and `convex/_generated/`: generated output; never edit these files manually.

The usual frontend flow is `src/routes` → `src/features/<feature>/routes.tsx` or a feature view → Convex functions under `convex/`.

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

## Authorization And Permissions

Every new feature must explicitly define and implement its authorization model before it is considered complete.

- Identify the affected surface, actors, resource scope, and required permission keys during planning.
- Add stable, action-specific permissions to the centralized permission model. Authorize permissions, not scattered role-name comparisons.
- Enforce every protected query and mutation in Convex or the owning backend boundary. Route guards and hidden or disabled controls are UX only.
- Validate the full resource chain, such as task → project → workspace → membership, and reject mismatched workspace, project, customer, or resource IDs.
- Keep internal workspace access and customer portal access separate. Customer access must be project-scoped and use customer-safe data shapes.
- Return derived capabilities to the frontend and use them to hide or disable unavailable actions. Never trust capabilities sent back by the client.
- Preserve ownership and role-hierarchy invariants in backend mutations, including transfer, removal, invitation, and leave flows.
- Add tests for allowed and denied roles, unauthenticated access, cross-workspace or cross-project access, and relevant ownership or customer-scoping invariants.
- Include permission behavior and authorization verification in the feature handoff. Call out any skipped security tests as blockers or explicit follow-up work.

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
- Add or update source messages in `messages/en.json` and `messages/pt-BR.json`.
- Import generated message functions from `#/paraglide/messages` in application code. Never edit `src/paraglide/` directly.
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
