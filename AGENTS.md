# TiemHoaWeb Agent Instructions

You are working on TiemHoaWeb, a mobile-first cozy flower-shop web game.

## Source of truth

Read `docs/01_PRD_MVP.md` before product work. For domain-specific work, read the matching document under `docs/` listed in `README.md`.

## Product priorities

1. UI/UX and visual delight.
2. Bouquet creation must feel tactile, cute, quick, and screenshot-worthy.
3. Customer requests and reactions should create emotional context.
4. Management systems stay lightweight in MVP.
5. Mobile web quality comes before desktop embellishment.

## Engineering defaults

- TypeScript strict mode.
- React functional components.
- Prefer simple DOM/SVG/CSS solutions over a game engine.
- Keep game rules in pure domain functions, not React components.
- Keep content/data separate from logic.
- Avoid premature backend work.
- Avoid new dependencies when the platform or current stack can solve the problem cleanly.
- No `any` without a documented reason.
- Do not hardcode user-facing content throughout components; use content definitions.
- Save schema must have a version and migration path.

## UI invariants

- Primary design viewport: 390x844 CSS px.
- Must remain usable from 360px to 430px wide.
- Minimum touch target: 44x44 CSS px.
- Respect safe-area insets.
- No hover-only interactions.
- Avoid dense dashboard UI.
- Shop scene should feel like the UI, not an admin panel.
- Animations must support `prefers-reduced-motion`.

## Required verification

Before declaring a task complete:

1. Run formatter/lint.
2. Run TypeScript typecheck.
3. Run relevant unit/component tests.
4. Run critical E2E tests when the flow changes.
5. Check 390x844 mobile layout.
6. Check empty/loading/error states if applicable.
7. Confirm no unrelated regressions.

## Scope discipline

MVP exclusions include multiplayer, gacha, energy systems, large farming systems, employee simulation, city maps, and mandatory accounts. Do not build excluded systems without an explicit decision recorded in `docs/12_DECISIONS.md`.

## Change discipline

For significant architectural or product changes:

- Explain the reason.
- Update affected docs.
- Add an ADR using `templates/ADR.md` if the decision is architectural.
- Prefer small, reviewable changes over broad rewrites.
