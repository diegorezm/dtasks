# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are company teams coordinating project work and customer delivery.
Invited customers are secondary users who need to see their own tickets and current status.

## Product Purpose

DTasks is a real-time project-management platform for companies and their customers. Company teams use it to organize and move project work through a kanban board. Customers use a scoped view to follow their own tickets and status. Product success means both audiences can see the right work and its current state without relying on separate status updates.

## Positioning

DTasks presents one project workflow through role-specific views: company teams manage work on a kanban board, while each invited customer sees only their own tickets and statuses.

## Operating Context

Company teams manage project work in a browser-based kanban workflow. Customers access project information through invitations and review ticket status in a customer-facing view. The product supports English and German localization in its current application setup.

## Capabilities and Constraints

- Browser-based application built with TanStack Start and TanStack Router.
- Real-time data is intended to be backed by Convex.
- Internal company access and customer access are separate product surfaces.
- Customer data and actions must remain scoped to invited projects and tickets.
- Role-based authorization must be enforced at backend boundaries, not only through frontend route guards.
- Better Auth is used for authentication.
- Product locales currently include English and German.
- Detailed role model, ticket fields, workflow states, and notification behavior remain undecided.

## Brand Commitments

- Product name: DTasks.

## Evidence on Hand

- `README.md` describes DTasks as a real-time project-management platform for companies and their customers.
- `src/routes/index.tsx` is currently a TanStack Start starter page; no production workflows are implemented there yet.
- `src/styles.css` contains an incumbent visual implementation with Manrope and Fraunces font imports and sea/lagoon color tokens. This is implementation evidence, not a confirmed product or brand requirement.
- `messages/en.json` and `messages/de.json` provide English and German localization sources.
- No customer testimonials, case studies, benchmarks, pricing, or other proof assets are present in the repository.

## Product Principles

- Show each audience only work they are authorized to see.
- Keep project state current through real-time updates.
- Give company teams an actionable workflow for moving work forward.
- Give customers a clear, low-noise view of their own tickets and status.
