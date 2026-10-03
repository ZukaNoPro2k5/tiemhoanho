# Workflow: Regression Check

## Purpose

Establish that a change or merge did not break existing TiemHoaWeb behavior, contracts or mobile presentation.

## When to Use

Use after implementation, conflict resolution, branch update, review fixes or any change to shared state/components.

## Required Inputs

- Base and head revisions or changed-file list.
- Task acceptance criteria and relevant docs/skills.
- Available package scripts and browser flow definitions.
- Known risk areas and previous findings.

## Selected Skills

Select game-state-management, flower-shop-gameplay, game-economy, mobile-game-ui, visual-qa and performance-budget according to the changed files.

## Owner / Reviewer

Codex owns automated regression checks. Antigravity owns browser/mobile checks for UI/flow changes. Claude reviews scope for architecture/product changes.

## Outputs

- Cheapest meaningful automated checks first.
- Affected browser/visual/performance evidence.
- Explicit PASS, FAIL or NOT RUN per check.
- Remaining risk and next safe task.

## Stop Conditions

Stop when the baseline is already failing and the failure cannot be attributed, the app cannot launch, or a shared contract changed without a migration/decision path.

## Procedure

1. Inspect the diff and identify affected domain, state, content, UI, asset and performance surfaces.
2. Run formatting/lint and typecheck if configured.
3. Run focused unit/component tests, then the full relevant suite.
4. Run critical E2E flows when routing, persistence, delivery, diary/share or other cross-screen behavior changed.
5. Run visual/mobile QA at 390x844 and affected alternate widths for UI/flow changes.
6. Run a performance profile for drag, asset, bundle, long-task or rendering changes.
7. Check console errors and empty/loading/error states exposed by the change.
8. Compare results with the baseline and record unrun checks instead of inferring them.
9. Hand off with exact commands, output summaries, risks and follow-up.

## Verification

A regression PASS requires no new failures and evidence for every applicable check. A check that cannot run is NOT RUN with a reason; it is not silently treated as PASS.

## Handoff

~~~text
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~
