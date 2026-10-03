# Multi-Agent Workflow — Claude + Codex + Antigravity

## 1. Goal

Use multiple coding agents without creating three conflicting interpretations of the product.

Rules:

- `docs/` is the product/architecture source of truth.
- `AGENTS.md` is the shared execution contract.
- One task has one implementation owner at a time.
- Parallel agents must work on non-overlapping task/file scopes or separate worktrees.
- Every handoff includes verification results, changed files, unresolved risks and next task IDs.

## 2. Suggested responsibilities

These are operating roles, not hard capability limits.

### Claude Code — planner / spec guardian / reviewer

Best use in this project:

- read the complete product context;
- refine ambiguous feature behavior;
- create implementation plans;
- review architecture and UX against docs;
- review a completed milestone for scope creep;
- write/update ADRs when a meaningful decision changes.

Do not use Claude merely to rewrite code another agent just wrote unless there is a concrete review finding.

### Codex — implementation / domain / test owner

Best use in this project:

- repository bootstrap;
- pure TypeScript domain logic;
- store/persistence/migrations;
- scoring/economy/order generation;
- test suites;
- focused refactors and performance fixes.

### Antigravity — interactive UI / browser QA owner

Best use in this project:

- bouquet drag/touch UI;
- responsive/mobile visual iteration;
- onboarding/reaction/diary screen implementation;
- browser-based regression checks;
- screenshot/visual artifact review;
- end-to-end interaction verification.

## 3. Branch/worktree policy

Recommended naming:

```text
main
ai/codex-A-foundation
ai/codex-C-scoring
ai/antigravity-B-bouquet-ui
ai/antigravity-H-polish
ai/claude-review-m1
```

Do not let two agents edit the same feature branch concurrently.

Before starting work:

```bash
git status
git pull --ff-only
```

Before handoff:

```bash
npm run lint
npm run typecheck
npm test
# plus relevant E2E command
```

Adapt commands to the actual package manager/scripts once the repo exists.

## 4. Milestone assignment

### Milestone 0 — Foundation

**Owner:** Codex

Tasks: A-01..A-06.

**Reviewer:** Claude.

**Visual smoke check:** Antigravity at 390x844.

Handoff requirement:

- exact command results;
- package choices;
- deviations from recommended architecture;
- no gameplay feature work.

### Milestone 1 — Bouquet prototype

Split into two sequential scopes.

**Scope 1A — domain/geometry**

Owner: Codex.

- B-01 content types.
- B-03 deterministic assisted placement.
- B-08 z-order strategy.
- B-09 validation.
- pure tests.

**Scope 1B — interaction/UI**

Owner: Antigravity after 1A merges.

- B-02 canvas.
- B-04 tray.
- B-05 add.
- B-06 drag.
- B-07 selection/remove.
- B-10 wrap/ribbon preview.
- B-12 reduced motion.
- B-13 interaction tests.

**Milestone reviewer:** Claude.

Review question: “Does the implementation protect the bouquet experience, or did engineering convenience make it fiddly/ugly?”

### Milestone 2 — First complete order

**Codex:** C-01..C-11 scoring/order domain.

**Antigravity:** D-01..D-06 customer/request/reaction UI and mobile interaction.

Do these sequentially if they touch shared flow/state files.

**Claude:** review request clarity, explainability of scoring and scope.

### Milestone 3 — Day/content/persistence

**Codex owner:** E-01..E-09 plus data validation infrastructure.

**Claude/content pass:** review F-01..F-06 against content schema and tone; implementation owner can remain Codex.

**Antigravity:** end-of-day mobile presentation and flow QA.

### Milestone 4 — Diary/share

**Codex:** stable bouquet reconstruction/export data contracts.

**Antigravity:** G-02/G-03 UI and G-07/G-08 real browser behavior.

**Claude:** review that diary feels like a memory/collection, not transaction history.

### Milestone 5 — UI polish

**Owner:** Antigravity.

**Reviewer:** Claude using `prompts/UI_REVIEW_PROMPT.md` criteria.

Codex handles targeted performance/refactor tasks discovered during polish.

### Milestone 6 — Release candidate

**Codex:** tests, save recovery, performance engineering, build correctness.

**Antigravity:** browser/mobile E2E and visual regression.

**Claude:** final PRD/scope/decision audit.

## 5. Task handoff format

Every implementation agent should end with:

```text
TASKS COMPLETED
- B-03 ...

FILES CHANGED
- src/...

BEHAVIOR
- ...

VERIFICATION
- lint: PASS
- typecheck: PASS
- unit: PASS (N tests)
- e2e: PASS / not applicable
- mobile 390x844: PASS

KNOWN RISKS
- ...

NEXT SAFE TASKS
- B-04
- B-05
```

No “done” without verification evidence.

## 6. Conflict protocol

If an agent discovers that docs conflict with existing code:

1. Do not silently reinterpret product behavior.
2. Preserve user data and existing working behavior where possible.
3. Write the conflict and recommendation.
4. If architectural, add/propose an ADR.
5. Update `docs/12_DECISIONS.md` only when the decision is intentionally accepted.

## 7. Review protocol

A reviewer should review against three axes:

### Product

- Does it satisfy the PRD acceptance criteria?
- Did scope creep appear?

### UX

- Is the mobile interaction clear and delightful?
- Does it remain usable at 360px?

### Engineering

- Are domain rules testable/deterministic?
- Is new complexity justified?
- Do tests cover changed behavior?

Review output should be concrete findings, ordered P0/P1/P2, with file/flow references when possible.

## 8. What not to do with multiple agents

- Do not ask all three to independently implement the same feature and pick a winner.
- Do not allow “while you are here” broad refactors.
- Do not let one agent change the product spec solely to make its code easier.
- Do not use AI-generated screenshots as proof that touch behavior works; verify in browser.
- Do not merge branches with failing verification simply because another agent will “fix it later.”
