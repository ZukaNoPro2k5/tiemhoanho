# TiemHoaWeb AI Development System v1

## Current architecture

The repository now includes the Milestone 0 application foundation: Vite + React + strict TypeScript, centralized CSS/Tailwind tokens, a static mobile-first shop shell, unit/browser tests, basic PWA and CI. No gameplay, persistence, backend or repository-local MCP configuration exists.

The product source of truth remains docs/00–13. ADR-002 records the foundation stack and dependency deferrals. DOM/SVG/CSS remains the rendering direction; the current illustration is decorative and contains no bouquet algorithm.

## Gap analysis

### What exists

- Product vision, MVP PRD, gameplay rules and UX/design-system guidance.
- Data/content concepts, implementation milestones, backlog and QA expectations.
- Root/shared instructions and initial Claude/Codex/Antigravity prompts.
- GitHub remote, main branch and local worktree ignore policy.

### What was missing

- A single operating guide for roles, task levels and handoffs.
- Project-specific skills for art direction, mobile UI, gameplay, economy, content, assets, state, visual QA and performance.
- Repeatable implementation/review/mobile/regression playbooks.
- Explicit tooling/security recommendations without invented vendor config.
- A safe, argument-driven worktree helper.

### What stays unchanged

- Product priorities and MVP exclusions.
- DOM/SVG-first decision; no PixiJS by default.
- Client-first, local versioned save direction.
- Explainable scoring and data-driven content principles.
- No gameplay implementation in Milestone 0. Runtime dependency bootstrap is now complete.

## Agent roles

### Claude Code — Feature Architect + Gameplay Engineer

Use Claude for product interpretation, feature decomposition, domain modelling, large feature implementation, refactor planning and architecture decisions. Claude reads the relevant docs first, protects gameplay invariants and produces plans/specs for LARGE work.

### Codex — Implementation + Refactor + Test + Reviewer

Use Codex for focused implementation, pure domain rules, persistence/migrations, tests, bug fixes, typing, lint and second-pair-of-eyes review. Codex reports exact evidence and does not silently change contracts.

### Antigravity — Visual Engineer + Browser QA Agent

Use Antigravity for responsive UI, touch interaction, browser flows, screenshot inspection, visual iteration and mobile QA. Antigravity checks real user flows at the required viewports and reports concrete P0/P1/P2 findings.

One task has one active owner. Roles do not authorize concurrent edits to the same dirty worktree.

## Source-of-truth hierarchy

1. AGENTS.md — short shared contract.
2. CLAUDE.md and .agents/AGENTS.md — role and project-agent conventions.
3. Product/domain/UI docs — product and technical behavior.
4. docs/12_DECISIONS.md and docs/decisions/ — accepted decisions.
5. .agents/skills/ — reusable TiemHoaWeb-specific constraints.
6. .agents/workflows/ — repeatable procedures and evidence formats.
7. prompts/ and templates/ — copyable task entry points.

When a conflict appears, stop and report it. Accepted product changes update docs/12_DECISIONS.md; accepted architectural changes add or update an ADR.

## Task levels and routing

| Level | Use for | Primary owner | Review | Verification |
|---|---|---|---|---|
| SMALL | Copy, icon, isolated CSS/config/text | Agent closest to file | Self-review; Codex if behavior changes | Targeted checks; browser only for visible layout |
| MEDIUM | Component, modal, customer card, inventory slice, animation | Codex for logic; Antigravity for UI | Other relevant agent | Unit/component/integration plus affected browser flow |
| LARGE | Bouquet crafting, customer state, progression, save, economy, decorating | Claude architecture; Codex implementation; Antigravity UI/QA | Codex technical + Antigravity browser + Claude scope | Domain tests, integration/component, critical E2E, mobile and performance evidence |

Choose the level before editing. Reclassify when scope grows.

## Skill index

Use only the skills relevant to the task. Each skill supplements AGENTS.md.

| Skill | Use for |
|---|---|
| cozy-art-direction | Warm, handmade visual language and anti-generic UI |
| mobile-game-ui | One-handed mobile layout, safe area, touch and accessibility |
| motion-language | Consistent motion categories, timing and reduced motion |
| flower-shop-gameplay | Cozy loop, requests, feedback, progression and failure |
| game-economy | Central balance, score/reward rules and economy review |
| content-schema | Data-driven content, validation and Vietnamese copy |
| asset-pipeline | Asset IDs, anchors, formats, loading and size |
| game-state-management | State boundaries, persistence, migrations and recovery |
| visual-qa | Real browser flow, screenshots, console and findings |
| performance-budget | Mobile interaction, bundle, asset and runtime budgets |

A separate pixijs-scene or accessibility skill is intentionally not present in v1: DOM/SVG remains the renderer direction and accessibility is part of mobile-game-ui.

## Workflow index

- implement-feature.md — task intake, classification, implementation and handoff.
- review-feature.md — product, UX and engineering review.
- visual-qa.md — real user flow and screenshot evidence.
- mobile-qa.md — viewport, touch, safe-area and overflow checks.
- fix-ui-issue.md — focused UI reproduction/fix/rerun.
- regression-check.md — affected automated/browser/visual/performance checks.

## Git and worktree setup

Branch prefixes are feature, fix, refactor, test, visual, ux and chore. Keep one active owner per worktree and do not force-push main.

The helper accepts explicit branch/path pairs:

~~~bash
scripts/setup-worktrees.sh feature/bouquet-domain ../tiemhoa-claude test/bouquet-domain ../tiemhoa-codex visual/bouquet-ui ../tiemhoa-antigravity
~~~

It refuses existing paths and existing local branches, validates all pairs before changing Git state and never deletes or overwrites. Standard Git worktree commands remain valid.

## Testing and QA loop

1. Pure domain tests for scoring, price, placement, progression, migration and content validation.
2. Component/integration tests for state transitions and feature contracts.
3. Browser tests for cross-screen, persistence and share flows.
4. Visual/mobile QA at 390x844, plus affected 360px/430x932 widths.
5. Performance profile for bouquet drag, assets, bundle, long tasks and rendering.

Milestone 0 verification commands are `npm ci`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:e2e`. Playwright uses production preview, checks the mobile viewport matrix and PWA/offline shell, and attaches screenshots. Actual command results belong in the task handoff; physical-device performance and gameplay QA remain future work.

## Standard handoff

~~~text
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

Reviews use P0/P1/P2 with an exact file, flow or viewport reference and the smallest concrete fix.

## Definition of done

A task is ready only when:

- acceptance criteria are satisfied;
- relevant type/lint/unit/component/E2E checks pass, or are marked NOT RUN with reason;
- affected mobile behavior is checked at the required viewports;
- no horizontal overflow, hover dependency or obvious state gap remains;
- empty/loading/error/disabled/locked states are handled when applicable;
- no unrelated regressions or unapproved scope changes are present;
- docs/decisions are updated when behavior/contracts/architecture change;
- the standard handoff contains evidence, risks and follow-up.

## Security baseline

Least privilege is the default. No production secrets, unrestricted destructive commands, production database writes, cloud deletion, billing access or force-push authority are granted to agents by this repository. See docs/14_TOOLING_SECURITY.md.

## What is intentionally not added

- No PixiJS, Motion, Zustand, Storybook, Supabase or hosting integration.
- No gameplay feature, persistent player state or gameplay asset. The static shell and provisional install icons are foundation assets.
- No mandatory account/backend/social system.
- No automatic PR, merge, deploy or production operation.
