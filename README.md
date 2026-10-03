# TiemHoaWeb — AI Development System

TiemHoaWeb is a mobile-first cozy flower-shop web game where the player makes beautiful bouquets, serves small customer stories and gradually personalizes a flower shop.

This repository is the active project workspace. It currently contains the product specification and multi-agent development foundation; application code and the runtime stack are intentionally not bootstrapped yet.

## North star

Protect the moment when a player finishes a bouquet and wants to save or share it.

Priority order:

UI/UX & visual delight > bouquet interaction > customer emotion > progression > management depth

## Agent quickstart

1. Read AGENTS.md.
2. Read docs/AI_DEVELOPMENT_SYSTEM.md for roles, task levels, skills and workflows.
3. Read docs/01_PRD_MVP.md and the domain documents relevant to the task.
4. Inspect the actual repository before assuming a framework, package or source path.
5. Use a dedicated branch/worktree and one active owner per task.
6. End with the standard SUMMARY / CHANGED / TESTED / NOT TESTED / RISKS / FOLLOW-UP handoff.

## Current state

- Product, gameplay, UX, design, architecture, data, content, QA and collaboration docs exist under docs/.
- Shared agent rules exist in AGENTS.md, CLAUDE.md, .agents/rules/ and .claude/rules/.
- Project skills and workflow playbooks live under .agents/skills/ and .agents/workflows/.
- There is currently no package.json, src/, test runner, CI workflow or repository-local MCP configuration.
- The documented application direction is React + TypeScript with DOM/SVG/CSS bouquet composition; validate the actual stack when Milestone 0 begins.

## Product scope

MVP validates the 60–120 second loop:

~~~
customer request -> bouquet design -> wrap/ribbon/card -> delivery
-> explainable reaction -> cash/reputation -> diary/share
~~~

MVP includes local versioned save and installable PWA basics. It excludes multiplayer, guilds, gacha, energy/lives, large farming, employee simulation, city maps, mandatory accounts and payments.

## Task routing

| Level | Use for | Default path |
|---|---|---|
| SMALL | Copy, icon, isolated CSS/config | Implementer self-review; targeted checks; browser QA only for visible behavior |
| MEDIUM | Component, modal, customer card, inventory slice, animation | Codex logic/tests or Antigravity UI; affected browser QA |
| LARGE | Bouquet crafting, progression, save, economy, decorating | Claude architecture → Codex implementation/review → Antigravity browser/mobile QA |

Start with .agents/workflows/implement-feature.md; use review-feature.md, visual-qa.md, mobile-qa.md, fix-ui-issue.md or regression-check.md as the task requires.

## Documentation map

| Task | Read |
|---|---|
| Product/feature | docs/01_PRD_MVP.md, docs/02_GAME_DESIGN.md |
| UI/UX | docs/03_UX_UI_SPEC.md, docs/04_DESIGN_SYSTEM.md |
| Architecture/state/content | docs/05_TECH_ARCHITECTURE.md, docs/06_DATA_MODEL.md, docs/07_CONTENT_SCHEMA.md |
| Planning/QA | docs/08_IMPLEMENTATION_PLAN.md, docs/09_TASK_BACKLOG.md, docs/10_TESTING_QA.md |
| Agents/tools | docs/13_MULTI_AGENT_WORKFLOW.md, docs/14_TOOLING_SECURITY.md, docs/AI_DEVELOPMENT_SYSTEM.md |

## Project skills

Use only the skills relevant to the task:

- cozy-art-direction
- mobile-game-ui
- motion-language
- flower-shop-gameplay
- game-economy
- content-schema
- asset-pipeline
- game-state-management
- visual-qa
- performance-budget

pixijs-scene is deliberately not present because the current decision is DOM/SVG first. Revisit it only with measured evidence and an accepted decision.

## Verification

The repository has no runtime commands yet. Do not invent lint/typecheck/test results. For the current documentation foundation, use git diff --check, shell syntax checks, required-section/path checks and the worktree helper's isolated tests. Once application code exists, add the documented lint, typecheck, unit/component, E2E, mobile and performance checks.
