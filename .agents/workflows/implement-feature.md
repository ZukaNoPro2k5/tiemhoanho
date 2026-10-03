# Workflow: Implement Feature

## Purpose

Move a TiemHoaWeb task from a scoped request to a reviewable implementation with evidence.

## When to Use

Use for any code, content, state, UI or configuration change. Select SMALL, MEDIUM or LARGE before editing.

## Required Inputs

- Task ID, goal, acceptance criteria and non-goals.
- AGENTS.md and docs/AI_DEVELOPMENT_SYSTEM.md.
- Relevant product/domain/UI docs.
- Existing code/tests/config inspected in the current branch/worktree.
- Selected skills from .agents/skills/.

## Selected Skills

Name only the skills relevant to the task. Typical examples are flower-shop-gameplay for loop changes, game-state-management for saves, mobile-game-ui for UI and visual-qa for browser work.

## Owner / Reviewer

Assign one implementation owner. Name a reviewer before editing. LARGE work normally uses Claude for architecture, Codex for logic/tests and Antigravity for browser/mobile QA.

## Outputs

- Focused changes within the task scope.
- Automated and manual verification evidence.
- Updated docs/decision records when a contract changes.
- Standard handoff with risks and follow-up.

## Stop Conditions

Stop and report when the task conflicts with a product/architecture decision, the scope grows beyond its level, a required dependency/secret/tool is missing, user data could be endangered or verification cannot establish the acceptance criteria.

## Procedure

1. Check branch/worktree status and confirm the owner.
2. Read AGENTS.md, the task-specific docs and selected skills.
3. Inspect existing patterns and list files likely to change.
4. Classify the task:
   - SMALL: targeted file change, self-review and focused checks.
   - MEDIUM: component/domain slice, tests plus affected browser QA.
   - LARGE: spec/plan, domain tests, review and mobile/browser evidence.
5. Write the smallest implementation plan with acceptance criteria and non-goals.
6. Implement only the planned slice; keep domain rules outside UI components.
7. Run formatter/lint, typecheck and relevant tests when those commands exist.
8. Run visual/mobile QA for UI or flow changes at 390x844 and affected alternate widths.
9. Check empty/loading/error/disabled/locked states that the change exposes.
10. Review the diff for unrelated changes and prepare the handoff.

## Verification

Report each check as PASS, FAIL or NOT RUN with the exact command or manual flow. Do not substitute a build result for mobile or domain verification.

## Handoff

~~~text
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~
