# Workflow: Visual QA

## Purpose

Verify a real TiemHoaWeb user flow visually and interactively, with evidence that a screenshot or page load cannot provide.

## When to Use

Use after UI/flow changes, before visual handoff or when a visual regression is reported.

## Required Inputs

- Running app URL or start command.
- User flow and expected states.
- Viewport matrix: 390x844 baseline; 360px and 430x932 when affected.
- docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md and selected visual/mobile skills.

## Selected Skills

Use mobile-game-ui, cozy-art-direction, motion-language and visual-qa. Add performance-budget when the change affects drag, assets or rendering.

## Owner / Reviewer

Antigravity is the default owner. The implementation owner receives concrete findings; Claude reviews scope for larger changes.

## Outputs

- Flow/viewport evidence and screenshots for key states.
- Console and overflow results.
- P0/P1/P2 findings with exact fixes.
- Rerun result after fixes.

## Stop Conditions

Stop when the app cannot start, the critical flow cannot be reached, console errors prevent valid inspection, or a required state is unavailable. Report the blocker and last valid evidence.

## Procedure

1. Open the app and record build/browser/device context.
2. Set 390x844 and perform the real flow from the starting state.
3. Capture the initial, interaction, success/reward and relevant empty/loading/error states.
4. Inspect hierarchy, bouquet/customer focus, spacing, text wrapping, clipping, z-index and safe-area padding.
5. Inspect tapability, pressed/focus feedback, drag/scroll behavior and reduced-motion behavior.
6. Check the console and note errors/warnings relevant to the flow.
7. Repeat at 360px and 430x932 when layout, wrapping or safe area is affected.
8. File findings using P0/P1/P2 with flow, viewport, evidence and smallest fix.
9. After a fix, rerun the exact failing flow and viewport.

## Verification

Page load alone is NOT RUN for visual acceptance. A visual PASS names the flow, viewport, states, console result and rerun result.

## Handoff

~~~text
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~
