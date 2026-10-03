# Workflow: Review Feature

## Purpose

Review a completed change against TiemHoaWeb product intent, mobile UX and engineering contracts.

## When to Use

Use after a feature implementation, before merge or when Codex is acting as the second pair of eyes.

## Required Inputs

- Branch/worktree diff and changed-file list.
- Task goal, acceptance criteria, non-goals and task level.
- AGENTS.md, relevant product/domain/UI docs and selected skills.
- Test and browser evidence from the implementer.

## Selected Skills

Select the skills implied by the diff, commonly flower-shop-gameplay, game-economy, game-state-management, mobile-game-ui, visual-qa, motion-language or performance-budget.

## Owner / Reviewer

The reviewer must be independent from the implementation owner when practical. Claude reviews scope/architecture, Codex reviews implementation/tests, and Antigravity reviews browser/mobile behavior.

## Outputs

- Findings ordered P0, P1 and P2.
- Approval, requested changes or blocked status.
- Exact file/flow/viewport references and smallest concrete fixes.
- Verification gaps marked NOT RUN.

## Stop Conditions

Stop when the diff cannot be understood without missing context, the task contract is absent, destructive or security-sensitive behavior is introduced, or the reviewer cannot reproduce a critical path.

## Procedure

1. Read the task and inspect the full diff, not only the summary.
2. Check product fit: MVP scope, bouquet focus, customer clarity and explainable rules.
3. Check UX fit: hierarchy, 44x44 targets, safe area, no hover dependency, Vietnamese wrapping and states.
4. Check engineering fit: pure domain rules, data-driven content, state boundaries, save versioning, dependency scope and tests.
5. Check performance/motion implications when rendering, drag, assets or animation changed.
6. Re-run the relevant automated checks and inspect evidence claims.
7. Record findings:
   - P0: core flow blocked, data loss or unsafe access.
   - P1: material behavior, mobile, clarity or visual regression.
   - P2: contained polish or maintainability issue.
8. Do not redesign beyond the evidence. Request one smallest fix per finding.
9. Approve only when acceptance criteria and required verification are evidenced.

## Verification

A review is not PASS when tests are merely mentioned. Record commands, output summaries and manual flow/viewport evidence. State NOT RUN explicitly.

## Handoff

~~~text
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~
