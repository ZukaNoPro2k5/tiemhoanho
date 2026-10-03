# Workflow: Mobile QA

## Purpose

Check whether a TiemHoaWeb flow is usable on representative phone viewports and browser conditions.

## When to Use

Use for responsive changes, touch gestures, sheets/modals, navigation, forms, keyboard interaction, safe-area work or any UI change that may affect 360–430px widths.

## Required Inputs

- Running app and real flow.
- Expected primary action and relevant states.
- Viewports 375x667, 390x844 and 430x932; add 360px for overflow-sensitive work.
- docs/03_UX_UI_SPEC.md, docs/10_TESTING_QA.md and mobile-game-ui/visual-qa skills.

## Selected Skills

Use mobile-game-ui and visual-qa. Add motion-language for animated transitions and performance-budget for drag/render changes.

## Owner / Reviewer

Antigravity owns the browser check. The UI implementation owner fixes findings; Codex verifies logic/state regressions.

## Outputs

- Per-viewport result for flow completion, overflow, touch targets and safe areas.
- Keyboard/browser-bar/landscape observations when relevant.
- Concrete P0/P1/P2 findings and rerun evidence.

## Stop Conditions

Stop when the app cannot launch, the flow depends on unavailable device-only behavior, or a blocking layout makes further checks unreliable. Mark the unavailable check NOT RUN and record the reason.

## Procedure

1. Start from a clean/reproducible state and record browser/device emulation.
2. Run the flow at 390x844 first.
3. Check that every critical target is at least 44x44 CSS px and reachable one-handed.
4. Check horizontal overflow, clipped text, safe-area insets, bottom controls and dynamic viewport height.
5. Test page scroll versus pointer/drag behavior; verify hover is not required.
6. Check focus, contrast, keyboard opening and landscape fallback when affected.
7. Repeat at 375x667, 430x932 and 360px as required by the change.
8. Report each viewport and state separately; do not average failures away.

## Verification

A mobile PASS names every checked viewport and records flow completion, overflow, touch, safe-area and relevant state results.

## Handoff

~~~text
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~
