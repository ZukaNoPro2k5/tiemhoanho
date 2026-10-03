# Skill: Visual QA

## Purpose

Evaluate TiemHoaWeb as a real mobile game experience rather than accepting a page that merely loads.

## When to Use

Use after a UI/flow change, before a visual handoff, during regression or whenever a layout/interaction issue is reported. Read docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md and docs/10_TESTING_QA.md first.

## Rules

1. Open the running page and perform the real user flow, not only a route load.
2. Set the primary viewport to 390x844; add 360px and 430x932 when layout or wrapping is affected.
3. Inspect screenshots at the start, critical interaction, success/reward and relevant empty/loading/error states.
4. Check visual hierarchy, bouquet/customer focus, spacing, text wrapping, clipping, z-index, modal layering and safe areas.
5. Check tapability, pressed/focus feedback, drag behavior, scroll conflicts and reduced-motion behavior.
6. Check the browser console for errors and record the exact flow and viewport.
7. Findings use P0/P1/P2:
   - P0 blocks the core flow or causes data loss.
   - P1 materially harms mobile usability, clarity or visual quality.
   - P2 is a contained polish issue.
8. A fix is complete only after the same flow and viewport are rerun.

## Forbidden Patterns

- Calling a page visually verified because it loaded.
- Using a generated screenshot as proof of touch behavior.
- Reporting generic design preferences without a screenshot, flow or viewport reference.
- Checking desktop only for a mobile-first change.
- Ignoring empty, loading, error, disabled or locked states that the feature exposes.
- Fixing unrelated UI while a focused QA task is in progress.

## Examples

Good finding: P1 — Bouquet Designer — 390x844 — flower tray overlaps the delivery action after the keyboard opens — reproduce by focusing the card field — reserve dynamic bottom inset and rerun the same flow.

Bad finding: “The screen feels off.” It has no evidence, location, severity or smallest fix.

## Checklist

- Flow and starting state recorded.
- 390x844 checked; affected alternate widths checked.
- Screenshot evidence captured for key states.
- Console checked.
- Overflow, text wrapping, touch target and safe-area checks completed.
- Motion/reduced-motion and interaction feedback checked.
- Findings grouped P0/P1/P2 with exact fix and rerun step.
- No unrelated redesign included.

## Definition of Done

Visual QA is ready when the real flow has evidence at the required viewport(s), findings are concrete and severity-ranked, and any accepted fixes were rerun successfully.
