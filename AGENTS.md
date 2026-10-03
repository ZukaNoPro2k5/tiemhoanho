# TiemHoaWeb Agent Instructions

## Project identity

TiemHoaWeb is a mobile-first cozy flower-shop web game. The core fantasy is making beautiful bouquets for small customer stories and gradually making the shop feel personal.

The repository currently contains the product and AI development foundation only. Inspect the repository before assuming an application stack, dependency set or source tree.

## Source of truth

- Read docs/01_PRD_MVP.md before product work.
- Read the matching domain documents listed in README.md before changing behavior or contracts.
- Use docs/12_DECISIONS.md and docs/decisions/ for accepted decisions.
- Use .agents/skills/ for project-specific constraints and .agents/workflows/ for repeatable procedures.
- When sources conflict, stop, report the conflict and record an accepted change; never silently reinterpret product behavior.

## Product priorities

1. UI/UX and visual delight.
2. Tactile, cute, screenshot-worthy bouquet creation.
3. Customer requests and reactions with emotional context.
4. Lightweight management systems.
5. Mobile web quality before desktop embellishment.

Protect the bouquet moment before adding breadth. MVP exclusions are multiplayer, guilds, gacha, energy/lives, large farming, employee simulation, city maps, mandatory accounts and payments.

## Engineering defaults

- Use strict TypeScript and React functional components once application code exists.
- Keep game rules in pure domain functions outside React components.
- Keep content/data separate from logic and user-facing copy out of components.
- Prefer simple DOM/SVG/CSS solutions; the current decision is DOM/SVG before a game engine.
- Avoid new dependencies and backend work until repository inspection and evidence justify them.
- Avoid any without a documented reason.
- Version save schemas and provide migrations/recovery before changing persistent state.
- Prefer explicit, reversible architecture over layers, event buses or abstractions without a current consumer.

## Ownership and file scope

One task has one active owner. Use separate branches/worktrees for parallel work.

| Area | Default owner | Review/support |
|---|---|---|
| Product/architecture/specs | Claude | Codex technical review |
| src/domain, src/store, persistence and tests | Codex | Claude architecture review |
| UI features, responsive styling and browser flows | Antigravity | Codex tests, Claude scope review |
| src/content contracts and balance data | Codex with Claude/content review | Antigravity for presentation |
| .agents/, prompts and workflow docs | One explicitly assigned owner | All agents review their usage |

Ownership is a default, not permission to edit another agent's dirty worktree. Handoff through a branch/PR or deliberate sequential transfer.

## UI invariants

- Primary viewport: 390x844 CSS px.
- Support 360–430px widths; check 360px when mobile layout changes.
- Minimum interactive target: 44x44 CSS px.
- Respect safe-area insets and browser chrome.
- No hover-only critical interactions.
- Avoid dense dashboard UI; the shop scene should feel like the game.
- Use prefers-reduced-motion and keep interaction available during expressive motion.

## Workflow levels

- SMALL: copy, icon, isolated CSS/config. Self-review; run targeted checks. Browser QA only when visible layout/behavior changes.
- MEDIUM: component, modal, customer card, inventory slice or animation. Codex owns logic; Antigravity owns UI. Run unit/component/integration checks and browser QA for mobile interaction.
- LARGE: bouquet crafting, customer state, progression, save, economy or decorating. Claude plans/guards architecture, Codex implements/tests, Antigravity performs browser/mobile QA. Update docs/specs/ADR when contracts change.

Choose the level before editing. Stop and reclassify when scope grows.

## Git and worktrees

- Branch names: feature/<slug>, fix/<slug>, refactor/<slug>, test/<slug>, visual/<slug>, ux/<slug>, chore/<slug>.
- Keep main protected by convention: no force push and no unverified merge.
- Keep commits focused; use Conventional Commit style when useful.
- Never share a dirty working tree between agents.
- Check git status before work and report changed files/verification before handoff.
- Use scripts/setup-worktrees.sh or standard Git worktree commands; do not overwrite existing targets.

## Required verification

Before claiming a task complete, run the relevant formatter/lint, typecheck, unit/component tests, critical E2E tests and mobile visual checks. If a command is not applicable or cannot run, state NOT RUN with the reason. Also check empty/loading/error states when the feature has them and confirm no unrelated regressions.

## Handoff format

Every handoff must contain:

~~~
SUMMARY
CHANGED
TESTED
NOT TESTED
RISKS
FOLLOW-UP
~~~

Claims must be evidence-backed. Review findings use P0/P1/P2 severity with an exact file, flow or viewport reference and the smallest concrete fix.

## Documentation map

| Need | Read |
|---|---|
| Product/MVP | docs/00_PRODUCT_VISION.md, docs/01_PRD_MVP.md |
| Gameplay | docs/02_GAME_DESIGN.md |
| UX/design system | docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md |
| Architecture/state/content | docs/05_TECH_ARCHITECTURE.md, docs/06_DATA_MODEL.md, docs/07_CONTENT_SCHEMA.md |
| Plan/backlog/QA | docs/08_IMPLEMENTATION_PLAN.md, docs/09_TASK_BACKLOG.md, docs/10_TESTING_QA.md |
| Decisions/agents | docs/12_DECISIONS.md, docs/13_MULTI_AGENT_WORKFLOW.md, docs/AI_DEVELOPMENT_SYSTEM.md |

The definition of done is the combination of the task acceptance criteria, docs/10_TESTING_QA.md and the applicable project skill/workflow.
