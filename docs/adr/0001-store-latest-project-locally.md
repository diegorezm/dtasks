# ADR 0001: Store recent project navigation locally

## Status

Accepted

## Decision

Store the ordered list of recently opened project IDs in browser `localStorage`, using a workspace-scoped key and retaining at most five projects.

## Context

The Projects sidebar needs to remain a link to the full project list while also offering quick access to recently opened projects. This preference is not part of project domain data and does not need to synchronize across users or devices.

## Consequences

- The preference is isolated per workspace and browser.
- A new browser or cleared storage shows no recent-project submenu.
- Server persistence can be introduced later if cross-device continuity becomes a product requirement.
