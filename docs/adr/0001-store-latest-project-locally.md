# ADR 0001: Store the latest project navigation locally

## Status

Accepted

## Decision

Store the latest opened project ID in browser `localStorage`, using a workspace-scoped key.

## Context

The Projects sidebar item is a navigation convenience. It should return a user to the most recent project they opened, but this preference is not part of project domain data and does not need to synchronize across users or devices.

## Consequences

- The preference is isolated per workspace and browser.
- A new browser or cleared storage falls back to the Projects list.
- Server persistence can be introduced later if cross-device continuity becomes a product requirement.
