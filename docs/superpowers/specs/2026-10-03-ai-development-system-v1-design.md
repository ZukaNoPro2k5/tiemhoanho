# TiemHoaWeb AI Development System v1 — Design Specification

**Status:** approved for specification

**Date:** 2026-10-03

## 1. Goal

Create a small, executable development system that lets Claude Code, OpenAI Codex and Google Antigravity work on TiemHoaWeb with shared product context, explicit ownership, predictable handoffs and evidence-based verification.

This system is a development foundation. It does not implement gameplay, bootstrap an unconfirmed frontend stack or add external services.

## 2. Current state

The repository currently contains a product/architecture documentation kit and AI instruction files, but no application implementation:

- no `package.json`, lockfile, `src/`, test runner, CI workflow or build configuration;
- no repository-local MCP configuration;
- root `AGENTS.md`, `CLAUDE.md`, `.agents/rules/` and `.claude/rules/` already define useful product, UX and engineering constraints;
- `docs/00_PRODUCT_VISION.md` through `docs/13_MULTI_AGENT_WORKFLOW.md` define the MVP, domain model, proposed architecture, QA expectations and a first-pass multi-agent workflow;
- the documented renderer decision is React + DOM/SVG/CSS for the MVP, with a game engine deferred until performance evidence requires one.

The system must treat the current stack as **unconfirmed**. When Milestone 0 starts, the implementing agent must inspect and record the selected stack before adding dependencies.

## 3. Design principles

1. `AGENTS.md` is the short, shared contract. Detailed rules live in domain docs and project skills.
2. One task has one implementation owner at a time.
3. Parallel work requires separate branches/worktrees and non-overlapping file ownership.
4. Product behavior is read from the existing PRD and domain docs, not inferred from a generic game template.
5. Skills encode TiemHoaWeb-specific constraints; workflows encode repeatable procedures.
6. Documentation must stay actionable. A new file is justified only when it removes a recurring decision or failure mode.
7. Verification claims require command output or an explicit `not run` statement.
8. The system prefers simple, reversible changes over a broad platform abstraction.

## 4. Agent operating model

### Claude Code — Feature Architect and Gameplay Engineer

Owns product interpretation, feature decomposition, domain modelling, large feature implementation and architecture decisions.

Claude reads the relevant product/domain docs first, writes plans for non-trivial work, keeps gameplay rules deterministic and prepares reviewable handoffs. Claude is not the default owner for every UI polish or QA task.

### Codex — Implementation, Refactor, Test and Review Engineer

Owns focused implementation, pure domain logic, persistence/migrations, tests, bug fixes, typing, lint and code review. Codex is the second pair of eyes after important feature work and must review behavior against both acceptance criteria and project invariants.

### Antigravity — Visual Engineer and Browser QA Agent

Owns interactive UI polish, responsive behavior, browser workflows, screenshots and mobile/visual QA. Antigravity tests real user flows at the required viewports and reports evidence-based findings. A page loading successfully is not sufficient visual QA.

### Ownership rule

Agent roles describe default ownership, not permission to edit another agent's active worktree. Handoffs happen through a branch/PR or a deliberate sequential transfer. No two agents edit the same feature branch concurrently.

## 5. Documentation hierarchy

| Layer | Location | Responsibility |
|---|---|---|
| Shared contract | `AGENTS.md` | Short rules every agent must follow |
| Role guidance | `CLAUDE.md`, `.agents/AGENTS.md` | Claude-specific reasoning and `.agents` conventions |
| Product truth | `docs/00_PRODUCT_VISION.md`, `docs/01_PRD_MVP.md` | Product intent, MVP scope and priorities |
| Domain truth | `docs/02_GAME_DESIGN.md`, `docs/06_DATA_MODEL.md`, `docs/07_CONTENT_SCHEMA.md` | Rules, contracts and data/content constraints |
| UI truth | `docs/03_UX_UI_SPEC.md`, `docs/04_DESIGN_SYSTEM.md` | Mobile UX, visual language and motion constraints |
| Technical truth | `docs/05_TECH_ARCHITECTURE.md`, `docs/10_TESTING_QA.md` | Boundaries, test strategy and definition of done |
| Delivery truth | `docs/08_IMPLEMENTATION_PLAN.md`, `docs/09_TASK_BACKLOG.md`, `docs/13_MULTI_AGENT_WORKFLOW.md` | Milestones, task IDs, ownership and handoffs |
| Decisions | `docs/12_DECISIONS.md`, `docs/decisions/` | Accepted architectural/product decisions |
| Project skills | `.agents/skills/*/SKILL.md` | Reusable domain-specific checklists and constraints |
| Workflows | `.agents/workflows/*.md` | Step-by-step procedures for common agent jobs |

If two documents conflict, the agent stops and reports the conflict. It does not silently change product behavior. An accepted decision updates `docs/12_DECISIONS.md` and, for architectural changes, an ADR.

## 6. Project skills

Create ten focused skills under `.agents/skills/`. Each `SKILL.md` contains purpose, when to use, rules, forbidden patterns, examples, checklist and definition of done where useful.

### Keep as separate skills

- `cozy-art-direction`: visual personality, surface/shape/typography guidance and anti-generic-SaaS checks.
- `mobile-game-ui`: touch ergonomics, safe areas, viewport behavior, responsive layout and accessibility basics.
- `motion-language`: motion categories, timing, reduced-motion behavior and performance-safe animation rules.
- `flower-shop-gameplay`: low-stress loop, readable requests, tactile feedback and progression restraint.
- `game-economy`: central balance data, explainable rewards and protection against scattered magic numbers.
- `content-schema`: data-driven content contracts, validation and Vietnamese writing/content safeguards.
- `asset-pipeline`: asset naming, dimensions, anchors, formats, compression, loading and size budgets.
- `game-state-management`: boundaries between UI, gameplay, persistent, server and transient animation state; versioned saves.
- `visual-qa`: browser-based flow, viewport, screenshot, console and visual findings procedure.
- `performance-budget`: mobile bundle, image/texture, runtime, DOM and long-task budgets plus measurement expectations.

### Deliberately not created as a separate skill

- `pixijs-scene`: the current architecture decision is DOM/SVG first. A Pixi-specific skill is added only if a renderer decision is accepted based on measured limitations.
- `accessibility`: accessibility is part of `mobile-game-ui` for the current scope. It becomes separate only when the app has enough reusable UI to justify another focused contract.

## 7. Workflow playbooks

Create tool-agnostic Markdown playbooks under `.agents/workflows/`. They can be invoked by an agent or copied into a task prompt without relying on an unverified vendor-specific schema.

Required playbooks:

1. `implement-feature.md` — read, classify, plan, implement, test and hand off.
2. `review-feature.md` — review product, UX and engineering behavior with severity-ranked findings.
3. `visual-qa.md` — run a real browser flow and inspect screenshots, console, hierarchy, touchability and states.
4. `mobile-qa.md` — execute the viewport matrix and check safe area, overflow, browser chrome and thumb reach.
5. `fix-ui-issue.md` — reproduce, isolate, make the smallest UI fix, rerun the exact visual check.
6. `regression-check.md` — run the relevant automated and browser checks after a change or merge.

Each workflow must include entry conditions, required docs/skills, exact outputs, stop conditions and the standard handoff format.

## 8. Workflow levels

| Level | Typical scope | Primary owner | Review | Tests | Browser QA | Docs |
|---|---|---|---|---|---|---|
| SMALL | Copy, icon, CSS token, config or isolated typo | Agent closest to the file | Self-review; Codex if behavior changes | Targeted lint/typecheck or focused test | Only if visible behavior/layout changes | Only if a contract changes |
| MEDIUM | Component, modal, customer card, inventory slice or animation | Codex for logic; Antigravity for UI | Other relevant agent | Unit/component plus affected integration tests | Required for changed mobile interaction | Update feature/task docs when behavior or contracts change |
| LARGE | Bouquet crafting, customer state, progression, save, economy or shop decorating | Claude for architecture/domain; Codex for implementation; Antigravity for UI/QA | Codex technical review + Antigravity browser QA + Claude scope review | Domain, integration, component and critical E2E as applicable | Required at 390x844 and 360px; 430px when layout is affected | Feature spec, plan, ADR/decision when architecture changes |

The level is chosen before editing. A task that grows beyond its level stops and is reclassified rather than silently expanding.

## 9. Git and worktree model

Branches use a purpose prefix and a short task slug:

```text
feature/<task-slug>
fix/<task-slug>
refactor/<task-slug>
test/<task-slug>
visual/<task-slug>
ux/<task-slug>
chore/<task-slug>
```

Rules:

- `main` is protected by convention: no force push and no direct agent merge without verification.
- Commits are focused and use Conventional Commit style when it adds useful searchability.
- One active owner per branch; do not share a dirty worktree between agents.
- Before work: check `git status`, update the branch with fast-forward-only operations where appropriate, and read the task scope.
- Before handoff: report changed files, verification evidence, risks and next safe tasks.
- The worktree helper must refuse to overwrite existing directories or delete branches. It may create missing parent directories and new branches only after explicit arguments are supplied.

Recommended worktree layout:

```text
../tiemhoa-claude
../tiemhoa-codex
../tiemhoa-antigravity
```

The helper is an optional convenience. Standard Git commands remain the source of truth.

## 10. MCP and tooling policy

This repository does not install or configure external MCP servers in v1. The project keeps a recommendation/security matrix instead of inventing vendor configuration syntax.

### Core when implementation exists

- GitHub integration: repository/PR context, branch review and issue handoff; least-privilege repository scope; no automatic main merge.
- Browser automation (Playwright or equivalent): real mobile flow and regression evidence; local/test environment only by default.
- Chrome DevTools or equivalent: console, layout, performance and network inspection during visual QA.

### Recommended later

- Context7 or official documentation lookup: only when a library/API version is actually present and current docs are needed.
- Figma integration: when an approved design source exists; read-only by default.
- Storybook: only for reusable DOM UI components after enough components exist; never a requirement for the scene itself.
- Hosting integration: only after a deploy target is selected and credentials are scoped to preview environments.

### Optional / not needed now

- Motion-specific tooling: not needed until Motion is actually adopted in the application.
- PixiJS tooling: not needed while DOM/SVG satisfies the measured interaction/performance needs.
- Supabase/database tooling: not needed for client-first MVP; if introduced, read-only/project-scoped first.

No tool may receive production secrets, unrestricted destructive access, production database writes, billing permissions, cloud-resource deletion or force-push authority by default.

## 11. Testing and QA loop

The system uses a pyramid with the cheapest meaningful check first:

1. Pure unit tests for scoring, pricing, placement, progression, migrations and content validation.
2. Component/integration tests for user-visible state transitions and feature contracts.
3. Browser tests for critical flows that cross screens, persistence or share behavior.
4. Visual QA for mobile layout, touch behavior, hierarchy, motion and empty/loading/error states.
5. Performance checks for bouquet drag, bundle/assets, long tasks and unnecessary rerenders.

The required baseline viewport is 390x844. Affected mobile work also checks 360px; the wider 430x932 viewport is used when responsive behavior or layout wrapping is relevant.

No agent may claim a check that was not run. Handoffs use `PASS`, `FAIL`, or `NOT RUN` with the command or manual flow named.

## 12. Standard handoff

Every completed workflow emits:

```text
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
```

Review findings are ordered P0/P1/P2 and include an exact file, flow or viewport reference plus the smallest concrete fix.

## 13. Target repository shape

This foundation adds only development infrastructure around the existing documentation kit:

```text
.
├── AGENTS.md
├── CLAUDE.md
├── .agents/
│   ├── AGENTS.md
│   ├── rules/
│   ├── skills/*/SKILL.md
│   └── workflows/*.md
├── docs/
│   ├── AI_DEVELOPMENT_SYSTEM.md
│   ├── 00_PRODUCT_VISION.md ... 14_TOOLING_SECURITY.md
│   ├── decisions/001-ai-development-system-v1.md
│   └── superpowers/{specs,plans}/
├── prompts/
├── scripts/setup-worktrees.sh
└── templates/
```

The future application may use `src/app`, `src/features`, `src/domain`, `src/content`, `src/store`, `src/styles` and `src/assets` as described by the technical architecture document. This v1 foundation does not create those directories prematurely.

## 14. Validation criteria

The implementation is acceptable when:

- the shared/role documentation is concise and does not contradict the product docs;
- all ten skills contain the required sections and link to existing project docs;
- all six workflows name their inputs, outputs, verification and stop conditions;
- the worktree helper passes shell syntax validation and refuses unsafe existing targets;
- internal Markdown paths referenced by the new foundation resolve to existing files;
- no package, MCP server, game engine or gameplay implementation is added;
- the decision and tooling/security boundaries are documented;
- the final report can point a new agent from a task such as “implement customer order ticket”, “visual QA inventory screen” or “review bouquet crafting” to the correct docs, skills, workflow, tests and handoff format.

## 15. Explicit non-goals

- No React/Vite project bootstrap in this change.
- No dependency installation or lockfile creation.
- No PixiJS, Motion, Zustand, Storybook, Supabase or hosting setup.
- No gameplay feature, UI screen or asset generation.
- No automatic PR creation, merge, deployment or production access.
- No replacement of the existing product/domain documents with generic templates.
