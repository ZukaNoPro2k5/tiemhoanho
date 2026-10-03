# Product & Architecture Decisions

Record meaningful changes here so different AI agents do not repeatedly reopen settled questions.

## D-001 — Mobile first

**Decision:** Design and verify the core experience at 390x844 first. Desktop is secondary.

**Reason:** The intended play context is mobile browser/social-link traffic.

## D-002 — Bouquet Designer is the core product

**Decision:** Protect bouquet interaction/visual quality before adding management breadth.

**Reason:** The finished bouquet is the strongest differentiation and social artifact.

## D-003 — Client-first MVP

**Decision:** No mandatory account/backend for MVP.

**Reason:** Reduce friction and implementation scope while validating the core loop.

## D-004 — DOM/SVG before game engine

**Decision:** Start with React + DOM/SVG/CSS transforms for bouquet composition.

**Reason:** UI-heavy product, limited scene complexity, simpler accessibility/integration. Revisit only after performance evidence.

## D-005 — Explainable scoring

**Decision:** Use deterministic semantic/budget/color/freshness rules, not an AI/image aesthetic score.

**Reason:** Players need understandable feedback and reliable offline behavior.

## D-006 — Milestone 0 application foundation

**Date:** 2026-10-03

**Status:** accepted

**Decision:** Bootstrap Vite + React + strict TypeScript, CSS/Tailwind tokens, tests, basic PWA and CI. Defer routing, Motion, Zustand and player persistence until their first real consumers. Milestone 0 has a static shop shell only.

**Reason:** Follow the explicitly assigned foundation scope and minimize unused dependencies. Details and verification are in [ADR-002](decisions/002-m0-application-foundation.md).

## New decision template

### D-XXX — Title

**Date:** YYYY-MM-DD

**Status:** proposed / accepted / superseded

**Decision:**

**Reason:**

**Alternatives considered:**

**Consequences:**
