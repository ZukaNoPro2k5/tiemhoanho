# Multi-Agent Workflow — Claude + Codex + Antigravity

This document defines ownership and sequencing. Detailed procedures live in .agents/workflows/; domain constraints live in .agents/skills/.

## 1. Shared rules

- docs/ is product and architecture truth; AGENTS.md is the shared execution contract.
- One task has one implementation owner at a time.
- Parallel work uses separate branches/worktrees and non-overlapping file scopes.
- Agents read existing code and patterns before editing.
- Agents do not silently change product behavior, introduce dependencies or claim unrun verification.
- Every handoff includes changed files, evidence, risks and next safe tasks.

## 2. Default roles

### Claude Code — Feature Architect + Gameplay Engineer

Owns feature decomposition, product interpretation, domain modelling, large feature implementation and architecture decisions. Claude prepares specs/plans and guards gameplay invariants; it is not the default owner for every UI polish or QA pass.

### Codex — Implementation + Refactor + Test + Reviewer

Owns focused implementation, pure domain logic, persistence/migrations, unit/integration tests, bug fixing, typing, lint and review. Codex is the second pair of eyes after important feature work.

### Antigravity — Visual Engineer + Browser QA Agent

Owns browser interaction, responsive UI, mobile viewport checks, screenshots, UX findings and visual polish. Antigravity verifies real flows, not only page load.

## 3. Workflow levels

| Level | Examples | Primary owner | Review | Tests | Browser QA | Documentation |
|---|---|---|---|---|---|---|
| SMALL | Typo, icon, isolated CSS/config/text | Agent closest to the file | Self-review; Codex if behavior changes | Targeted lint/typecheck/focused test | Only for visible behavior/layout changes | Only when a contract changes |
| MEDIUM | Component, modal, customer card, inventory slice, animation | Codex for logic; Antigravity for UI | Other relevant agent | Unit/component plus affected integration | Required for changed mobile interaction | Update feature/task docs when behavior/contracts change |
| LARGE | Bouquet crafting, customer state, progression, save, economy, decorating | Claude architecture; Codex implementation; Antigravity UI/QA | Codex technical + Antigravity browser + Claude scope review | Domain, integration, component and critical E2E | 390x844 and 360px; 430x932 when responsive | Feature spec, plan and ADR/decision when architecture changes |

Select the level before editing. Reclassify if the scope grows.

## 4. Default pipeline

~~~
idea
  -> product spec when behavior is non-trivial
  -> technical plan for LARGE work
  -> Claude architecture/domain implementation
  -> Codex implementation review and automated tests
  -> Antigravity browser/mobile QA for UI or flow changes
  -> performance check when interaction/assets/rendering changed
  -> targeted fixes
  -> PR review
  -> verified merge
~~~

Use the smallest pipeline that proves the task. Start with .agents/workflows/implement-feature.md and add the review, visual, mobile or regression playbook required by the task level.

## 5. Branch and worktree policy

Use purpose-based names:

~~~
feature/<task-slug>
fix/<task-slug>
refactor/<task-slug>
test/<task-slug>
visual/<task-slug>
ux/<task-slug>
chore/<task-slug>
~~~

Recommended local layout:

~~~
../tiemhoa-claude
../tiemhoa-codex
../tiemhoa-antigravity
~~~

Use scripts/setup-worktrees.sh for explicit branch/path pairs or standard git worktree commands. The helper refuses existing paths and existing local branches; it never deletes or overwrites. Keep main free of force pushes and unverified merges.

Before work:

~~~
git status --short --branch
git pull --ff-only
~~~

Run git pull --ff-only only when the task is intentionally updating from the shared remote; do not use it to hide local changes.

## 6. Milestone ownership

### Milestone 0 — Foundation

- Owner: Codex.
- Scope: inspect/initialize the actual app stack, scripts, design tokens, app shell, PWA scaffold and CI only when the repository is ready for application code.
- Reviewer: Claude.
- Visual smoke check: Antigravity at 390x844.
- Constraint: no gameplay feature work.

### Milestone 1 — Bouquet prototype

- Domain/geometry owner: Codex — content types, deterministic placement, z-order, validation and pure tests.
- Interaction/UI owner: Antigravity after domain contracts are stable — canvas, tray, tap, drag, selection/removal, wrap preview and reduced motion.
- Reviewer: Claude.
- Review question: does the implementation protect tactile composition or make it fiddly/ugly?

### Milestone 2 — First complete order

- Codex: order schemas, scoring, price, reason generation, unit tests.
- Antigravity: shop/request/reaction UI and mobile flow.
- Claude: request clarity, explainable scoring and scope review.

### Milestone 3 — Day/content/persistence

- Codex: store, versioned persistence, migrations, inventory and data validation.
- Claude/content review: content tone and schema consistency.
- Antigravity: end-of-day mobile presentation and flow QA.

### Milestone 4 — Diary/share

- Codex: stable bouquet records, reconstruction and export contracts.
- Antigravity: diary UI and real browser share/fallback behavior.
- Claude: review diary as memory/collection rather than transaction history.

### Milestone 5 — UI polish

- Owner: Antigravity.
- Reviewer: Claude against cozy-art-direction, mobile-game-ui, motion-language and visual-qa.
- Codex: targeted performance/refactor fixes discovered by evidence.

### Milestone 6 — Release candidate

- Codex: save recovery, tests, build correctness and performance engineering.
- Antigravity: browser/mobile E2E and visual regression.
- Claude: PRD, scope and decision audit.

## 7. Handoff contract

Every agent ends with:

~~~
SUMMARY

CHANGED
- path/to/file — why

TESTED
- command or manual flow — PASS/FAIL

NOT TESTED
- check — reason

RISKS
- known limitation or none

FOLLOW-UP
- next safe task or none
~~~

Review findings are P0/P1/P2, ordered by impact, and include an exact file/flow/viewport reference and smallest concrete fix.

## 8. Conflict protocol

If docs conflict with code:

1. Stop the conflicting change.
2. Preserve user data and working behavior where possible.
3. Record the observed conflict and options.
4. Add/update an ADR for architectural changes.
5. Update docs/12_DECISIONS.md only after the decision is intentionally accepted.

Do not ask multiple agents to implement the same feature and pick a winner. Do not use screenshots as proof of touch behavior. Do not merge failing verification because another agent might repair it later.

## 9. Detailed playbooks and skills

- Implementation: .agents/workflows/implement-feature.md
- Review: .agents/workflows/review-feature.md
- Visual QA: .agents/workflows/visual-qa.md
- Mobile QA: .agents/workflows/mobile-qa.md
- UI fix: .agents/workflows/fix-ui-issue.md
- Regression: .agents/workflows/regression-check.md
- Domain skills: .agents/skills/
