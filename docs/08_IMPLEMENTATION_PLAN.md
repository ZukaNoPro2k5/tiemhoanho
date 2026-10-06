# Implementation Plan

Build vertical slices. Do not implement all infrastructure before the first playable bouquet.

## Milestone 0 — Repo foundation

Implemented foundation: single shop shell, centralized CSS/Tailwind tokens, strict TypeScript, unit/browser tests, basic PWA and CI. Routing/state libraries remain deferred until actual gameplay screens exist; see ADR-002.

Deliverables:

- Vite + React + TypeScript project.
- Tailwind/theme tokens.
- ESLint/Prettier.
- Vitest.
- Playwright.
- PWA plugin scaffold.
- Basic routes/app shell.
- Core docs copied into repo.

Exit criteria:

- `dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e` scripts exist.
- CI can run lint/typecheck/tests.
- 390x844 shell renders without horizontal overflow.

## Milestone 1 — Bouquet interaction prototype

Build only enough to answer whether arranging flowers feels good.

Deliverables:

- 6 temporary flower assets.
- Bouquet canvas.
- Flower tray.
- Tap-to-add with deterministic assisted placement.
- Drag to reposition.
- Select, rotate, resize, layer reorder and remove; undo.
- Max stem count.
- Wrap preview (3 wraps) and Bó/Lẵng arrangement styles.

Exit criteria:

- Interaction works with touch/pointer.
- No page-scroll conflict inside canvas.
- Bouquet reconstructs deterministically from stored normalized layout.
- Drag remains responsive on target mobile hardware/browser.

Exit evidence: `docs/m1-bouquet-verification.md`.

## Milestone 2 — First complete order

Deliverables:

- One customer/order.
- Request UI.
- Price calculation.
- Scoring domain functions.
- Reaction view.
- Cash/reputation reward.

Exit criteria:

- New user can go from shop -> bouquet -> reaction without dev tools.
- Score breakdown explains result.
- Core domain scoring has unit tests.

## Milestone 3 — Day loop + content system

Deliverables:

- Data-driven flowers/materials/customers/orders.
- 12 flowers, 6 wraps, 6 ribbons, basic cards.
- 5 orders/day.
- End-of-day summary.
- Simple inventory/freshness.

Exit criteria:

- Complete a full day.
- Refresh does not lose progress.
- Content additions do not require editing flow components.

## Milestone 4 — Diary + share

Deliverables:

- Flower Diary.
- Bouquet detail.
- Share-card renderer.
- Web Share API + fallback.

Exit criteria:

- Any completed bouquet can be reopened and visually reconstructed.
- Share image is generated consistently on supported mobile browsers.

## Milestone 5 — Art/UI polish

Deliverables:

- Final-ish art direction applied.
- Motion polish.
- Empty/error states.
- Onboarding coach marks.
- Audio optional only if it does not delay visual quality.

Exit criteria:

- UI has no placeholder/admin-dashboard feel.
- First session is understandable without instructions outside the game.

## Milestone 6 — PWA/performance/release candidate

Deliverables:

- PWA install metadata.
- Offline app shell.
- Asset compression/lazy loading.
- Mobile E2E regression suite.
- Error boundary/recovery for save corruption.

Exit criteria:

- Production build deploys.
- Critical E2E tests pass on mobile emulation.
- No known P0/P1 bugs in core loop.

## After MVP validation

Only then prioritize among:

- manual flower purchasing;
- special events/weather;
- recurring customer storylines;
- shop decoration;
- dried flowers;
- daily challenge;
- cloud sync/account.
