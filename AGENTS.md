# DTasks Agent Guide

## Project

DTasks is a B2B project-management platform with two surfaces:

- Internal dashboard for company users.
- Branded customer portal for invited customers.

Organize application code around features, not file types. A feature should
keep its related UI, hooks, types, data access, and routes together. Avoid
scattering one feature across global `components/`, `hooks/`, `types/`, and
`pages/` directories.

Keep app-wide concerns in shared areas such as core configuration, providers,
layouts, styles, and reusable utilities. Keep feature-specific logic inside
its feature. If a type or utility is needed by multiple features, move it to a
shared location instead of importing private implementation details across
features.

Prefer a structure like:

```text
src/
  core/       # app-wide configuration, providers, styles, shared utilities
  layouts/    # application-level page structure
  features/   # self-contained product features
    <feature>/
      components/
      hooks/
      types/
      views/
      routes.ts
```

Keep `src/routes` as the framework routing boundary while feature route
definitions and feature behavior remain colocated where practical.

## Feature Intake and Delivery

For every product request, first decide whether it is a **feature**. Treat it
as a feature when it delivers a distinct user-facing capability or workflow
with its own domain behavior, data access, permissions, routes, or multiple
related UI states. Examples include project invitations, issue management, and
customer approvals. Small styling changes, isolated bug fixes, copy changes,
and narrow extensions to an existing workflow are not features unless they
materially create a new capability.

When a request is a feature:

1. State the feature classification and the intended outcome briefly.
2. Inspect the existing code and conventions before choosing the structure.
3. Ask clarifying questions only when an answer materially changes scope,
   behavior, permissions, or the data model. Ask at most **three** questions
   in total, preferably in one batch. If safe, make a reasonable assumption,
   state it, and continue rather than blocking on a preference.
4. Define the smallest MVP scope, including the affected surface (internal
   dashboard, customer portal, or both), roles, data boundaries, and primary
   success path. Keep nonessential variants out of the first implementation.
5. Implement the feature as a self-contained `src/features/<feature>/` area.
   Colocate its components, hooks, types, views, data access, and route
   definitions as applicable; create only the folders the feature needs.
   Expose shared code deliberately through `src/core` or another shared area.
6. Enforce authorization and project/customer scoping in Convex or other
   backend boundaries. Frontend guards may improve UX but are never the only
   access control.
7. Use shadcn/ui for new interface primitives, wire the framework route
   boundary in `src/routes`, regenerate generated route files with their
   owning command, and verify the implementation with the most relevant
   checks.
8. Report what was implemented, the assumptions made, and verification run.

For non-feature requests, make the smallest focused change in the existing
ownership area and avoid introducing a new feature directory or abstraction
without a clear need.

## Development Rules

- Use `pnpm`, not npm or yarn.
- Run `pnpm install` after dependency changes.
- Run `pnpm dev` for TanStack Start.
- Run `pnpm convex:dev` for the local anonymous Convex deployment.
- Keep Convex running while developing or testing frontend data access.
- Keep customer data and actions scoped to invited projects.
- Preserve role-based authorization at backend boundaries; do not rely only on
  frontend route guards.
- Keep internal dashboard behavior separate from customer portal behavior.
- Prefer small, focused changes that support the MVP before adding abstractions.
- Any text shown to users must be localized through Paraglide. Add or update
  the translation messages in `src/paraglide/` and use the generated Paraglide
  messages in the UI instead of hardcoding user-visible strings.

## UI Components

- Use shadcn/ui for UI components.
- Add new shadcn/ui components with `pnpm dlx shadcn@latest add <component>`.

## Commits

Use this format:

```text
<action>(optional): <commit>
```

Examples: `feat: add issue filters`, `fix(auth): scope customer session`,
`refactor: split project feature`, `docs: update local setup`.

## Stack

- TanStack Start and TanStack Router
- React and Tailwind CSS
- Convex for backend functions and data
- Better Auth for authentication
- Paraglide for localization
- Cloudflare Workers for deployment

## Commands

- `pnpm dev`: start frontend development server.
- `pnpm convex:dev`: start local Convex and sync functions.
- `pnpm build`: build application.
- `pnpm exec tsc --noEmit`: typecheck application.
- `pnpm check`: run Biome checks.
- `pnpm generate-routes`: regenerate TanStack route tree.

Generated files must be regenerated by their owning tool, not edited manually.
Do not commit secrets or local deployment credentials.
