# Milestone 1 — Parallel Launch (3 agents)

**Goal:** Run Codex, Antigravity and a second Claude session at the same time on Milestone 1, with no shared files, then integrate in a fixed order.

**Source of truth:** [2026-10-03-m1-bouquet-prototype.md](2026-10-03-m1-bouquet-prototype.md) (the plan) and [the spec](../specs/2026-10-03-m1-bouquet-prototype-design.md). This file only changes *when* and *where* each part runs; it does not change any task content.

**Base:** every lane branches from the commit that adds this file on `chore/m1-bouquet-spec`. The base holds the spec and plan, so the plan's `git switch main && git switch -c …` setup lines are skipped; the branches already exist.

## Lanes

| Lane | Agent | Branch | Worktree | Plan tasks | Writes only |
|---|---|---|---|---|---|
| A | Codex | `feature/m1-bouquet-domain` | `../tiemhoa-m1-domain` | 1–7 | `src/domain/**`, `src/content/{flowers,wraps,bouquetRules}.ts` and their tests, `docs/06_DATA_MODEL.md` |
| B | Antigravity | `feature/m1-bouquet-ui` | `../tiemhoa-m1-ui` | 8–12 now, 13 after A merges | `src/content/designer.ts`, `src/content/shell.ts`, `src/components/**`, `src/features/bouquet/**`, `src/styles/**`, `src/app/**`, `e2e/**`, `playwright.config.ts`, `.github/workflows/ci.yml` |
| C | Claude (2nd session) | `docs/m1-decisions` | `../tiemhoa-m1-docs` | 14, steps 1–5 | `docs/02_GAME_DESIGN.md`, `docs/08_IMPLEMENTATION_PLAN.md`, `docs/09_TASK_BACKLOG.md`, `docs/12_DECISIONS.md` |
| Integrator | Claude (this session) | `chore/m1-bouquet-spec` | main checkout | 14, step 6 + merges | reviews, this file |

No file is written by two lanes. The single exception is Lane B's temporary scaffold, which is removed before merge (below).

## How Lane B starts before Lane A is merged

Every code block in Part A was executed and validated when the plan was written (see the plan's Provenance line). Lane B therefore copies the **source** files of Tasks 1–6 verbatim from the plan into one commit:

```
chore(m1): TEMP domain scaffold from plan [drop on rebase]
```

Files in that commit, and nothing else: `src/domain/catalog.ts`, `src/domain/bouquet/{types,random,geometry,compose,draft,history}.ts`, `src/content/{flowers,wraps,bouquetRules}.ts`. No Part A tests.

Lane B never edits these files afterwards. If one blocks Lane B, Lane B stops that thread and reports it as a Lane A defect.

At integration, after Lane A merges:

```bash
git rebase --onto main <TEMP-sha> feature/m1-bouquet-ui
```

This replays only Lane B's own commits onto the real domain. Any drift between Lane A's code and the plan shows up there as a type or test failure.

## Frozen contract for Lane A

Exported names, function signatures, type shapes, content ids, rule keys and their values are exactly those in the plan. Internal changes are allowed only to make a plan step pass, and each one is listed under RISKS with `file:line` and the reason. A contract change needs a handoff to the integrator before it is committed.

## Shared rules (all lanes)

- Work only in your own worktree, on your own branch, inside your "Writes only" column. A needed change elsewhere goes under FOLLOW-UP, not into the diff.
- Add no dependencies. Do not merge, force-push, push to another lane's branch, or remove or move a worktree.
- Port 4173 is shared machine-wide and Playwright uses `--strictPort`. If `npm run test:e2e` fails because the port is in use, wait a minute and retry. Never kill a process you did not start.
- One commit per plan task, Conventional Commits, ending with the attribution line your harness requires.
- Report every check as PASS / FAIL / NOT RUN with the exact command. Never claim a check passed from reading the code.
- End with the docs/13 §7 handoff (SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP), both in the PR body and in your final message.

## Pre-launch (once, by the user)

```bash
cd /home/tts/Downloads/tiemhoanho
git log -1 --oneline          # must be the commit that adds this file
scripts/setup-worktrees.sh \
  feature/m1-bouquet-domain ../tiemhoa-m1-domain \
  feature/m1-bouquet-ui     ../tiemhoa-m1-ui \
  docs/m1-decisions         ../tiemhoa-m1-docs
sudo npx playwright install-deps webkit   # optional; without it Lane B marks WebKit NOT RUN
```

Then open each worktree in its agent and paste the matching prompt below.

---

## Prompt — Lane A (Codex)

~~~text
You are Codex, Lane A of the Milestone 1 parallel launch.
Worktree: ../tiemhoa-m1-domain   Branch: feature/m1-bouquet-domain (already created; do not switch branches).

Read first:
- AGENTS.md
- docs/superpowers/plans/2026-10-06-m1-parallel-launch.md (lanes, frozen contract, shared rules)
- docs/superpowers/plans/2026-10-03-m1-bouquet-prototype.md: Global Constraints, Review Focus, File Map, Part A (Tasks 1–7)
- docs/superpowers/specs/2026-10-03-m1-bouquet-prototype-design.md §5–7 and §10
- .agents/workflows/implement-feature.md and the relevant .agents/skills (domain/determinism)

Do:
1. npm ci
2. Execute Tasks 1–7 exactly as written, test-first, one commit per task. Skip the plan's "git switch main / switch -c" setup; the base already contains the plan.
   Task 4's test imports draft.ts from Task 5, so write Task 5's draft.ts before running Task 4's test (as the plan says).
3. Task 7 step 2 expects: 46 unit tests (2 App + 44 domain/content) and 7 unchanged shell E2E. Report the real numbers.
4. Push and open a PR against main:
   title: feat(m1): bouquet domain and content
   body: "Implements Part A of docs/superpowers/plans/2026-10-03-m1-bouquet-prototype.md" + your handoff.
   The PR also carries the spec/plan/launch docs commits it shares with Lane C; say so in the body.

Constraints:
- Write only: src/domain/**, src/content/{flowers,wraps,bouquetRules}.ts + tests, docs/06_DATA_MODEL.md.
- Frozen contract: exported names, signatures, type shapes, content ids, rule keys and values exactly as in the plan.
  Lane B is building against the plan's code right now. Any deviation goes in RISKS with file:line.
- src/domain/** must not import React, the DOM, features or components.
- No new dependencies. Do not merge.

End with SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP.
~~~

## Prompt — Lane B (Antigravity)

~~~text
You are Antigravity, Lane B of the Milestone 1 parallel launch.
Worktree: ../tiemhoa-m1-ui   Branch: feature/m1-bouquet-ui (already created; do not switch branches).

Read first:
- AGENTS.md
- docs/superpowers/plans/2026-10-06-m1-parallel-launch.md (lanes, TEMP scaffold, shared rules)
- docs/superpowers/plans/2026-10-03-m1-bouquet-prototype.md: Global Constraints, Review Focus, File Map, Part A (read-only reference), Part B (Tasks 8–13)
- docs/superpowers/specs/2026-10-03-m1-bouquet-prototype-design.md §8–11
- docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md and the relevant .agents/skills (mobile UI, visual QA)

Do:
0. npm ci && npx playwright install chromium webkit
1. TEMP scaffold, one commit, exact message:
     chore(m1): TEMP domain scaffold from plan [drop on rebase]
   Create, verbatim from the plan's Part A code blocks (final state of each file, applying the steps in order):
     src/domain/catalog.ts
     src/domain/bouquet/{types,random,geometry,compose,draft,history}.ts
     src/content/{flowers,wraps,bouquetRules}.ts
   No Part A tests. Run npm run typecheck && npm run lint before committing. Record the commit SHA.
   Never edit these files afterwards. If one is wrong, stop that thread and report it as a Lane A defect.
2. Execute Tasks 8, 9, 10, 11 and 12 exactly as written, test-first, one commit per task. Skip the plan's "after Part A is merged" setup.
   The plan's unit-test totals include Part A's 44 tests, which are absent here. Compare your own tests only and report the real totals.
   If WebKit cannot launch (missing system libraries), report the WebKit project as NOT RUN with the error. Chromium must pass.
3. Do not start Task 13 yet. It tunes src/content/bouquetRules.ts and the compose snapshot, which belong to Lane A, and its device evidence must come from the final code.
   You may take screenshots at 360x800 and 390x844 (Bó and Lẵng, empty, 9 stems, stem selected) and list the visual issues you see as FOLLOW-UP.
4. Push and open a DRAFT PR against main:
   title: feat(m1): bouquet designer UI [DRAFT — contains TEMP scaffold]
   body: TEMP scaffold SHA + your handoff. Do not mark it ready and do not merge.

Constraints:
- Write only: src/content/designer.ts, src/content/shell.ts, src/components/**, src/features/bouquet/**, src/styles/**, src/app/**, e2e/**, playwright.config.ts, .github/workflows/ci.yml (plus the TEMP scaffold files, once).
- Every Review Focus item 1–5 in the plan must be covered by the tests the plan names. Report each one with PASS/FAIL.
- 44×44 px targets, no hover or long-press dependence, tokens only for colors, radii, shadows and motion. No router, Motion or Zustand. No new dependencies.

End with SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP.
~~~

## Prompt — Lane C (Claude, second session)

~~~text
You are Claude, Lane C (docs) of the Milestone 1 parallel launch.
Worktree: ../tiemhoa-m1-docs   Branch: docs/m1-decisions (already created; do not switch branches).

Read first:
- AGENTS.md, CLAUDE.md
- docs/superpowers/plans/2026-10-06-m1-parallel-launch.md
- docs/superpowers/plans/2026-10-03-m1-bouquet-prototype.md, Task 14
- docs/superpowers/specs/2026-10-03-m1-bouquet-prototype-design.md
- docs/01_PRD_MVP.md, docs/02_GAME_DESIGN.md, docs/08_IMPLEMENTATION_PLAN.md, docs/09_TASK_BACKLOG.md, docs/12_DECISIONS.md

Do:
1. Task 14 steps 1–4 exactly as written: D-007 (status proposed) at the end of docs/12; the docs/02 §3 arrangement-style and adjustment text; the docs/08 Milestone 1 lines; B-14 and B-15 in docs/09.
   Match each file's existing heading style and wording.
2. Read-only consistency pass. Compare the spec and plan with docs/01, 02, 03, 06, 08 and 09. List every conflict as P0/P1/P2 with file:line and a proposed decision.
   Do not fix conflicts outside the four files you own. Docs/06 belongs to Lane A.
3. Run git diff --check and npm run format:check. Report the results.
4. Commit on docs/m1-decisions (one commit: docs(m1): record arrangement styles and display-shelf decision), push, and open a PR against main:
   title: docs(m1): bouquet prototype spec, plan and decisions
   body: your handoff + the consistency findings.
   Note in the body that it must be merged with "Rebase and merge" or a merge commit, not squash, because Lanes A and B share its base commits.

Constraints:
- Write only: docs/02_GAME_DESIGN.md, docs/08_IMPLEMENTATION_PLAN.md, docs/09_TASK_BACKLOG.md, docs/12_DECISIONS.md.
- Do not touch src/, e2e/, config or the other lanes' branches. Do not review Lanes A or B; the integrator does that.

End with SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP.
~~~

---

## Integration (integrator, after the three handoffs)

1. **Collect** the three handoffs and PRs. Check that each diff stays inside its "Writes only" column (`git diff --stat <base>..<branch>`).
2. **Lane C → main.** Review the doc edits and consistency findings. Merge with rebase or a merge commit, never squash.
3. **Lane A → main.** Review against spec §6–7, the frozen contract and determinism (seeded placement, snapshot, undo restores exactly). Send P0/P1 findings back to Codex, then merge.
4. **Lane B rebase.** Run `git rebase --onto main <TEMP-sha> feature/m1-bouquet-ui`, then the full suite: `npm run format:check && npm run lint && npm run typecheck && npm test && npm run test:e2e && git diff --check`. Any failure here is plan drift. Assign it to the lane that owns the file.
5. **Lane B review** against spec §8–11 and Review Focus 1–5. Send findings back to Antigravity.
6. **Lane B, phase 2.** Antigravity runs Task 13 on the rebased branch: rules and art tuning, compose snapshot update, iPhone and Android device matrix, performance trace and `docs/m1-bouquet-verification.md`. Then the PR is marked ready, reviewed and merged.
7. **M1 exit.** Check docs/08 Milestone 1 exit criteria and the spec §14 against `docs/m1-bouquet-verification.md`. Mark anything without evidence as NOT RUN.
