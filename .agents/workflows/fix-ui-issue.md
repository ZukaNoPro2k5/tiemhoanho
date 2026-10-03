# Workflow: Fix UI Issue

## Purpose

Resolve one reproduced UI/mobile defect with the smallest safe change and evidence that the original issue is gone.

## When to Use

Use for a concrete visual, responsive, touch, motion or state-presentation finding.

## Required Inputs

- Exact finding with severity, flow, viewport and reproduction steps.
- Changed-file scope and expected behavior.
- Relevant UI/design/skill documents.
- Before evidence when available.

## Selected Skills

Use mobile-game-ui and visual-qa; add cozy-art-direction, motion-language, game-state-management or performance-budget only when the finding touches that boundary.

## Owner / Reviewer

The original UI owner or Antigravity implements. Codex reviews state/typing/test impact; Claude reviews if the fix changes architecture or product behavior.

## Outputs

- A focused fix with no unrelated redesign.
- Before/after evidence at the failing viewport.
- Regression checks and updated finding status.

## Stop Conditions

Stop when reproducing the issue requires a missing app/build, the expected behavior conflicts with product/design docs, the smallest fix would change a domain contract or a destructive migration is required.

## Procedure

1. Reproduce the finding at the named flow and viewport.
2. Identify the smallest responsible component/style/state boundary.
3. Preserve domain rules, content contracts and existing interaction behavior outside the finding.
4. Make the narrow fix; avoid broad token or layout rewrites without evidence.
5. Run relevant component/unit checks and the exact browser flow.
6. Recheck 390x844 and affected alternate widths.
7. Check console, overflow, touch target and reduced-motion impact where relevant.
8. Report whether the finding is fixed, deferred or blocked with evidence.

## Verification

A fix is PASS only when the original reproduction is rerun successfully. A build-only result is insufficient for a visual/mobile finding.

## Handoff

~~~text
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~
