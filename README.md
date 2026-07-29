# DTasks

DTasks is a GPL-3.0 B2B SaaS project-management platform for companies and
their customers.

Companies manage organizations, projects, team permissions, and internal
kanban boards. Invited customers use a branded project portal to submit issues,
follow progress, and approve resolutions.

The application is built around a shared backend with project-scoped customer
access, issue triage, review requests, and room for future notifications, chat,
analytics, and audit logs.

## Development

```bash
pnpm install
pnpm convex:dev
```

In a second terminal:

```bash
pnpm dev
```

Local Convex development uses an anonymous deployment and requires
`pnpm convex:dev` to remain running.
