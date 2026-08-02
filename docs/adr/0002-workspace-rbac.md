# ADR 0002: Fixed workspace roles with permission-based authorization

## Status

Accepted

## Context

DTasks needs predictable authorization for internal workspace users while preserving a path to configurable roles. The existing collaboration foundation stored `owner` and `member` roles and checked a small permission map, but it did not support administrators, read-only access, member lifecycle operations, or a role-management interface.

Customer access has a different security boundary: customers must be scoped to invited projects and customer-visible work. Treating a customer as a workspace role would expose internal workspace resources.

## Decision

Internal workspace memberships use four fixed roles:

- `owner`: complete workspace control and ownership transfer.
- `admin`: workspace, member, project, and task administration without ownership control.
- `member`: project and task contribution without workspace administration.
- `viewer`: read-only internal access.

There is exactly one owner. Ownership can only be transferred atomically to an existing workspace member. The previous owner becomes an admin. Invitations can assign `admin`, `member`, or `viewer`, but never `owner`.

Backend functions authorize stable permission keys such as `projects.create` and `tasks.move`. Role comparisons are limited to protected ownership and role-hierarchy invariants. Frontend capability checks improve the experience but never replace Convex authorization.

Admins can manage members and viewers. Only the owner can appoint, change, or remove admins. Viewers cannot be assigned new tasks.

Customers remain outside workspace membership. A future customer portal will use separate project-scoped memberships, routes, queries, and safe customer-facing data shapes.

## Future configurable roles

The fixed role-to-permission resolver is the customization seam. A later release can add workspace role records, store permission keys on those records, backfill memberships with role IDs, and replace the resolver without changing project and task authorization call sites.

The owner remains a protected system concept even after custom roles are introduced.

## Consequences

- Existing `owner` and `member` records remain valid without a destructive migration.
- Permission behavior is centralized and testable.
- The UI can render actions from returned capabilities instead of duplicating role logic.
- Custom role definitions and permission-selection UI are intentionally outside the initial release.
- Customer access requires a separate implementation rather than another workspace-role literal.
