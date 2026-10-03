# ADR-002: Minimal Milestone 0 application foundation

**Status:** accepted

**Date:** 2026-10-03

## Context

The user explicitly assigned A-01–A-06 and restricted the implementation to an application foundation, with no gameplay. The repository previously contained development and product documentation only.

## Decision

Use Vite, React and strict TypeScript with npm and a committed lockfile. Require Node 22.13+ on the Node 22 line (or Node 24.x). Centralize CSS design tokens; use Tailwind's Vite integration without a component library. Keep Vietnamese copy in content definitions and the storefront illustration in a static SVG component.

Use a single screen with no routing dependency until another real screen exists. Defer Motion, Zustand and persistence until their first consumers exist. Use local system fonts that support Vietnamese rather than blocking rendering on a font service.

Configure Vitest/Testing Library, Playwright against production preview, and CI for formatting, lint, typecheck, unit tests and build. Browser smoke checks also run in CI after local verification. Use vite-plugin-pwa's generated worker with only static precaching. Automatic activation is appropriate for this stateless shell; revisit update prompting before gameplay saves or in-flight drafts exist.

## Alternatives considered

- Adding every recommended library now: creates unused infrastructure and conflicts with the milestone's dependency discipline.
- Plain CSS without Tailwind: sufficient for this screen, but the lightweight Vite integration preserves A-03's documented Tailwind direction.
- Custom service worker: adds lifecycle work already handled by the documented PWA plugin.
- History router and empty feature directories: deferred until there are real consumers.

## Consequences

The result is a small static foundation with no gameplay save to migrate. The shell explicitly communicates that the shop is being prepared. Initial art and system fonts are provisional; mobile layout is verified through screenshots and browser assertions. Deployment must serve over HTTPS and preserve root-relative assets; subpath hosting requires an explicit base/scope change.

## Verification / migration

Run npm ci, format:check, lint, typecheck, test, build and test:e2e. E2E checks production rendering, console/network failures, viewport overflow, manifest/icon delivery, worker activation and offline reload. No player-data migration is needed because no player data exists.

## Package compatibility references

Initialization checked current package versions and peer/engine ranges through the npm registry. Official documentation consulted: [Vite getting started](https://vite.dev/guide/), [Vitest guide](https://vitest.dev/guide/), [PWA registration](https://vite-pwa-org.netlify.app/guide/register-service-worker), and the [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node) and [artifact](https://github.com/actions/upload-artifact) action repositories. Exact installed versions are fixed by `package-lock.json`.
