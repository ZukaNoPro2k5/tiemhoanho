# Task Backlog

Use IDs in commits/PRs when practical.

## EPIC A — Foundation

- A-01 Initialize Vite React TypeScript strict project.
- A-02 Add lint/format/typecheck/test scripts.
- A-03 Add Tailwind and design tokens.
- A-04 Add router/app shell.
- A-05 Add PWA scaffold.
- A-06 Add CI pipeline.

## EPIC B — Bouquet Designer

- B-01 Define flower/material content types.
- B-02 Build bouquet coordinate plane.
- B-03 Implement deterministic assisted placement.
- B-04 Build flower tray.
- B-05 Tap-to-add stem.
- B-06 Drag-to-position stem.
- B-07 Selection/remove controls.
- B-08 Add z-order strategy.
- B-09 Add max/min stem validation.
- B-10 Add wrap/ribbon preview layers.
- B-11 Add bouquet price calculation.
- B-12 Add reduced-motion behavior.
- B-13 Add interaction tests.

## EPIC C — Orders & Scoring

- C-01 Define customer/order schemas.
- C-02 Seed first order.
- C-03 Build request UI.
- C-04 Implement tag score.
- C-05 Implement color score.
- C-06 Implement budget score.
- C-07 Implement freshness score.
- C-08 Implement structure sanity score.
- C-09 Build total score/reason generator.
- C-10 Build reaction tier/copy selector.
- C-11 Unit-test scoring boundaries.

## EPIC D — Core Flow

- D-01 Build shop scene.
- D-02 Customer arrival state.
- D-03 Route/transition shop -> designer.
- D-04 Add finishing stepper.
- D-05 Build reaction screen.
- D-06 Apply cash/reputation reward.
- D-07 Implement next-customer transition.

## EPIC E — Day & Persistence

- E-01 Create Zustand game store.
- E-02 Add versioned persistence layer.
- E-03 Add save migration scaffold.
- E-04 Generate/select 5 daily orders.
- E-05 Add inventory/freshness state.
- E-06 Consume inventory on delivery.
- E-07 Build end-of-day summary.
- E-08 Add next-day reset/refill behavior.
- E-09 Handle corrupt save gracefully.

## EPIC F — Content

- F-01 Seed 12 flowers.
- F-02 Seed 6 wraps.
- F-03 Seed 6 ribbons.
- F-04 Seed 8 cards/stickers.
- F-05 Seed 12 customer definitions.
- F-06 Create 30 order templates.
- F-07 Add content validation tests.

## EPIC G — Diary & Share

- G-01 Persist completed bouquet records.
- G-02 Build diary grid.
- G-03 Build diary detail.
- G-04 Reconstruct bouquet from record.
- G-05 Build share card component.
- G-06 Export card to image.
- G-07 Use Web Share API when supported.
- G-08 Implement fallback save/copy flow.

## EPIC H — UX Polish

- H-01 First-order contextual onboarding.
- H-02 Touch target audit.
- H-03 Safe-area audit.
- H-04 Empty state audit.
- H-05 Error state audit.
- H-06 Motion polish.
- H-07 Mobile visual regression checks.
- H-08 Accessibility pass.

## EPIC I — Release

- I-01 Final PWA icons/manifest.
- I-02 Offline shell verification.
- I-03 Asset compression.
- I-04 Lazy-load non-core routes.
- I-05 Production error boundary.
- I-06 Core Playwright suite.
- I-07 Performance profile bouquet drag.
- I-08 Release checklist.
